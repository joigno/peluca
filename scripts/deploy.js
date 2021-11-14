// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Peluca = await hre.ethers.getContractFactory("Peluca");
  const CAP = 10000000 * 10**18;
  const peluca = await Peluca.deploy(hre.ethers.utils.parseUnits("10000000"));
  //const peluca = await Peluca.deploy(hre.ethers.utils.parseUnits("20"));

  await peluca.deployed();

  console.log("Peluca deployed to:", peluca.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
