
<template>
  <v-app> 
    <Map/>
    <RetsFeed/>
  </v-app>


</template>

<script >
import Map from './components/Map.vue'
import RetsFeed from './components/RetsFeed.vue'
// import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

export default{
  components: {Map, RetsFeed},
  name: "App",
}

</script>

<style >
#app{
  overflow-y: hidden !important;
}

</style>
