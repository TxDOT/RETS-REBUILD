<template app>
    <div id="viewDiv"></div>
    
</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
import {hoverHighlight} from './utility.js'
//import ESRI JS ESM classes

export default{
    name: "Map",
        mounted(){
            view.container = this.$el
            hoverHighlight()
        },
    }
</script>

<style>
    #viewDiv{
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    overflow-y: hidden;
    }
</style>