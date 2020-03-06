<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu-wrapper">
      <ul class="menu">
        <li v-for="(item,index) in goods" :key="item.name" class="menu-item"
          :class="{'is-active': index === currentIndex}" @click="selectMenu(index)"
        >
          <span class="text border-1px">
            <span class="icon" v-show="item.type > 0" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul ref="foods">
        <li v-for="item in goods" class="food-list" ref="food-list">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" width="58px" height="58px">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="newPrice">￥{{food.price}}</span>
                  <span v-if="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/javascript">
  import BScroll from '@better-scroll/core'

  const ERRNO_OK = 0

  export default {
    name: 'Goods',
    data() {
      return {
        classMap:['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        goods: [],
        listHeight:[],
        scrollY: 0
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    computed: {
      currentIndex() {
        for(let i=0;i<this.listHeight.length;i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i+1]
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      }
    },
    created() {
      this.getFoodsData()
    },
    methods: {
      getFoodsData() {
        this.$http.get('/api/goods').then((response) => {
          let {errno, data} = response.body
          if (errno === ERRNO_OK) {
            this.goods = data
            this.$nextTick(() => {
              //这里确保获取到了两个ul列表的实际高度
              this.initScroll()
              this.calculateHeight()
            })
          }
        }, (error) => {
          throw new Error(error)
        })
      },
      initScroll() {
        new BScroll(this.$refs['menu-wrapper'],{
          click: true
        })
         this.foodsScroll = new BScroll(this.$refs['foods-wrapper'],{
          probeType: 3
        })
        this.foodsScroll.on('scroll',(pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      calculateHeight() {
        let foodList = this.$refs['food-list']
        let height = 0
        this.listHeight.push(height)
        foodList.forEach((item) => {
          height +=item.offsetHeight
          this.listHeight.push(height)
        })
      },
      selectMenu(index) {
        let foodList = this.$refs['food-list']
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el,300)
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/mixin.scss";
  .goods {
    display: flex;
    position: absolute;
    width: 100%;
    top: 173px;
    bottom: 46px;
    /*height: calc(100vh - 173px - 46px);*/

    .menu-wrapper {
      flex: 0 0 80px;
      /*安卓兼容性问题，把宽度写上*/
      width: 80px;
      background-color: #f3f5f7;
      overflow: hidden;
      .menu {
        .menu-item {
          display: table;
          width: 80px;
          height: 54px;
          padding: 0 12px;
          &.is-active {
            background-color: white;
            margin-top: -1px;
            .text {
              border: none;
            }
          }
          .text {
            display: table-cell;
            vertical-align: middle;
            font-size: 12px;
            border-bottom: 1px solid rgba(7,17,27,0.1);
            text-align: center;
            .icon {
              display: inline-block;
              width: 12px;
              height: 12px;
              background-size: 12px 12px;
              background-repeat: no-repeat;
              margin-right: 2px;
              &.decrease {
                @include imgTo2Or3("decrease_3");
              }

              &.discount {
                @include imgTo2Or3("discount_3");
              }

              &.guarantee {
                @include imgTo2Or3("guarantee_3");
              }

              &.invoice {
                @include imgTo2Or3("invoice_3");
              }

              &.special {
                @include imgTo2Or3("special_3");
              }
            }
          }
        }
      }
    }

    .foods-wrapper {
      flex: 1;
      overflow: hidden;
      .title {
        padding: 8px 0 8px 12px;
        border-left: 2px solid #d9dde1;
        background-color: #f3f5f7;
        font-size: 12px;
        color: #93999f;
      }
      .food-item {
        display: flex;
        margin: 18px 18px 0 18px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(7,17,27,0.1);
        &:last-child {
          border-bottom: none;
        }
        .icon {
          flex-basis: 58px;
          /*兼容安卓手机*/
          width: 58px;
          height: 58px;
        }
        .content {
          flex: 1;
          margin-left: 10px;
          .name {
            padding: 2px 0 4px 0;
            font-size: 14px;
            color: #07111b;
            font-weight: 500;
          }
          .desc {
            padding: 2px 0;
            font-size: 10px;
            color: rgb(147,153,159);
            font-weight: 500;
          }
          .extra {
            padding: 2px 0;
            font-size: 12px;
            color: rgb(147,153,159);
            font-weight: 500;
            span:last-child {
              margin-left: 10px;
            }
          }
          .price {
            .newPrice {
              font-size: 14px;
              font-weight: 700;
              color: red;
              margin-right: 8px;
            }
            .oldPrice {
              font-size: 12px;
              font-weight: 700;
              color: rgb(147,153,159);
              text-decoration: line-through;
            }
          }
        }
      }
    }
  }
</style>
