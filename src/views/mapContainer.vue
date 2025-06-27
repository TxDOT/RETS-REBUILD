<template>
    <Map :retsparam="this.retsid"/>
    <RetsFeed/>
    <NavBar/>
    <IsRoadExist/>
</template>

<script>

    import { defineAsyncComponent } from 'vue'

    export default{
        name: "MapContainer",
        props:{
            retsid: Number
        },
        components: {
            Map: defineAsyncComponent(() => import('../components/Map.vue')), 
            NavBar: defineAsyncComponent(() => import('../components/NavBar.vue')),
            RetsFeed: defineAsyncComponent(() => import('../components/RetsFeedCards.vue')),
            IsRoadExist: defineAsyncComponent(() => import('../components/checkRoadExist.vue'))
        },
        beforeRouteUpdate(to, from){
            console.log(to, from)
        },
        beforeRouteLeave(){
            return false
        },
        beforeCreate(){
            console.log("mount")
        }
    }
</script>
