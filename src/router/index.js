import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: `${import.meta.env.BASE_URL}login`, name:"Inital", component: () => import('../views/initial.vue')},
    { path: `${import.meta.env.BASE_URL}map/:retsid?`, props: true, name: "Map", component:()=> import('../views/mapContainer.vue')},
    //{ path: `${import.meta.env.BASE_URL}map`, name:"Map", component: () => import('../views/mapContainer.vue')},,
    { path: `${import.meta.env.BASE_URL}error`, name:"ErrorPage", component: () => import('../views/error.vue')},
    { path: `${import.meta.env.BASE_URL}`, name:"NicCage", component: () => import('../views/cagey.vue')},
]
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })


  export default router