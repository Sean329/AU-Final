// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within

// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");
const { toUtf8Bytes, keccak256, parseEther } = ethers;

describe('SupplyChain', function(){
    it('Contract should deploy just fine', async function() {
        const supplyChain = await ethers.deployContract("SupplyChain");
    
        const [ownerID, originFarmerID, distributorID, retailerID, consumerID] = await ethers.getSigners();
        var sku = 1;
        var upc = 1;
        const originFarmName = "John Doe";
        const originFarmInformation = "Yarray Valley";
        const originFarmLatitude = "-38.239770";
        const originFarmLongitude = "144.341490";
        var productID = sku + upc;
        const productNotes = "Best beans for Espresso";
        const productPrice = parseEther('1');
        var itemState = 0;
        const emptyAddress = '0x00000000000000000000000000000000000000';

        console.log("Accounts used here...");
        console.log("Contract Owner: ", ownerID.address);
        console.log("Farmer: ", originFarmerID.address);
        console.log("Distributor: ", distributorID.address);
        console.log("Retailer: ", retailerID.address);
        console.log("Consumer: ", consumerID.address);
        console.log("SupplyChain contract is at: ", supplyChain.target);

        assert.equal(await supplyChain.owner(),ownerID.address);
    });
});