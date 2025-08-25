
<template>
  <v-app>
    <div id="app">
      <router-view/>
    </div>
  </v-app>


</template>

<script >
import {login} from './components/login.js'
import router from './router/index.js'
import { store } from './components/store.js'
// import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

export default{
  name: "App",
  data(){
    return{
      auth: {},
      routeParam: null
    }
  },
  beforeRouteLeave(to, from){
    localStorage.removeItem("retsParam")
  },
  beforeUnmount(){
    localStorage.removeItem("retsParam")
  },
  mounted(){
    this.checkURL()
    this.auth = login(this.routeParam)
  },
  methods:{
    checkURL(){
      
      router.afterEach((to, from)=>{
        if(to.matched[0].name === "Inital") return
        
        // if(!to.query){
          localStorage.removeItem("retsParam")
        // }
        // if(!this.routeParam){
        //   localStorage.removeItem("retsParam")
        // }

        if(to.query.retsid){
          // routeParam = to.query.retsid
          localStorage.removeItem("retsParam")
          localStorage.setItem("retsParam", to.query.retsid)
          // sessionStorage.setItem("retsParam", to.query.retsid)
          this.routeParam = to.query.retsid
          return 
        }
        // localStorage.removeItem("retsParam")
        // window.sessionStorage.removeItem("retsParam")
        return

      })
      return
    }
  },
  watch:{
    auth:{
      handler: function(){

        this.$router.push({name: "Inital"})
      },
      immediate: true,
    },
    
    $route(to, from){
      console.log(to,from)
      // if(to.query.retsid){
      //   sessionStorage.setItem("retsParam", to.query.retsid)
      //   return
      // }
      // let getSessionStorage = sessionStorage.getItem("retsParam")
      // console.log(getSessionStorage)
      // if(getSessionStorage){
      //   sessionStorage.removeItem("retsParam")
      // }
      // console.log(to,from)
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