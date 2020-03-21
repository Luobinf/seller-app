# sell
这是一个基于Vue全家桶搭建的移动端点餐项目。

## 安装依赖
```
yarn install
```

## 启动服务
```
yarn serve
```

## 项目描述
该项目主要有以下几个组件
1. vHeader——头部
2. Goods——商品页
3. Ratings——评价页
4. Seller——商家页
5.foodDetailPage——商品详情页
等其它组件。
并根据项目抽象成了其它几个通用小组件: 有**Dialog、CartControl、Star、Split**等组件。
并使用了better-scroll js库，用于解决移动端各种滚动需求。

## 遇到的问题和解决方案

### 1. Tab切换时底部的1px边框问题，在手机上显示并不是 1px ，而是比 1px 要粗,如何解决?

首页 Tab 切换有一个底部1px问题。即在CSS代码中写了1px，但是实际在iphone6/7/8上显示的却是2px，在iphone 6plus/7plus/8plus 却是3px，如何解决？原因是什么？

为了说明原因我们先要搞清楚什么是dpr(devicePixelRatio)即**设备像素比**，设备像素比 = **设备像素 ：设备独立像素**。

设备像素也称为**物理像素**，是显示器的**最小物理单位**。

设备独立像素独立于设备，与设备无关，通常我们说的电脑的分辨率为 1960 * 1440，指的就是设备
独立像素，也称为**逻辑分辨率**。

为了搞清楚原因，我们还需要知道什么是**CSS像素**？

CSS像素用于度量网页上的内容。在一般情况下(当页面缩放比为1时)，一个CSS像素对应一个设备独立像素。

假设dpr为2的屏幕，在页面缩放比为1下，你写了border:1px solid red;那么就对应一个设备独立像素，2个设备物理像素，这就是让你在屏幕上看起来比较宽的原因。在dpr为3的设备上，看起来更粗。


如何解决，既然在不同dpr的设备上显示的大小不同，只要在dpr > 1的设备上，将大小进行缩放就可以解决了。以下是解决边框的一种方案，即通过媒体查询的不同来进行不同的缩放。

```CSS
/* 解决移动端 border 1px问题 */
/* 还要加一行meta标签 */
 <meta name="viewport" content="width=device-width,initial-scale=1.0
      minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
@media (-webkit-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(0.7);
      transform: scaleY(0.7);
    }
  }
}

@media (-webkit-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }

}

@media (-webkit-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
  .border-1px {
    &::after {
      -webkit-transform: scaleY(0.3);
      transform: scaleY(0.3);
    }
  }
}
```
还可以使用 box-shadow、border-image等方法，但是这些方法对于想要做border-radius的情况无能为力。

### 2. 使用sass中的@mixin混入来提高代码的可复用性，避免大段的CSS样式代码重复。
具体可查看sass的官方文档。

### 3. vHeader组件中点击的商家详情页弹出层中的底部粘滞效果即 CSS Strickey Footer，如何做?

即如何实现弹出层的关闭按钮始终显示在底部，即使页面内容高于设备高度时，也在底部。

这种情况可以使用 flex 布局来解决。给内容设置 flex: 1,即当页面内容高度过小时，则自动将剩余的空间分配给它，页面内容过高时，底部关闭按钮自然而然的就在底部。

### 4. Goods组件中如何实现左右两栏联动效果，思路是什么?
在使用better-scroll库之前，需要注意一个问题。

