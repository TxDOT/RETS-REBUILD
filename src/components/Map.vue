<template>
    <div id="viewDiv">
        <Teleport to="body">
            <detailsAlert v-if="store.isAlert" id="showAlert"/>
        </Teleport>
        <v-banner v-if="store.devStatus === 'dev'" lines="one" class="" style="position: absolute; width: fit-content; top: 0px; left: 0; right:1030px; margin: auto; justify-content: center; display: flex;" bg-color="warning">
            <p>You are in the TEST enviornment. Using UAT data.</p>
        </v-banner>
        
        <Teleport to="body">
            <v-card rounded="0" id="cancelpopup" v-if="store.cancelpopup">
            
                <div class="banner-txt">
                    Discard unsaved changes?
                </div>
                <hr/>
                <span class="popuptext2">
                    If you proceed, your changes will be discarded.
                </span>
                <v-btn-toggle class="trigger-buttons" density="compact" style="position: relative; top: 23px;">
                    <v-btn class="secondary-button"  @click="goBackActivity()" variant="plain" size="small" style="float: right;">GO BACK</v-btn>
                    <v-btn class="main-button-style" @click="discardedits" variant="outlined" size="small" style="float: right;">DISCARD</v-btn>
                </v-btn-toggle>
        
            </v-card>

        </Teleport>
        
    
    </div>

    

</template>

<script>
//import functions
//import {queryRetsTable} from './utility.js'
import {view} from './map-Init.js'
import {home, hoverRetsPoint, discardeditcopy, openDetails, updateRetsObj, removeOutline, removeHighlight, highlightRETSPoint, zoomTo} from './utility.js'
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
            window.document.title = 'RETS Application'
            if(!store.isDetailsPage){
                const archiveRets = JSON.parse(store.archiveRetsDataString)
                console.log(archiveRets.attributes.RETS_ID)
                console.log(store.openAfterDiscardRets.attributes.RETS_ID)
                if (archiveRets.attributes.RETS_ID != store.openAfterDiscardRets.attributes.RETS_ID){
                    openDetails(store.openAfterDiscardRets)
                    store.isCard = false
                    store.isDetailsPage = true
                    store.activityBanner = `${store.openAfterDiscardRets.attributes.RETS_ID}`
                    //outlineFeedCards()
                    zoomTo(store.openAfterDiscardRets.geometry)
                    store.cancelpopup = false
                    store.isSaveBtnDisable = true
                    store.toggleFeed = 2
                    return
                }

                let findItem = store.roadObj.find((ret) => ret.attributes.OBJECTID === archiveRets.attributes.RETS_ID)
                updateRetsObj(findItem, archiveRets)
                store.cancelpopup = false
                store.isSaveBtnDisable = true
                store.activityBanner = "Activity Feed"
                store.toggleFeed = 1
                return
            }
            
            discardeditcopy();
            return
        },
        goBackActivity(){
            if(!store.isSaveBtnDisable || (store.retsObj.attributes.GIS_ANALYST === null || store.retsObj.attributes.GRID_ANALYST === null || store.retsObj.attributes.DIST_ANALYST === null|| store.retsObj.attributes.DIST_NM === null || store.retsObj.attributes.CNTY_NM === null)){
                removeOutline()
                removeHighlight("a", true)
                highlightRETSPoint(store.retsObj.attributes)
                const elementId = String(store.retsObj.attributes.RETS_ID).concat('-', store.retsObj.attributes.OBJECTID);
                const element = document.getElementById(elementId);
                element.classList.toggle('highlight-card');

                store.isCard = false
                store.isDetailsPage = true
                store.cancelpopup = false
                store.toggleFeed = 2
                return
            }
            store.cancelpopup = false;
            store.isSaveBtnDisable = true
            return
        }

    }
}
</script>

<style>
    #viewDiv{
        position: absolute;
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
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
        top: 0;
        left: 50% !important; 
        transform: translateX(-50%); 
        border-radius: 0% !important;
    }
    #cancelpopup{
        position: absolute;
        width: 25rem;
        height: 140px; 
        border-radius: 0;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
 
        padding: 10px; 
    }

    #separator3{
        border: 0;
        border-bottom: 1px solid ;
        margin: 0 auto;
        width: 22.5rem;
        padding-top: 1px;
        margin-bottom: 0px;
    }

    .buttonpositioning2{
        position: absolute;
        bottom: 14px;
        width: 20rem;
        right: 8px;
        justify-content: end;
    }

    .popuptext2{
        position: relative;
        top: 10%;
        font-size: 13px;
    }

</style>