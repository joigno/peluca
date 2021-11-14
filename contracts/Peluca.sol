// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Peluca is ERC20Capped
{
    string constant NAME = "Peluca";

    string constant SYMBOL = "PELUCA";

    // Defines number of Wei in 1 token
    // 18 decimals is standard - imitates relationship between Ether and Wei
    uint8 constant DECIMALS = 18;
    
    // 45*10^27 = 45 million tokens, 18 decimal places
    uint256 private constant CAP = 1000000 * (10**18); //45000000 * (10**18);

    /////////////////////////
    // Non-standard stuff ///
    /////////////////////////
    
    // initially inflationary, then flags start of deflationary period.
    bool private deflationaryPeriod = false;
    
    // drop size per mint during inflationary period (anyone can mint this)
    uint256 constant DROP_MINT = 6 * (10**18);

    // drop size per transfer to friends during inflationary period (anyone can mint this with a transfer to friends)
    uint256 constant DROP_TRANSFER = 12 * (10**18);
    
    // Hundred percent
    uint256 constant HUNDRED_PERCENT = 1000;

    // Burn Fee For Transfers (Deflationary): Zero point one percent    
    uint256 constant ZEROPOINT1_PERCENT = 1;
    
    // Current year for year deflation burns.
    uint256 constant FOUR_PERCENT = 40;
    uint256 constant SECONDS_PER_YEAR = 31557600;
    uint256 private initYearTimestamp = 0; // uninit.
    uint256 private nextTotalSupply = 0; // uinit.

    constructor (uint256 _cap)
        ERC20(NAME, SYMBOL)
        ERC20Capped(_cap)
    {
    }
    
    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public virtual {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }
    
    /**
     * @dev A flag showing if the token has started the endless deflationary period
     */
    function isDeflationaryPeriod() public view returns (bool) {
        return deflationaryPeriod;
    }
    
    /**
     * @dev A function to drop token to any sender during the initial inflationary period
     */
    function mint() public {
        require( !deflationaryPeriod, "Cannot mint after Deflationary Period starts.");
        
        uint256 dropAmount = DROP_MINT;
        // Check start of deflationary period.
        if (!deflationaryPeriod && totalSupply() + DROP_MINT >= cap()) {
            deflationaryPeriod = true;
            dropAmount = cap() - totalSupply();
        }

        // Mint, drop for anyone.
        _mint(_msgSender(), dropAmount);

        if(deflationaryPeriod) {
            resetDeflation();
        }
    }

    /**
     * @dev Return a timestamp in seconds
     */
    function nextDeflationReset() public view returns (uint256) {
        return initYearTimestamp + SECONDS_PER_YEAR;
    }

    /**
     * @dev An internal function to reset yearly inflation parameters, 
     *      ie. target supply during deflation
     */
    function resetDeflation() internal {
        initYearTimestamp = block.timestamp;
        // 4% of current supply.
        nextTotalSupply = ERC20.totalSupply() * FOUR_PERCENT / HUNDRED_PERCENT;
        // next supply is current minus 4%
        nextTotalSupply = ERC20.totalSupply() - nextTotalSupply;
    }

    /**
     * @dev Overload of traditional ERC20.transfer() to account for 
     *      the 0.1% deflationary burn per transaaction
     *      during the endless deflationary period. Each year 
     *      there is a maximum burn of 4% of the token supply.
     */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        require( amount > 0, "Can only transfer positive amounts.");
        uint256 burnAmount = 0;
        // Drop for transfers.
        if (!deflationaryPeriod) { // inflationary period
            uint256 dropAmount = DROP_TRANSFER;
            bool resetTarget = false;
            // Check start of deflationary period.
            if (ERC20.balanceOf(recipient) == 0 && totalSupply() + DROP_TRANSFER >= cap()) {
                deflationaryPeriod = true;
                dropAmount = cap() - totalSupply();
                resetTarget = true;
            }
            // mint drop to friend recipient of the transfer, if still has 0 balance.
            if (ERC20.balanceOf(recipient) == 0) {
                _mint(recipient, dropAmount);
            }
            if(resetTarget) { // first deflation reset.
                resetDeflation();
            }
        }
        else { // On deflationary period, burn transferFee = ZEROPOINT1_PERCENT
            if (ERC20.totalSupply() > nextTotalSupply) { // deflation target not reach yet.
                burnAmount = amount * ZEROPOINT1_PERCENT / HUNDRED_PERCENT; // 0.1% transfer fee to burn
                _burn(_msgSender(), burnAmount);
            }
            // check if a whole year has passed, and reset deflation.
            if (block.timestamp > nextDeflationReset()) {
                resetDeflation();
            }
        }
        
        // transfer minus transfer fee if deflationary.
        _transfer(_msgSender(), recipient, amount - burnAmount);
        return true;
    }

    /**
     * @dev Return max supply cap from ERC20Capped pattern
     */
    function getSupplyCap() public view returns (uint256) {
        return cap();
    }

    /**
     * @dev Return fixed drop size for mint() function
     */
    function getDropMint() public pure returns (uint256) {
        return DROP_MINT;
    }

    /**
     * @dev Return next supply target:
     *      - max cap for initial inflationary period;
     *      - next deflation goal for endless deflationary period;
     */
    function getNextSupplyTarget() public view returns (uint256) {
        if (!isDeflationaryPeriod()) {
            return cap();
        } else {
            return nextTotalSupply;
        }
    }

}

