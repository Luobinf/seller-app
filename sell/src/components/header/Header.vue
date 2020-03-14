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
      <div class="support-count" v-if="seller.supports" @click="openDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="openDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="header-bg">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-main">
          <h1 class="name">
            {{seller.name}}
          </h1>
          <div class="star-wrapper">
            <Star :score="seller.score" :size="48"></Star>
          </div>
          <div class="title">
            <div class="line border-bottom-1px"></div>
            <div class="text">优惠信息</div>
            <div class="line border-bottom-1px"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="item in seller.supports">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line border-bottom-1px"></div>
            <div class="text">商家公告</div>
            <div class="line border-bottom-1px"></div>
          </div>
          <div class="bulletin">
            <p class="content">
              {{seller.bulletin}}
            </p>
          </div>
        </div>
        <div class="detail-close" @click="closeDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </header>
</template>

<script type="text/javascript">
  import Star from '../star/Star.vue'

  export default {
    name: 'Header',
    data() {
      return {
        classMap: [],
        detailShow: false
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      Star
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      openDetail() {
        this.detailShow = true
      },
      closeDetail() {
        this.detailShow = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/mixin.scss";

  .header {
    position: relative;
    background-color: rgba(7, 17, 27, 0.5);
    overflow: hidden;

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
            @include imgTo2Or3("./imgs/brand");
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
              @include imgTo2Or3("./imgs/decrease_1");
            }

            &.discount {
              @include imgTo2Or3("./imgs/discount_1");
            }

            &.guarantee {
              @include imgTo2Or3("./imgs/guarantee_1");
            }

            &.invoice {
              @include imgTo2Or3("./imgs/invoice_1");
            }

            &.special {
              @include imgTo2Or3("./imgs/special_1");
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
        background-color: rgba(7, 17, 27, 0.25);

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
      background-color: rgba(7, 17, 27, 0.2);

      .bulletin-title {
        display: inline-block;
        width: 23px;
        height: 12px;
        @include imgTo2Or3("./imgs/bulletin");
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

    .detail {
      display: flex;
      flex-direction: column;
      position: fixed;
      padding: 64px 36px 32px 36px;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 1000;
      overflow: auto;
      backdrop-filter: blur(10px);
      background-color: rgba(7, 17, 27, 0.8);
      &.fade-enter {
        opacity: 0;
      }
      &.fade-enter-active,&.fade-leave-active {
        transition: all 0.5s;
      }
      &.fade-enter-to {
        opacity: 1;
      }
      &.fade-leave-to {
        opacity: 0;
      }
      .detail-main {
        flex: 1;

        .name {
          font-size: 16px;
          font-weight: 700;
          color: white;
          text-align: center;
        }

        .star-wrapper {
          margin-top: 14px;
          padding: 4px 0;
        }

        .title {
          display: flex;
          align-items: center;
          margin: 24px 0;

          .line {
            flex: 1;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }

          .text {
            margin: 0 12px;
            font-weight: 700;
            color: white;
            font-size: 14px;
          }
        }

        .supports {
          padding: 0 12px;

          .support-item {
            padding: 5px 0;
            display: flex;
            align-items: center;

            .icon {
              width: 16px;
              height: 16px;
              background-size: 16px 16px;
              background-repeat: no-repeat;
              margin-right: 6px;

              &.decrease {
                @include imgTo2Or3("./imgs/decrease_2");
              }

              &.discount {
                @include imgTo2Or3("./imgs/discount_2");
              }

              &.special {
                @include imgTo2Or3("./imgs/special_2");
              }

              &.invoice {
                @include imgTo2Or3("./imgs/invoice_2");
              }

              &.guarantee {
                @include imgTo2Or3("./imgs/guarantee_2");
              }
            }

            .text {
              font-size: 12px;
              color: white;
            }
          }
        }

        .bulletin {
          padding: 0 12px;

          > .content {
            font-size: 12px;
            color: white;
            line-height: 24px;
          }
        }
      }

      .detail-close {
        width: 32px;
        height: 32px;
        font-size: 32px;
        margin: 32px auto 0 auto;

        .icon-close {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
</style>
