<template>
    <div id="viewDiv">
        <detailsAlert v-if="store.isAlert" id="showAlert"/>
        <v-banner v-if="store.devStatus === 'dev'" lines="one" class="" style="position: absolute; width: fit-content; top: 0px; left: 25em; justify-content: center; display: flex;" bg-color="warning">
            <p>You are in the TEST enviornment. Using UAT data.</p>
        </v-banner>
        <v-alert v-if="store.coordinatenotification" tile variant="elevated" color="blue-grey-darken-3" density="compact" style="position: absolute; width: fit-content; top: 10px; left: 25em; justify-content: center; display: flex;">
            {{store.latlonstring}} copied to clipboard
        </v-alert>
        
    </div>

    

</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
import {home, hoverRetsPoint} from './utility.js'
import {store} from './store.js'

// import ShowChanges from './showChanges.vue'
//import ESRI JS ESM class
import { defineAsyncComponent } from 'vue'
export default{
    name: "Map",
    components: {detailsAlert: defineAsyncComponent(()=>import('./detailsAlert.vue'))},
    data(){
        return{
          store
        };
    },
    async mounted(){
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

    #showAlert{
        position: absolute;
        left: 37%;
        border-radius: 0% !important;
    }
</style>