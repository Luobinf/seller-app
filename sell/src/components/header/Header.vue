<template>
  <header class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64px" height="64px" :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="header-bg">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
  </header>
</template>

<script type="text/javascript">
export default {
  name: 'Header',
  data () {
    return {

    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  created() {
    this.classMap = ['decrease','discount','special','invoice','guarantee']
  }
}
</script>

<style scoped lang="scss">
  @import "../../common/styles/mixin.scss";
  .header {
    position: relative;
    background-color: rgba(7,17,27,0.5);
    .content-wrapper {
      position: relative;
      display: flex;
      width: 100%;
      padding: 24px 12px 18px 24px;
      .avatar {
        img {
          vertical-align: top;
          border-radius: 2px;
        }
      }
      .content {
        margin-left: 16px;
        color: white;
        .title {
          margin: 2px 0 8px 0;
          display: flex;
          .brand {
            display: inline-block;
            width: 30px;
            height: 18px;
            @include imgTo2Or3("brand");
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name {
            margin-left: 6px;
            font-size: 16px;
            font-weight: bold;
          }
        }
        .description {
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 200;
        }
        .support {
          display: flex;
          .icon {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            &.decrease {
              @include imgTo2Or3("decrease_1");
            }
            &.discount {
              @include imgTo2Or3("discount_1");
            }
            &.guarantee {
              @include imgTo2Or3("guarantee_1");
            }
            &.invoice {
              @include imgTo2Or3("invoice_1");
            }
            &.special {
              @include imgTo2Or3("special_1");
            }
          }
          .text {
            font-size: 10px;
            font-weight: 200;
          }
        }
      }
      .support-count {
        display: flex;
        position: absolute;
        justify-content: center;
        align-items: center;
        right: 12px;
        bottom: 14px;
        padding: 3px 8px;
        border-radius: 14px;
        background-color: rgba(7,17,27,0.25);
        .count {
          color: white;
          font-weight: 200;
          font-size: 10px;
        }
        .icon-keyboard_arrow_right {
          color: white;
          font-weight: bold;
        }
      }
    }
    .bulletin-wrapper {
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 5px 12px;
      background-color: rgba(7,17,27,0.2);
      .bulletin-title {
        display: inline-block;
        width: 23px;
        height: 12px;
        @include imgTo2Or3("bulletin");
        background-size: 23px 12px;
        background-repeat: no-repeat;
        vertical-align: top;
        margin-top: 2px;
      }
      .bulletin-text {
        vertical-align: top;
        color: white;
        margin: 0 4px;
      }
      .icon-keyboard_arrow_right {
        position: absolute;
        color: white;
        font-size: 16px;
        font-weight: bold;
        right: 4px;
        bottom: 5px;
      }
    }
    .header-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1000;
      filter: blur(15px);
    }
  }
</style>
