import Vue from 'vue'
import VueRouter from 'vue-router'
import Ratings from "../components/ratings/Ratings"
import Goods from "../components/goods/Goods"
import Seller from "../components/seller/Seller"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/goods'
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
  },
]

const router = new VueRouter({
  routes
})

export default router
