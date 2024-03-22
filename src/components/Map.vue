<template>
    <div id="viewDiv">
      
        <ShowChanges style="position: absolute; left: 50%; top: 50%;" />
       
    </div>



</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
import {home, hoverRetsPoint} from './utility.js'
import ShowChanges from './showChanges.vue'
//import ESRI JS ESM class
export default{
    name: "Map",
    components: {ShowChanges},
    data(){
        return{
            show: true
        }
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
        position: absolute;
        height: 100%;
        width: calc(100% - 74px);
        top: 0;
        left: 74px;
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