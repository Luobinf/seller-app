<template>
<div class="shopcart-wrapper">
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleDetails">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount>0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="number" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop">
        <div v-for="(ball,key) in balls" v-show="ball.show" :key="key">
          <div class="inner" ref="inner"></div>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopcart-details" v-show="shopcartDetailShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="list-content">
          <ul>
            <li v-for="food in selectFoods" class="food">
              <span class="name">{{food.name}}</span>
              <div class="cartcontrol-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
              <span class="price">￥{{food.price * food.count}}</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade">
    <div class="list-mask" v-show="shopcartDetailShow" @click="hideDetails"></div>
  </transition>
  <Dialog :show-dialog.sync="showDialog">
    一共需要支付{{totalPrice}}元
  </Dialog>
  <Dialog :show-dialog.sync="showShopCart" @handle-confirm="clearShopCart">
    确定清空购物车吗？
  </Dialog>
  <Dialog :total-price="totalPrice"
    :show-dialog.sync="showDialog"
  >
  </Dialog>
</div>
</template>

<script type="text/javascript">
  import cartControl from '../cartcontrol/CartControl.vue'
  import BScroll from '@better-scroll/core'
  import Dialog from '../dialog/Dialog.vue'
  export default {
    name: 'ShopCart',
    data() {
      return {
        balls: [
          {
            show: false,
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true,
        showDialog: false,
        showShopCart: false,
      }
    },
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      cartControl,
      Dialog
    },
    computed: {
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectFoods.map((food) => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          return `还差${this.minPrice - this.totalPrice}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      shopcartDetailShow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if(show) {
          this.$nextTick( () => {
            //添加判断，以防在每次不断打开关闭折叠版时重新计算
            if(!this.scroll) {
              let listContent = this.$refs['list-content']
              this.scroll = new BScroll(listContent,{
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      toggleDetails() {
        if (this.totalCount > 0) {
          this.fold = !this.fold
        } else {
          return
        }
      },
      empty() {
        this.showShopCart = true
      },
      hideDetails() {
        this.fold = true
      },
      pay() {
        if(this.totalPrice < this.minPrice) {
          return
        }
        this.showDialog = !this.showDialog
      },
      clearShopCart() {
        this.selectFoods.forEach((item) => {
          item.count = 0
        })
      },
      drop(event) {
        // let el = event.target
        // // 获取元素相对于窗口的位置 getBoundingClientRect
        // for(let i = 0;i < this.balls.length;i++) {
        //   let ball = this.balls[i]
        //   if(!ball.show) {
        //     ball.show = true
        //     ball.el = el
        //     this.dropBalls.push(ball)
        //     return
        //   }
        // }
      },
      // beforeEnter(el) {
      //   let count = this.balls.length
      //   while (count--) {
      //     let ball = this.balls[count]
      //     if(ball.show) {
      //       let rect = ball.el.getBoundingClientRect()
      //       let x = rect.left - 32
      //       //document.documentElement.clientHeight为视口高度
      //       let y = -(document.documentElement.clientHeight - rect.top - 22)
      //       el.style.display = ''
      //       el.style.transform = `translate3d(0,${y}px,0)`
      //       let inner = this.$refs.inner
      //       inner.style.transform = `translate3d(${x}px,0,0)`
      //     }
      //   }
      // },
      // enter(el) {
      //   //手动触发一次重绘
      //   let rf = el.offsetHeight
      //   this.$nextTick(() => {
      //     el.style.transform = 'translate3d(0,0,0)'
      //     let inner = this.$refs.inner
      //     inner.style.transform = 'translate3d(0,0,0)'
      //   })
      // },
      // afterEnter(el) {
      //   let ball = this.dropBalls.shift()
      //   if(ball) {
      //     ball.show = false
      //   }
      //   el.styles.display = 'none'
      // }
    }
  }
</script>

<style scoped lang="scss">
  .shopcart {
    position: fixed;
    z-index: 100;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 48px;

    .content {
      display: flex;
      background: #141d27;

      .content-left {
        flex: 1;

        .logo-wrapper {
          display: inline-block;
          vertical-align: top;
          position: relative;
          bottom: 10px;
          padding: 5px;
          margin: 0 12px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #141d27;

          .logo {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #2b343c;

            &.highlight {
              background-color: rgb(0, 160, 220);

              .icon-shopping_cart {
                color: #fff;
              }
            }

            .icon-shopping_cart {
              font-size: 20px;
              color: #80858a;
            }
          }

          .number {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: white;
            background: red;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }

        .price {
          display: inline-block;
          vertical-align: top;
          font-size: 16px;
          font-weight: 700;
          color: #80858a;
          padding: 10px 12px 10px 0;
          margin: 6px 0;
          border-right: 1px solid rgba(255, 255, 255, 0.1);

          &.highlight {
            color: #fff;
          }
        }

        .desc {
          display: inline-block;
          vertical-align: top;
          color: #80858a;
          font-size: 12px;
          line-height: 12px;
          margin-top: 18px;
          margin-left: 12px;
        }
      }

      .content-right {
        flex: 0 0 105px;
        width: 105px;

        .pay {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 700;
          line-height: 48px;
          text-align: center;

          &.not-enough {
            background: #2b333b;
          }

          &.enough {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }

    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 3000;

        &.drop-enter-active {
          transition: all 0.4s linear;

          .inner {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: skyblue;
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
          }
        }
      }
    }

    .shopcart-details {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      transform: translate3d(0, -100%, 0);

      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.3s ease-in-out;
      }

      &.fold-enter, &.fold-leave-to {
        transform: translate3d(0, 0, 0);
      }

      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background-color: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);

        .title {
          font-size: 14px;
          color: rgb(7, 17, 27);
          float: left;
        }

        .empty {
          font-size: 12px;
          color: rgb(0, 160, 220);
          float: right;
        }
      }

      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background-color: #ffffff;

        .food {
          width: 100%;
          height: 48px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);

          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
            float: left;
            font-weight: 700;
          }

          .price {
            line-height: 24px;
            font-size: 14px;
            color: rgb(240, 20, 20);
            font-weight: 700;
            float: right;
          }

          .cartcontrol-wrapper {
            float: right;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 50;
    background-color: rgba(7,17,24,0.6);
    /*filter: blur(1px);*/
    /*backdrop-filter: blur(1px);*/
    &.fade-enter-active,&.fade-leave-active  {
      transition: all 0.3s;
    }
    &.fade-enter,&.fade-leave-to {
      opacity: 0;
      background-color: rgba(7,17,24,0);
    }
  }
</style>
