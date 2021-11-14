const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Peluca contract", function () {

  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Peluca;
  let hardhatToken;
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let cap;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Peluca = await ethers.getContractFactory("Peluca");
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    // Supply Cap of 15 tokens for testing.
    cap = ethers.utils.parseUnits("20");
    hardhatToken = await Peluca.deploy(cap); // 10 * 10**18
  });

  it("Deployment should assign the total supply of zero tokens to the deployer", async function () {
    const deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(await hardhatToken.totalSupply()).to.equal(deployerBalance);
    expect(await hardhatToken.totalSupply()).to.equal(0);
  });

  it("After one mint from deployer should assign the total supply of tokens to the deployer", async function () {
    await hardhatToken.mint();
    const deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(await hardhatToken.totalSupply()).to.equal(deployerBalance);
  });

  it("After one mint from another address should assign the total supply of tokens to that address", async function () {
    await hardhatToken.connect(addr1).mint();
    const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    expect(await hardhatToken.totalSupply()).to.equal(addr1Balance);
  });

  it("After one mint should assign some balance to the the sender", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    expect(await hardhatToken.getDropMint()).to.equal(addr1Balance);
  });

  it("After two mint should assign some double balance to the the sender", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    const dropMint = await hardhatToken.getDropMint();
    expect(dropMint.mul(2)).to.equal(addr1Balance);
  });

  it("After four mints should hit the market cap", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    expect(cap).to.equal(addr1Balance);
  });

  it("After two mint should be inflationary", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(false);
  });

  it("After four mints should be deflationary", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
  });

  it("After two mint should be inflationary and a transfer has no 0.1% burn", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(false);
  });

  it("After four mints should be deflationary", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
  });

  it("After 2 mints and 1 transfer should be deflationary", async function () {
    expect(await hardhatToken.totalSupply()).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    expect(await hardhatToken.totalSupply()).to.equal(ethers.utils.parseUnits("6"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    expect(await hardhatToken.totalSupply()).to.equal(ethers.utils.parseUnits("12"));
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    expect(await hardhatToken.totalSupply()).to.equal(ethers.utils.parseUnits("20"));
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
  });

  it("Cannot transfer 0 amounts", async function () {
    expect(await hardhatToken.totalSupply()).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    expect(await hardhatToken.totalSupply()).to.equal(ethers.utils.parseUnits("6"));
    await expect( hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("0")) )
    .to.be.revertedWith('Can only transfer positive amounts.');

  });

  it("After two mint should be inflationary and next supply target is max cap", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    const cap = await hardhatToken.getSupplyCap();
    expect(nextSupplyTarget).to.equal(cap);

  });

  it("After four mints should be deflationary and next supply target is 96%", async function () {
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
    const nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    const cap = await hardhatToken.getSupplyCap();
    expect(nextSupplyTarget).to.equal(cap.sub( cap.mul(40).div(1000)));
  });

  it("After two mint should be inflationary and transfer has no burn fee 0.1%", async function () {
    var deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("13"));
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(false);
  });

  it("After four mint should be deflationary and transfer has a burn fee of 0.1%", async function () {
    var deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0.999"));
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);

  });

  // Time dependant
  // const time = now + 86400
  // await ethers.provider.send('evm_setNextBlockTimestamp', [now]); 
  // await ethers.provider.send('evm_mine');

  it("Next supply target in the first deflationary year is 96% of initial max supply cap", async function () {
    var deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0.999"));
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
    // nextSupplyTarget
    const nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    expect(nextSupplyTarget).to.equal(ethers.utils.parseUnits("19.2"));
  });

  it("After 1 year passes should reset next supply target if you do a transfer", async function () {
    var deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0.999"));
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
    // nextSupplyTarget
    var nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    expect(nextSupplyTarget).to.equal(ethers.utils.parseUnits("19.2"));
    // Time travel
    const yearPlus = 86400 * 366;
    await ethers.provider.send('evm_increaseTime', [yearPlus]);
    await ethers.provider.send('evm_mine');
    // some transfer
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    // nextSupplyTarget
    nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    expect(nextSupplyTarget).to.equal(ethers.utils.parseUnits("19.19808"));


  });

  it("Cannot mint if deflationary in next year period", async function () {
    var deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0.999"));
    // nextSupplyTarget
    var nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    expect(nextSupplyTarget).to.equal(ethers.utils.parseUnits("19.2"));
    // Time travel
    const yearPlus = 86400 * 366;
    await ethers.provider.send('evm_increaseTime', [yearPlus]);
    await ethers.provider.send('evm_mine');
    // some transfer
    await hardhatToken.connect(addr1).transfer(deployer.address, ethers.utils.parseUnits("1"));
    // nextSupplyTarget
    nextSupplyTarget = await hardhatToken.getNextSupplyTarget();
    expect(nextSupplyTarget).to.equal(ethers.utils.parseUnits("19.19808"));
    const isDeflationary = await hardhatToken.isDeflationaryPeriod();
    expect(isDeflationary).to.equal(true);
    // cannot mint if deflationary.
    await expect(hardhatToken.mint())
      .to.be.revertedWith('Cannot mint after Deflationary Period starts.');
  });

  it("Cannot mint if deflationary", async function () {
    var deployerBalance = await hardhatToken.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.utils.parseUnits("0"));
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    await hardhatToken.connect(addr1).mint(); // mint 6 tokens
    // cannot mint if deflationary.
    await expect(hardhatToken.mint())
      .to.be.revertedWith('Cannot mint after Deflationary Period starts.');
  });


});