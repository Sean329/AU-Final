// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within

// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { toUtf8Bytes, keccak256, parseEther } = ethers;

describe('SupplyChain', function(){
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
    var ownerID;
    var originFarmerID;
    var distributorID;
    var retailerID;
    var consumerID;
    var supplyChain;

    it('Contract should deploy just fine', async () => {
        supplyChain = await ethers.deployContract("SupplyChain");
    
        [ownerID, originFarmerID, distributorID, retailerID, consumerID] = await ethers.getSigners();
        console.log("Accounts used here...");
        console.log("Contract Owner: ", ownerID.address);
        console.log("Farmer: ", originFarmerID.address);
        console.log("Distributor: ", distributorID.address);
        console.log("Retailer: ", retailerID.address);
        console.log("Consumer: ", consumerID.address);
        console.log("SupplyChain contract is at: ", supplyChain.target);

        assert.equal(await supplyChain.owner(),ownerID.address);
    })

    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        
        // Mark an item as Harvested by calling function harvestItem()
        var event = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)
        
        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'Harvested')
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)
        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID.address, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID.address, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')      
    })   
});