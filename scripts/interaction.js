const hre = require("hardhat");

async function main() {
  const supplyChainAddr = '0x24F0F9E40FB78d9c72D35a48D9Af67586Bc2cc65';  
  const supplyChain = await hre.ethers.getContractAt("SupplyChain", supplyChainAddr);

  const owner = await supplyChain.owner()
  console.log(owner)

  await supplyChain.harvestItem(1, "0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "John Doe", "Yarray Valley", "-38.239770", "144.341490", "Best beans for Espresso")
  const resultBufferOne = await supplyChain.fetchItemBufferOne(1)
  console.log(resultBufferOne)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});