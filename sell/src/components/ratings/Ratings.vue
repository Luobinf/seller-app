<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content" ref="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Split></Split>
      <RatingSelect :select-type.sync="selectType" :only-content.sync="onlyContent"
                    :desc="desc" :ratings="ratings" @refreshScroll="refresh"
      >
      </RatingSelect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item border-1px"  v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <Star :size="24" :score="rating.score"></Star>
                <span class="delivery" v-show="rating.deliveryTime">
                  {{rating.deliveryTime}}分钟送达
                </span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">
                  {{item}}
                </span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import Star from "../star/Star"
  import Split from "../split/Split"
  import RatingSelect from "../ratingselecct/RatingSelecct"
  import BScroll from '@better-scroll/core'

  const ALL = 2
  const ERR_OK = 0

  export default {
    name: 'Ratings',
    data() {
      return {
        ratings: [],
        showTag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {RatingSelect, Split, Star},
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
    created() {
      axios.get('/api/ratings').then((response) => {
        response = response.data
        if(response.errno === ERR_OK) {}
        this.ratings = response.data
        // 虽然数据变了，但是DOM并没有立即发生变化。
        // console.log(this.$refs['ratings-content'].getBoundingClientRect())
        this.$nextTick( () => {
          this.scroll = new BScroll(this.$refs.ratings,{
            click: true
          })
        })
      })
    },
    methods: {
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
@import "../../common/styles/base.scss";
.ratings {
  position: absolute;
  top: 173px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .ratings-content{
    .overview {
      display: flex;
      padding: 18px 0;
      .overview-left {
        flex: 0 0 137px;
        width: 137px;
        border-right: 1px solid rgba(7,17,27,0.1);
        text-align: center;
        padding-bottom: 6px;
        @media only screen and (max-width: 320px) {
          flex: 0 0 120px;
          width: 120px;
        }
        .score {
          margin-bottom: 6px;
          line-height: 28px;
          font-size: 24px;
          color: rgb(255,153,0);
        }
        .title {
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7,17,27);
          font-weight: 500;
        }
        .rank {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147,153,159);
        }
      }
      .overview-right {
        flex: 1;
        padding: 6px 0 6px 24px;
        display: flex;
        flex-wrap: wrap;
        @media only screen and (max-width: 320px) {
          padding-left: 6px;
        }
        .score-wrapper {
          margin-bottom: 8px;
          line-height: 18px;
          display: flex;
          align-items: center;
          .title {
            font-size: 12px;
            color: rgb(7,17,27);
            font-weight: 500;
          }
          .star {
            margin-left: 12px;
          }
          .score {
            font-size: 12px;
            color: rgb(255,153,0);
            margin-left: 12px;
          }
        }
        .delivery-wrapper {
          display: flex;
          align-items: center;
          .title {
            line-height: 18px;
            font-size: 12px;
            color: rgb(7,17,27);
            font-weight: 500;
          }
          .delivery {
            line-height: 18px;
            font-size: 12px;
            color: rgb(147,153,159);
            margin-left: 12px;
          }
        }
      }
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item {
        display: flex;
        padding: 18px 0;
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
        .avatar {
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          img {
            border-radius: 50%;
          }
        }
        .content {
          flex: 1;
          position: relative;
          .name {
            line-height: 12px;
            font-size: 10px;
            color: rgb(7,17,27);
          }
          .star-wrapper {
            line-height: 12px;
            margin-bottom: 6px;
            margin-top: 6px;
            .star {
              display: inline-flex;
              margin-right: 6px;
              vertical-align: top;
            }
            .delivery {
              display: inline-block;
              vertical-align: top;
              font-size: 10px;
              color: rgb(147,153,159);
            }
          }
          .text {
            margin-bottom: 8px;
            line-height: 18px;
            color: rgb(7,17,27);
            font-size: 12px;
            font-weight: 500;
          }
          .recommend {
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up,.item {
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up {
              color: rgb(0,160,220);
            }
            .item {
              padding: 0 6px;
              border: 1px solid rgba(7,17,27,0.1);
              border-radius: 1px;
              color: rgb(147,153,159);
              background-color: white;
            }
          }
          .time {
            font-size: 10px;
            line-height: 12px;
            position: absolute;
            top: 0;
            right: 0;
            color: rgb(147,153,159);
          }
        }
      }
    }
  }
}
</style>
