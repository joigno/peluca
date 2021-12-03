// Sources flattened with hardhat v2.6.8 https://hardhat.org

// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v4.3.2

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract IPeluca 
{    
    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual;

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
    function burnFrom(address account, uint256 amount) public virtual;
    
    /**
     * @dev A flag showing if the token has started the endless deflationary period
     */
    function isDeflationaryPeriod() public view virtual returns (bool) ;
    
    /**
     * @dev A function to drop token to any sender during the initial inflationary period
     */
    function mint() public virtual;

    /**
     * @dev Return a timestamp in seconds
     */
    function nextDeflationReset() public view virtual returns (uint256) ;

    /**
     * @dev Overload of traditional ERC20.transfer() to account for 
     *      the 0.1% deflationary burn per transaaction
     *      during the endless deflationary period. Each year 
     *      there is a maximum burn of 4% of the token supply.
     */
    function transfer(address recipient, uint256 amount) public virtual returns (bool) ;

    /**
     * @dev Return max supply cap from ERC20Capped pattern
     */
    function getSupplyCap() public view virtual returns (uint256) ;

    /**
     * @dev Return fixed drop size for mint() function
     */
    function getDropMint() public pure virtual returns (uint256) ;

    /**
     * @dev Return next supply target:
     *      - max cap for initial inflationary period;
     *      - next deflation goal for endless deflationary period;
     */
    function getNextSupplyTarget() public view virtual returns (uint256) ;

}

contract PelucaDropper {

    address pelucaAddr = 0x353395eB36E03Fe72Dce4EE77558688969283F91;

    function mintMany(uint256 amount) public {
        require( amount > 6e18, "PelucaDropper: can only airdrop more than 6 PELUCA" );
        IPeluca peluca = IPeluca(pelucaAddr);
        uint256 its = amount / 6e18;
        for (uint i=0; i<its; i++) {
          // do one mint()
          peluca.mint();
        }
        peluca.transfer(msg.sender, its * 6e18);
    }

}
