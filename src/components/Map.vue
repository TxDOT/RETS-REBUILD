<template app>
    <div id="viewDiv">
    </div>
    

</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
import {home, hoverRetsPoint, clickRetsPoint} from './utility.js'
//import ESRI JS ESM class
export default{
    name: "Map",
    data(){
        return{
        };
    },
    mounted(){
            //1.Check to see if user is signed in. If not sign them in without using the popup
            //2. If user is signed in, get username and set retLayer definition and load map
            
            view.container = this.$el
            home();
            hoverRetsPoint();
        },
    methods:{
        
    }
}
</script>

<style>
    #viewDiv{
        position: fixed;
        height: 100%;
        width: 100%;
        min-height: 100%;
        top: 0;
     
        
        /* overflow-y: hidden; */
    }

    #popupContainer{
        position: absolute;
        top: 50%;
        display: block;
        width: 23%;
    }

    .esri-view {
        --esri-view-outline-color: none !important;
    }



</style>