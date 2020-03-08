<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease"
           v-show="food.count > 0" @click="decreaseCart"
      >
        <div class="icon-remove_circle_outline inner"></div>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-increase icon-add_circle" @click="increaseCart"></div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'CartControl',
  props: {
    food: {
      type:Object
    }
  },
  methods: {
    increaseCart() {
      if(!this.food.count) {
        this.$set(this.food,'count',1)
      } else {
        this.food.count++
      }
    },
    decreaseCart() {
      if(this.food.count > 0) {
        this.food.count--
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .cartcontrol {
    display: flex;
    align-items: center;
    .cart-decrease{
      .inner {
        font-size: 24px;
        line-height: 24px;
        color: rgb(0,160,260);
        transition: all 0.5s linear;
      }
      &.move-enter-active,&.move-leave-active {
        transition: all 0.5s linear;
      }
      &.move-enter,&.move-leave-to {
        opacity: 0;
        transform: translate3d(24px,0,0);
        .inner {
          transform: rotate(180deg);
        }
      }
      &.move-enter-to,&.move-leave {
        opacity: 1;
        transform: translate3d(0,0,0);
        .inner {
          transform: rotate(0);
        }
      }
    }
    .cart-increase {
      font-size: 24px;
      line-height: 24px;
      color: rgb(0,160,260);
    }
    .cart-count{
      font-size: 10px;
      color: rgb(147,153,159);
      line-height: 24px;
      padding: 0 6px;
    }
  }
</style>
