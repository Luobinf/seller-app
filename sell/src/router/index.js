import Vue from 'vue'
import VueRouter from 'vue-router'
// import Goods from "../components/goods/Goods"
// import Ratings from "../components/ratings/Ratings"
// import Seller from "../components/seller/Seller"
//使用路由懒加载，实现路由切换时按需加载组件
const Ratings = () => import('../components/ratings/Ratings')
const Goods = () => import('../components/goods/Goods')
const Seller = () => import('../components/seller/Seller')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/goods',
  },
  {
    path: '/goods',
    component: Goods
  },
  {
    path: '/ratings',
    component: Ratings
  },
  {
    path: '/seller',
    component: Seller
  }
]

const router = new VueRouter({
  routes,
})

export default router
