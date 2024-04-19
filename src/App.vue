
<template>
  <v-app>
    <div id="app">
      <router-view/>
    </div>
  </v-app>


</template>

<script >
import {login} from './components/login.js'
// import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

export default{
  name: "App",
  data(){
    return{
      auth: {}
    }
  },

  mounted(){
    this.auth = login()

    
    //import Layer from "@arcgis/core/layers/Layer.js"
    //used to register ESRI Application so users can access map
    
  },
  watch:{
    auth:{
      handler: function(){
        this.$router.push('/apps/statewide_mapping/rets_rebuild/login')
      },
      immediate: true,
    }
  }
}

</script>

<style >
@import './style.css';

#app{
  overflow-y: hidden !important;
  top: 0px;
}



</style>