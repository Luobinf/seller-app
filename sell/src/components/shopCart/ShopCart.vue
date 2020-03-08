<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount>0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="number" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'ShopCart',
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
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach( (food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.map( (food) => {
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
      if(this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .shopcart {
    position: fixed;
    z-index: 1000;
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
              background-color: rgb(0,160,220);
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
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
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
          border-right: 1px solid rgba(255,255,255,0.1);
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
          color: rgba(255,255,255,0.4);
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
  }
</style>
