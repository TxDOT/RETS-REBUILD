
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

export default{
  name: "App",
  data(){
    return{
      auth: {},
      routeParam: null
    }
  },
  beforeRouteLeave(){
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
      router.afterEach((to)=>{
        if(to.matched[0].name === "Inital") return
        
        localStorage.removeItem("retsParam")

        if(to.query.retsid){
          localStorage.removeItem("retsParam")
          localStorage.setItem("retsParam", to.query.retsid)
          this.routeParam = to.query.retsid
          return 
        }
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