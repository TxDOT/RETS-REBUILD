
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
  // beforeMount(){
  //   console.log($route.params.retsid)
  // },
  beforeRouteUpdate(to, from){
    console.log(to,from)
  },
  mounted(){
    this.auth = login()
  },
  watch:{
    auth:{
      handler: function(){
        console.log(this.$router)
        this.$router.push({name: "Inital"})
      },
      immediate: true,
    },
    $route(to, from){
      console.log(to,from)
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