<template app>
    <div id="viewDiv"></div>
    

</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
//import ESRI JS ESM class
export default{
    name: "Map",
        mounted(){
            //1.Check to see if user is signed in. If not sign them in without using the popup
            //2. If user is signed in, get username and set retLayer definition and load map
            
            view.container = this.$el
            
        },
        methods:{

        }
    }
</script>

<style>
    #viewDiv{
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        /* overflow-y: hidden; */
    }

    #popupContainer{
        position: absolute;
        top: 50%;
        display: block;
        width: 23%;
    }

</style>