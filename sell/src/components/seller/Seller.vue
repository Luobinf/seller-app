<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h2 class="title">
          {{seller.name}}
        </h2>
        <div class="desc border-1px">
          <Star :size="36" :score="seller.score"></Star>
          <span class="text">{{seller.ratingCount}}</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}元</span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}元</span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}分钟</span>
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <Split></Split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="item in seller.supports">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <Split></Split>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="pic-wrapper" ref="pic-wrapper">
          <ul class="pic-list" ref="pic-list">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <Split></Split>
      <div class="info">
        <h2 class="title border-1px">商家信息</h2>
        <ul>
          <li class="info-item" v-for="info in seller.infos">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Star from "../star/Star"
import Split from "../split/Split"
import BScroll from '@better-scroll/core'
import {saveToLocal,loadFromLocal} from '../../common/js/store.js'

export default {
  name: 'Seller',
  data () {
    return {
      classMap: [],
      favorite: (() => {
        return loadFromLocal(this.seller.id,'favorite',false)
      })(),
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '未收藏'
    }
  },
  components: {Split, Star},
  methods: {
    initPicsScroll() {
      let picWidth = 120
      let margin = 6
      let width = (picWidth+margin) * this.seller.pics.length - margin
      let picList = this.$refs['pic-list']
      picList.style.width = `${width}px`
      this.$nextTick( () => {
        if(this.picScroll) {
          this.picScroll.refresh()
        } else {
          this.picScroll = new BScroll(this.$refs['pic-wrapper'],{
            click: true,
            //横向滚动
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        }
      })
    },
    toggleFavorite() {
      this.favorite = ! this.favorite
      saveToLocal(this.seller.id,'favorite',this.favorite)
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.seller,{
      click: true
    })
    //此时DOM已经在页面中渲染了
    if(this.seller.pics) {
      this.initPicsScroll()
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../common/styles/base.scss";
  @import "../../common/styles/mixin.scss";
  .seller {
    position: absolute;
    top: 173px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      padding: 18px;
      position: relative;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .desc {
        padding-bottom: 18px;
        font-size: 0;
        position: relative;
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          display: block;
          content: '';
          width: 100%;
          border-bottom: 1px solid rgba(7,17,27,0.1);
        }
        .star {
          display: inline-flex;
          margin-right: 8px;
          vertical-align: top;
        }
        .text {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          margin-right: 12px;
          font-size: 10px;
          color: rgb(77,85,93);
        }
      }
      .remark {
        display: flex;
        padding-top: 18px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,0.1);
          &:last-child {
            border: none;
          }
          h2 {
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .content {
            line-height: 24px;
            font-size: 10px;
            color: rgb(7,17,27);
            .stress {
              font-size: 24px;
            }
          }
        }
      }
      .favorite {
        position: absolute;
        right: 18px;
        top: 18px;
        text-align: center;
        .icon-favorite {
          display: block;
          margin-bottom: 4px;
          color: #d4d6d9;
          line-height: 24px;
          font-size: 24px;
          &.active {
            color: red;
          }
        }
        .text {
          line-height: 10px;
          font-size: 10px;
          color: rgb(77,85,93);
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
        font-weight: 500;
      }
      .content-wrapper {
        position: relative;
        padding: 0 12px 16px 12px;
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          display: block;
          content: '';
          width: 100%;
          border-bottom: 1px solid rgba(7,17,27,0.1);
        }
        .content {
          line-height: 24px;
          font-size: 12px;
          color: rgb(240,20,20);
        }
      }
      .supports {
        .support-item {
          padding: 16px 12px;
          display: flex;
          align-items: center;
          position: relative;
          &::after {
            position: absolute;
            left: 0;
            bottom: 0;
            display: block;
            content: '';
            width: 100%;
            border-bottom: 1px solid rgba(7,17,27,0.1);
          }
          &:last-child {
            border: none;
          }

          .icon {
            width: 16px;
            height: 16px;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            margin-right: 6px;

            &.decrease {
              @include imgTo2Or3("decrease_4");
            }

            &.discount {
              @include imgTo2Or3("discount_4");
            }

            &.special {
              @include imgTo2Or3("special_4");
            }

            &.invoice {
              @include imgTo2Or3("invoice_4");
            }

            &.guarantee {
              @include imgTo2Or3("guarantee_4");
            }
          }
          .text {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
        }
      }
    }
    .pics {
      padding: 18px;
      .title {
        margin-bottom: 12px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-child {
              margin: 0;
            }
          }
        }
      }
    }
    .info {
      padding: 18px 18px 0 18px;
      .title {
        position: relative;
        padding-bottom: 12px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
        font-weight: 500;
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          display: block;
          width: 100%;
          border-bottom: 1px solid rgba(7,17,27,0.1);
        }
      }
      .info-item {
        position: relative;
        padding: 16px 12px;
        line-height: 16px;
        font-size: 12px;
        font-weight: 500;
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          display: block;
          width: 100%;
          border-bottom: 1px solid rgba(7,17,27,0.1);
        }
      }
    }
  }
</style>
