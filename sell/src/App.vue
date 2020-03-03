<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
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
        <router-link to="seller" active-class="is-active">
          商家
        </router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import Header from './components/header/Header.vue'
  export default {
    components: {
      'v-header': Header
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
      &::after {
        display: block;
        width: 100%;
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 1px solid red;
      }
      .tab-item {
        flex-grow: 1;
        text-align: center;
        & > a {
          display: block;
          font-size: 14px;
          color: #4d555d;
          &.is-active {
            color: rgb(240,20,20);
          }
        }
      }
    }
  }
</style>
