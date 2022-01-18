const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("MyNFT", function () {
  let gameContract;
  before(async () => {
    const gameContractFactory = await ethers.getContractFactory("MyNFT");
    gameContract = await gameContractFactory.deploy(
      ["NFT1-台灣熊", "NFT2-美國熊", "NFT3-杰倫熊"],
      [
        "https://cdn2.ettoday.net/images/2883/d2883045.jpg",
        "https://vctnewsmedia.s3-ap-northeast-1.amazonaws.com/uploads/20200814110824/c7257456b543756efbb9bac30c9d0c22ddd231e841aa914998fcbc25731382ec.jpg",
        "https://imgur.dcard.tw/yFe4Mioh.jpg",
      ],
      [0, 100, 200],
      [0, 100, 200]
    );
    await gameContract.deployed();
  });
  it("Should have 3 default characters", async () => {
    let characters = await gameContract.getAllDefaultCharacters();
    console.log(characters);
    expect(characters.length).to.equal(3);
  });
});