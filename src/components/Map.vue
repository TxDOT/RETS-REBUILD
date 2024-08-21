<template>
    <div id="viewDiv">
        <detailsAlert v-if="store.isAlert" id="showAlert"/>
        <v-banner v-if="store.devStatus === 'dev'" lines="one" class="" style="position: absolute; width: fit-content; top: 0px; left: 0; right:0; margin: auto; justify-content: center; display: flex;" bg-color="warning">
            <p>You are in the TEST enviornment. Using UAT data.</p>
        </v-banner>
        <v-banner v-if="store.coordinatenotification" lines="one"  style="position: absolute; width: fit-content; left: 0; right: 0; margin: auto; justify-content: center; display: flex;" bg-color="success">
            ({{store.latlonstring}}) has been copied to clipboard.
        </v-banner>
        <div>
            <v-card id="cancelpopup" v-if="store.cancelpopup">
            <v-card-title class="popupheader2" >
                Discard unsaved changes?
            </v-card-title>
            <hr id="separator3" />
            <v-card-subtitle class="popuptext2">
                If you proceed, your changes will be discarded.
            </v-card-subtitle>
            <v-btn-group class="buttonpositioning2" density="compact">
                <v-btn class="secondary-button"  @click="store.cancelpopup = false">GO BACK</v-btn>
                <v-btn class="main-button-style" @click="discardedits">DISCARD</v-btn>
            </v-btn-group>

            </v-card>
        </div>
        
    </div>

    

</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
import {home, hoverRetsPoint, discardeditcopy} from './utility.js'
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
        discardedits(){
            discardeditcopy();
        }

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
    #cancelpopup{
    position: fixed;
    border-radius: 5px;
    width: 25rem;
    height:20%; 
    border-radius: 0;
    left: 0%;
    right:0;
    top:0;
    bottom: 0;
    margin: auto;
}

#separator3{
    border: 0;
    border-bottom: 1px solid ;
    margin: 0 auto;
    width: 22.5rem;
    padding-top: 1px;
    margin-bottom: 10px;
}

.popuptext2{
    position: absolute;
    left: 10px;
}
.popupheader2{
    position: relative;
    left: 10px;
}



.buttonpositioning2{
    position: absolute;
    bottom: 14px;
    width: 20rem;
    right: 8px;
    justify-content: end;
}
</style>