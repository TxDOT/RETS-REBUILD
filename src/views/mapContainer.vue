<template>
    <Map/>
    <RetsFeed/>
</template>

<script>
    import Map from '../components/Map.vue'
    import RetsFeed from '../components/RetsFeed.vue'

    export default{
        name: "MapContainer",
        components: {Map, RetsFeed}
        
    }
</script>