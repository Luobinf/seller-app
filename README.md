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

### 7. 当路由之间切换时，想要使得之前放入购物车的商品是多少个切换回来还是那么多个，如何实现?
一开始我使用了 Vue 的 **keep-alive** 动态组件，这个组件官方说到有缓存功能。但是当我使用时发现虽然状态被缓存下来了，但是每一个商品旁边的加减按钮的值也被保存了，在下一次点击时会出现如下效果。

[![8lGG6S.md.gif](https://s1.ax1x.com/2020/03/14/8lGG6S.md.gif)](https://imgchr.com/i/8lGG6S)

因此，使用了**Vuex**来进行状态保存，解决上述问题。使用 Vuex 有点大材小用，因为该项目还没有实现其它如登录注册等功能，实际上不用Vuex也可以做到。有登录注册功能时应该使用session来做，服务端根据浏览器传递过来的 session id 在服务器的内存session中寻找用户id所对应的具体信息，随后再将每个用户所对应的购物车等其它信息展示出来。



