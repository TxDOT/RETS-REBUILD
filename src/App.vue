
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
  },
  watch:{
    auth:{
      handler: function(){
        this.$router.push({name: "NicCage"})
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