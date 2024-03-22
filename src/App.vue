
<template>
  <v-app > 
    <Map/>
    <RetsFeed/>
  </v-app>


</template>

<script >
import Map from './components/Map.vue'
import RetsFeed from './components/RetsFeed.vue'
import {login} from './components/login.js'
// import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

export default{
  components: {Map, RetsFeed},
  name: "App",
  data(){
    return{
      auth: {}
    }
  },
  beforeMount(){
    login()
  },
  mounted(){
    
    //import Layer from "@arcgis/core/layers/Layer.js"
    //used to register ESRI Application so users can access map
    
  },
  methods:{

  }
}

</script>

<style >
@import './style.css';

#app{
  overflow-y: hidden !important;
}


</style>
