<template>
    <Map/>
    <RetsFeed/>
    <NavBar/>
</template>

<script>

    import { defineAsyncComponent } from 'vue'

    export default{
        name: "MapContainer",
        components: {
            Map: defineAsyncComponent(() => import('../components/Map.vue')), 
            NavBar: defineAsyncComponent(() => import('../components/NavBar.vue')),
            RetsFeed: defineAsyncComponent(() => import('../components/RetsFeedCards.vue'))
        }
        
    }
</script>