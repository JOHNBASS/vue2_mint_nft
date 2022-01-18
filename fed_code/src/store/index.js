import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: null,
    error: null,
    mining: false,
    characterNFT: null,
    characters: [],
    boss: null,
    attackState: null,
    contract_address: "0xae353782F2a4E5b1fd75B7C3D4A2b37c44809473",
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
