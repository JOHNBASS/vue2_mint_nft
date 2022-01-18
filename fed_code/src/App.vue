<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <button class="cta-button connect-wallet-button" @click="connect">
      Connect Wallet To Get Started
    </button>
    <div v-if="mynft != null">
      My NFT:
      <h2>{{ mynft.name }}</h2>
      <img v-bind:src="mynft.imageURI" />
      <div>
        <button
          class="character-mint-button"
          @click="mintCharacterNFTAction(Math.floor(Math.random() * 3))"
        >
          Mint NFT !!
        </button>
      </div>
    </div>
    <!-- <router-view /> -->
  </div>
</template>

<script>
import { ethers } from "ethers";
import MyNFT from "./utils/MyNFT.json";

export default {
  name: "",
  components: {},
  data: function () {
    return {
      mynft: null,
      minting: false,
    };
  },
  methods: {
    getContract: async function () {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          this.$store.state.contract_address,
          MyNFT.abi,
          signer
        );
        return connectedContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    connect: async function () {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          alert("Metamask not installed!");
          return;
        }
        if (0 == (await this.checkIfConnected())) {
          await this.requestAccess();
        }
        await this.checkNetwork();
        await this.fetchNFTMetadata();
        await this.setupEventListeners();
      } catch (error) {
        console.log(error);
        alert("setError", "Account request refused.");
      }
    },
    checkIfConnected: async function () {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        this.$store.state.account = accounts[0];
        console.log(this.$store.state.account);
        return 1;
      } else {
        return 0;
      }
    },
    requestAccess: async function () {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      this.$store.state.account = accounts[0];
    },
    checkNetwork: async function () {
      let chainId = await ethereum.request({ method: "eth_chainId" });
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        if (!(await this.switchNetwork())) {
          alert("You are not connected to the Rinkeby Test Network!");
        }
      }
    },
    switchNetwork: async function () {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }],
        });
        return 1;
      } catch (switchError) {
        return 0;
      }
    },
    fetchNFTMetadata: async function () {
      try {
        const connectedContract = await this.getContract();
        const txn = await connectedContract.checkIfUserHasNFT();
        if (txn.name) {
          this.$store.state.characterNFT = transformCharacterData(txn);
          this.mynft = this.$store.state.characterNFT;
        }
      } catch (error) {
        console.log(error);
      }
    },
    setupEventListeners: async function () {
      try {
        const connectedContract = await this.getContract();
        if (!connectedContract) return;
        connectedContract.on(
          "CharacterNFTMinted",
          async (from, tokenId, characterIndex) => {
            console.log(
              `CharacterNFTMinted - sender: ${from} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );
            const characterNFT = await connectedContract.checkIfUserHasNFT();
            console.log(characterNFT);
            alert(
              `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${
                this.$store.state.contract_address
              }/${tokenId.toNumber()}`
            );
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    mintCharacterNFTAction: async function (characterId) {
      if (this.minting) return;
      this.minting = true;
      await this.mintCharacterNFT(characterId);
      this.minting = false;
    },
    mintCharacterNFT: async function (characterId) {
      try {
        const connectedContract = await this.getContract();
        const mintTxn = await connectedContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getContract();
  },
};

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
