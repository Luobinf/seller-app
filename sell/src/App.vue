<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods" active-class="is-active">
          商品
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="is-active">
          评价
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" active-class="is-active">
          商家
        </router-link>
      </div>
    </div>
    <keep-alive :include="include">
      <router-view v-if="$route.meta.keepAlive" :seller="seller"></router-view>
    </keep-alive>
    <router-view :seller="seller" v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
  import Header from './components/header/Header.vue'
  import {urlParse} from './common/js/util.js'

  const ERRNO_OK = 0

  export default {
    data() {
      return {
        include: [],
        seller: {
          id: ( () => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    components: {
      'v-header': Header
    },
    created() {
      this.$http.get(`/api/seller?id=${this.seller.id}`).then((response) => {
        let {errno, data} = response.body
        if (errno === ERRNO_OK) {
          this.seller = Object.assign({},this.seller,data)
        }
      }, (error) => {
        console.log(error)
      })
    },
    watch: {
      '$route' (to) {
        if(to.meta.keepAlive) {
          !this.include.includes(to.name) && this.include.push(to.name)
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../static/css/reset.css";

  * {
    box-sizing: border-box;
  }

  #app {
    .tab {
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      position: relative;
      /*background-color: #7e8c8d;*/
      &::after {
        display: block;
        width: 100%;
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 1px solid rgba(7,17,27,0.1);
      }

      .tab-item {
        flex-grow: 1;
        text-align: center;

        & > a {
          display: block;
          font-size: 14px;
          color: #4d555d;

          &.is-active {
            color: rgb(240, 20, 20);
          }
        }
      }
    }
  }
</style>
