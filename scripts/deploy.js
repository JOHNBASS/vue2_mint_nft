const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyNFT");
  const gameContract = await gameContractFactory.deploy(
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
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #1");

  console.log("Done deploying and minting!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
