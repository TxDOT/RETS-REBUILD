import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/apps/statewide_mapping/rets_rebuild/login', name:"Inital", component: () => import('../views/initial.vue')},
    { path: '/apps/statewide_mapping/rets_rebuild/map', name:"Map", component: () => import('../views/mapContainer.vue')}
]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  export default router