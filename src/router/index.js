import MapContainer from '../views/mapContainer.vue'
import Initial from '../views/initial.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name:"Inital", component: Initial},
    { path: '/map', name:"Map", component: MapContainer}
]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  export default router