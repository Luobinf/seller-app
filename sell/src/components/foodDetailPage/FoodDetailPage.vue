<template>
  <transition name="move">
    <div class="foodDetailPage" v-show="showFlag" ref="foodDetailPage">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <span class="icon-arrow_lift" @click="hide"></span>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop="addFirst">
              加入购物车
            </div>
          </transition>
        </div>
        <Split v-show="food.info"></Split>
        <div class="info">
          <h1 class="title">商品介绍</h1>
          <p class="text" v-show="food.info">{{food.info}}</p>
        </div>
        <Split></Split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <RatingSelect :select-type.sync="selectType" :only-content.sync="onlyContent"
                        :desc="desc" :ratings="food.ratings" @refreshScroll="refresh"
          >
          </RatingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings" class="rating-item border-1px"
                  v-show="needShow(rating.rateType,rating.text)"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0,'icon-thumb_down': rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/javascript">
  import BScroll from '@better-scroll/core'
  import CartControl from "../cartcontrol/CartControl"
  import Split from "../split/Split"
  import RatingSelect from "../ratingselecct/RatingSelecct"

  //选中的方式，初始值为2，表示全部选中。
  const ALL = 2

  export default {
    name: 'FoodDetailPage',
    components: {RatingSelect, Split, CartControl},
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    props: {
      food: {
        type: Object
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        let fmt = 'yyyy-MM-dd hh:mm'
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes()
        }
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
          }
        }
        return fmt
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            let foodDetailPage = this.$refs.foodDetailPage
            this.scroll = new BScroll(foodDetailPage, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      addFirst() {
        this.$set(this.food, 'count', 1)
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      },
      refresh() {
        //Vue的DOM是异步更新的
        this.$nextTick(() => {
          //当DOM更新完成之后再去刷新重新获取高度值
          this.scroll.refresh()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .foodDetailPage {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 50;
    width: 100%;
    background: white;

    &.move-enter-active, &.move-leave-active {
      transition: all 0.3s linear;
    }

    &.move-enter, &.move-leave-to {
      transform: translate3d(100%, 0, 0);
    }

    &.move-enter-to, &.move-leave {
      transform: translate3d(0, 0, 0);
    }

    .food-content {
      .image-header {
        position: relative;
        width: 100%;
        height: 0;
        /*此时 padding-top 的100%是通过width来计算的*/
        padding-top: 100%;

        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .icon-arrow_lift {
          position: absolute;
          top: 10px;
          left: 0;
          display: block;
          padding: 10px;
        }
      }

      .content {
        padding: 18px;
        position: relative;

        .title {
          font-size: 14px;
          font-weight: 700;
          color: rgb(7, 17, 27);
          line-height: 14px;
        }

        .detail {
          font-size: 10px;
          color: rgb(147, 153, 159);
          margin-top: 8px;

          .sell-count {
            display: inline-block;
          }

          .rating {
            margin-left: 12px;
            display: inline-block;
          }
        }

        .price {
          font-weight: 700;
          margin-top: 18px;

          .now {
            font-size: 14px;
            color: red;
            display: inline-block;
          }

          .old {
            text-decoration: line-through;
            color: rgb(240, 20, 20);
            font-size: 10px;
            display: inline-block;
            margin-left: 12px;
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 18px;
          bottom: 12px;
        }

        .buy {
          position: absolute;
          right: 18px;
          bottom: 14px;
          z-index: 10;
          height: 24px;
          line-height: 24px;
          padding: 0 12px;
          font-size: 10px;
          color: white;
          border-radius: 12px;
          background-color: rgb(0, 160, 220);

          &.fade-enter-active, &.fade-leave-active {
            transition: all 0.5s;
          }

          &.fade-enter, &.fade-leave-to {
            opacity: 0;
          }

          &.fade-enter-to, &.fade-leave {
            opacity: 1;
          }
        }
      }

      .info {
        padding: 18px;

        .title {
          line-height: 14px;
          color: black;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 600;
        }

        .text {
          font-size: 12px;
          line-height: 24px;
          color: rgb(77, 85, 93);
          padding: 0 8px;
        }
      }

      .ratings {
        padding-top: 18px;

        .title {
          line-height: 14px;
          margin-left: 18px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .rating-wrapper {
          padding: 0 18px;

          .rating-item {
            position: relative;
            padding: 16px 0;

            &::after {
              position: absolute;
              left: 0;
              bottom: 0;
              content: '';
              display: block;
              width: 100%;
              border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            }

            .user {
              position: absolute;
              right: 0;
              top: 16px;
              font-size: 0;
              line-height: 12px;

              .name {
                display: inline-block;
                margin-right: 6px;
                vertical-align: top;
                font-size: 10px;
                color: rgb(147, 153, 159);
              }

              .avatar {
                border-radius: 50%;
              }
            }

            .time {
              margin-bottom: 6px;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }

            .text {
              line-height: 16px;
              color: rgb(7, 17, 27);
              font-size: 12px;

              .icon-thumb_up, .icon-thumb_down {
                margin-right: 4px;
                line-height: 16px;
                font-size: 12px;
              }

              .icon-thumb_up {
                color: rgb(0, 160, 220);
              }

              .icon-thumb_down {
                color: rgb(147, 153, 159);
              }
            }
          }

          .no-rating {
            padding: 16px 0;
            font-size: 12px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>
