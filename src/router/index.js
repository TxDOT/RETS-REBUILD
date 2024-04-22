import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: `${import.meta.env.BASE_URL}login`, name:"Inital", component: () => import('../views/initial.vue')},
    { path: `${import.meta.env.BASE_URL}map`, name:"Map", component: () => import('../views/mapContainer.vue')}
]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  export default router