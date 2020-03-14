import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    goods: []
  },
  mutations: {
    updateGoods(state,payload) {
      state.goods = payload
    }
  }
})
