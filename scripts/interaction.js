const hre = require("hardhat");

async function main() {
  const supplyChainAddr = '0xfb3939228736a231BE954dc0D887d2DBE415881F';  
  const supplyChain = await hre.ethers.getContractAt("SupplyChain", supplyChainAddr);

  const owner = await supplyChain.owner()
  console.log(owner)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});