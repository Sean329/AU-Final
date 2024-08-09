# AU Final Project --- A Supply Chain Management Tool on the Blockchain
This is a DApp supply chain solution backed by the Ethereum L1. The smart contracts can manage specific user permission controls as well as track and verify a product’s authenticity. The contracts have been tested, and deployed to Goerli and Sepolia public testnets.

## UML Diagrams

### Activity Diagram
![Activity UML](https://github.com/Sean329/AU-Final/blob/55fad79a6edc6dbe4840a9a1281145f198a8f9e7/UMLs/Activity%20UML.png)


### Sequence Diagram
![Sequence UML](https://github.com/Sean329/AU-Final/blob/55fad79a6edc6dbe4840a9a1281145f198a8f9e7/UMLs/Sequence%20UML.png)


### State Diagram
![State UML](https://github.com/Sean329/AU-Final/blob/55fad79a6edc6dbe4840a9a1281145f198a8f9e7/UMLs/State%20UML.png)


### Classes(Data Model)
![Classes](https://github.com/Sean329/AU-Final/blob/dfea4432932a02aba054301213145d1b4daeb01d/UMLs/Classes.png)


## Libraries Write-up
The "Roles" library specified below was used for managing addresses assigned to a role.
```
library Roles {
  struct Role {
    mapping (address => bool) bearer;
  }
```

## IPFS Write-up
IPFS is not used in this Dapp.

## General Write-up
The build of the Dapp has 5 steps:
- Part 1 - Plan the project with write-ups: Create UML diagrams and write-ups for the libraries, IPFS, and in general.
- Part 2 - Write smart contracts: (i) Roles control logic (ii) Roles implementation (iii) Core logic
- Part 3 - Test smart contract code coverage: 11 tests targeting the deployment and all the 10 functions used during an item's life span along the supply chain.
- Part 4 - Deploy smart contracts on Goerli: Deploy the smart contracts with Hardhat.
- Part 5 - TODO: Build the frontend

## Deploy the contract on public blockchain
The SupplyChain contract addresses
1. On Goerli it is `0x4e129c663310777decba8e137892e7967c0fd877` at transaction hash `0x3b8ae61c50ca488037ec7808a033cb25e4694404a618507fd0a48424b0b1adb9` 
2. On Sepolia it is `0x24F0F9E40FB78d9c72D35a48D9Af67586Bc2cc65` at transaction hash `0x3b301328e1b8ae582dd3e01d267b30c60c77e6971e1511810e6529a9e63335c4`

The deployed contracts have been verified with source code.
