import MapContainer from '../views/mapContainer.vue'
import Initial from '../views/initial.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/apps/statewide_mapping/rets_rebuild/login', name:"Inital", component: Initial},
    { path: '/apps/statewide_mapping/rets_rebuild/map', name:"Map", component: MapContainer}
]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  export default router