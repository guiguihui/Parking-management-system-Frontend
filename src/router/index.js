import Vue from 'vue'
import VueRouter from 'vue-router'
import Manage from '../views/Manage'
import parking from "@/views/Parking";

Vue.use(VueRouter)

const routes = [
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/Manage.vue'),
    redirect: "/home",
    children: [
      { path: 'home', name: '首页', component: () => import('../views/Home.vue')},
      { path: 'user', name: '用户管理', component: () => import('../views/User.vue')},
      { path: 'parking', name: '停车场管理', component: () => import('../views/Parking.vue')},
      { path: 'space', name: '停车位管理', component: () => import('../views/Space.vue')}
    ]
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
