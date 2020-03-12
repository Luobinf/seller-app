<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active': selectType===2}" @click="select(2)">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active': selectType===0}" @click="select(0)">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span class="block negative" :class="{'active': selectType===1}" @click="select(1)">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div class="switch border-1px" :class="{'on': onlyContent}" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/javascript">
const POSITIVE = 0
const NEGTIVE = 1
const ALL = 2
export default {
  name: 'RatingSelect',
  props: {
    ratings: {
      type:Array,
      default() {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type:Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter( (item) => {
        return item.rateType === POSITIVE
      })
    },
    negatives() {
      return this.ratings.filter( (item) => {
        return item.rateType === NEGTIVE
      })
    }
  },
  methods: {
    select(type) {
      this.$emit('update:selectType',type)
      //同时刷新滚动
      this.$emit('refreshScroll')
    },
    toggleContent() {
      if(this.onlyContent) {
        this.$emit('update:onlyContent',false)
      } else {
        this.$emit('update:onlyContent',true)
      }
      this.$emit('refreshScroll')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../common/styles/base.scss";
  .ratingselect {
    .rating-type {
      padding: 18px 0;
      margin: 0 18px;
      font-size: 0;
      position: relative;
      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(7,17,27,0.1);
      }
      .block {
        display: inline-block;
        padding: 8px 12px;
        border-radius: 1px;
        margin-right: 8px;
        color: rgb(77,85,93);
        font-size: 12px;
        line-height: 16px;
        &.active {
          color: white;
        }
        .count {
          font-size: 8px;
          margin-left: 2px;
        }
        &.positive {
          background: rgba(0,160,220,0.2);
          &.active {
            background-color: rgb(0,160,220);
          }
        }
        &.negative {
          background: rgba(77,85,93,0.2);
          &.active {
            background-color: rgb(77,85,93);
          }
        }
      }
    }
    .switch {
      padding: 12px 18px;
      line-height: 24px;
      color: rgb(147,153,159);
      position: relative;
      font-size: 0;
      &.on {
        .icon-check_circle {
          color: #00c850;
        }
      }
      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(7,17,27,0.1);
      }
      .icon-check_circle {
        margin-right: 4px;
        font-size: 24px;
        display: inline-block;
        vertical-align: top;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>
