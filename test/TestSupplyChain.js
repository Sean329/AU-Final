// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within

// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

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
    var randomUser1;
    var randomUser2;

    it('Contract should deploy just fine', async () => {
        supplyChain = await ethers.deployContract("SupplyChain");
    
        [ownerID, originFarmerID, distributorID, retailerID, consumerID,randomUser1,randomUser2] = await ethers.getSigners();
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

    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        
        // Mark an item as Processed by calling function processtItem()
        var event = await supplyChain.connect(originFarmerID).processItem(upc)

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain,'Processed');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')

    })

    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        // Mark an item as Packed by calling function packItem()
        var event = await supplyChain.connect(originFarmerID).packItem(upc)

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'Packed')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
    })

    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
         // Mark an item as ForSale by calling function sellItem()
        var event = await supplyChain.connect(originFarmerID).sellItem(upc, productPrice)

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'ForSale')

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, "Error: Invalid product price")
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
    })

    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        // Mark an item as Sold by calling function buyItem()
        var event = await supplyChain.connect(distributorID).buyItem(upc, {value: productPrice})

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'Sold');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID.address, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID.address, 'Error: Invalid distributor ID')
    })

    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        // Mark an item as Sold by calling function shipItem()
        var event = await supplyChain.connect(distributorID).shipItem(upc)

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'Shipped');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
    })

    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        // Mark an item as Sold by calling function receiveItem()
        // Gotta call addRetailer function to whitelist the retailerID before calling the receiveItem function
        await supplyChain.addRetailer(retailerID.address)
        var event = await supplyChain.connect(retailerID).receiveItem(upc)

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'Received');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], retailerID.address, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[7], retailerID.address, 'Error: Missing or Invalid retailerID')
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
    })

    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        // Mark an item as Sold by calling function purchaseItem()
        // Gotta call addConsumer function to whitelist the consumerID before calling the purchaseItem function
        await supplyChain.addConsumer(consumerID.address)
        var event = await supplyChain.connect(consumerID).purchaseItem(upc);

        // Determine if the event has been emitted using `expect`
        expect(event).to.emit(supplyChain, 'Purchased');

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], consumerID.address, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[8], consumerID.address, 'Error: Missing or Invalid consumerID')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
    })

    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.connect(randomUser1).fetchItemBufferOne(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID.address, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID.address, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.connect(randomUser2).fetchItemBufferTwo(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferTwo[5], 7, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferTwo[6], distributorID.address, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferTwo[7], retailerID.address, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[8], consumerID.address, 'Error: Invalid item State')
    })
});