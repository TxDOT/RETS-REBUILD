<template>
    <Map />
    <RetsFeed :retsparam="this.retsid"/>
    <NavBar/>
    <IsRoadExist/>
</template>

<script>

    import { defineAsyncComponent } from 'vue'

    export default{
        name: "MapContainer",
        props:{
            retsid: String
        },
        components: {
            Map: defineAsyncComponent(() => import('../components/Map.vue')), 
            NavBar: defineAsyncComponent(() => import('../components/NavBar.vue')),
            RetsFeed: defineAsyncComponent(() => import('../components/RetsFeedCards.vue')),
            IsRoadExist: defineAsyncComponent(() => import('../components/checkRoadExist.vue'))
        },
    }
</script>