[![8lno6A.md.png](https://s1.ax1x.com/2020/03/14/8lno6A.md.png)](https://imgchr.com/i/8lno6A)

绿色部分为 wrapper，也就是**父容器**，它会有固定的高度。黄色部分为 **content**，它是父容器的第一个子元素，它的高度会随着内容的大小而撑高。那么，当 content 的高度不超过父容器的高度，是不能滚动的，而它一旦超过了父容器的高度，我们就可以滚动内容区了，这是better-scroll的滚动原理。并且该js库自带了**防抖节流**功能。

**左右联动效果思路：** 先遍历获取每一个list-item的实际高度，可以使用**offsetHeight、getBoundingClientRect**等方式获取到。给一个初始height为0，
将获取到的每一个高度都加上之前的高度，然后一项一项的放入到一个数组中。当在滚动区域内滚动时，计算滚动出去的距离，并遍历数组中的每一项，查看前一项与后一项的差值与滚动出去的距离进行比较，若落在数组的哪个范围内，那么数组的索引就是左栏的实际激活元素的第几位。

```JavaScript
 computed: {
  currentIndex() {
    for (let i = 0; i < this.listHeight.length; i++) {
      let height1 = this.listHeight[i]
      let height2 = this.listHeight[i + 1]
      if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
        return i
      }
    }
    return 0
  }
}
let foodList = this.$refs['food-list']
    let height = 0
    this.listHeight.push(height)
    foodList.forEach((item) => {
    height += item.offsetHeight
    this.listHeight.push(height)
})
```
点击左栏中的元素时，让右侧的list-item对应到相应的位置，这很简单。

### 5. 在使用better-scroll时，确保子元素的高度比父元素高并且父元素固定了高度，但是仍然不起效果?

由于Vue中的**DOM是异步更新**的，即数据发生变化了，但是DOM并没有立即更新。因此你需要确保元素已经渲染在了浏览器中，此时better-scroll才可以获取到子元素的高度。因此需要在下一个事件循环中去获取子元素的高度，此时能保证获取的高度是一致的。Vue提供了**nextTick API**用于当DOM发生发生了更新时你需要在这里做些什么事。

### 6.在两个行内标签之间虽然你没有给margin、padding什么的，但是显示时仍然会有间隙，是为什么，如何解决?
```HTML
<span>20</span>
<span>50</span>
```
以上的两个span标签之间会有间隙，是因为两个标签之间有回车符号(或换行)，因此会有间隙。解决这个问题的办法可以让两个标签之间没有回车，或者父元素的font-size为0，子元素再设置各自的font-size。

### 7. 当路由之间切换时，想要保存商家页面的状态(商家页面基本不会发生太大的变化，因此缓存该组件)，如何实现?
可以使用 Vue 的 **keep-alive** 组件，这个组件官方说到有缓存功能。

### 8. 以商品页组件和购物车组件为例，说话组件之间的设计原则。
1. 从功能上拆分层次，尽量让组件原子化(每个组件负责一个功能)。
2. 分容器组件和ui组件，容器组件负责数据，ui组件负责显示，从容器组件中拿到数据显示。

![8RNHaR.png](https://s1.ax1x.com/2020/03/21/8RNHaR.png)

总的来说Goods组件又分为两部分，用于展示商品列表的组件，购物车组件。

代码如下：
```JS
<div class="goods">
    <GoodList></GoodList>
    <ShopCart></ShopCart>
  </div>
```

由上述图片可以看到，购物车组件和商品列表组件中都有控制商品数量加减的按钮，我们可以将它抽象成一个组件，即cart-control组件。

```JS
 <CartControl :select-food="food"></CartControl>
```

**由于我使用了Vuex做状态管理，那么这几个组件中的容器组件就是Vuex了，其它组件则都是ui组件。遵从了数据设计的分层原则，并且每个组件只是负责自己的那一部分功能，遵从了组件设计的功能原则。**

以上主要设计过程是这样的:

1. GoodList组件发出请求后将数据拿到之后，将该数据存放到Vuex中，该组件进行渲染时，则从Vuex中的state拿数据进行渲染。
2. CartControl组件用于将商品加入到购物车中，可以添加删除等。GoodList组件中使用v-for渲染商品列表时将每个商品的信息传递给CartControl，表示被选中的商品。代码如下:

**注意**: CartContro组件添加删除商品时，不应该直接操控shop-cart中的数据，它只是负责展示，shop-cart也是一样，应该更改Vuex中的数据。

**Vuex存放一个字段用于保存已选择的商品信息** , **此后shop-cart中的商品展示数据则从上述字段中拿数据**，同样 **CartContro组件中显示的数量也一样**，还有购物车中的**总数量和总价等**，只要这几个需要展示的数据使用**计算属性**就可以了，**基于已选择的商品信息的那个字段**。

这样**每次修改数据**时，用于保存已选择的商品信息的那个字段就会发生变化，而shop-cart、cartcontrol等中的数据都是基于该数据的计算属性，只要这个**依赖**变化了，其它数据则都能发生变化。


即每次修改数据和获取数据都从Vuex中获取，即Vuex负责管理数据，shop-cart、cart-control、goodList组件只负责展示。这样数据的存放和展示清晰明了。

```JS
<div class="good-list-wrapper">
    <ul class="good-list">
      <li class="good-list-item" v-for="goods in goodList">
        <h5 class="title">
          {{goods.name}}
        </h5>
        <ul class="foods">
          <li v-for="food in goods.foods" class="food-wrapper">
            <div class="food">
              <div class="picture">
                <img :src="food.image" width="100" height="100">
              </div>
              <div class="content">
                <h5 class="name">{{food.name}}</h5>
                <span class="price">{{food.price}}元</span>
              </div>
              <div class="cart-control-wrapper">
                <CartControl :select-food="food"></CartControl>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
```



