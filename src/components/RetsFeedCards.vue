<template>
    <div id="card-container">
        <div id="activity-header" class="main-color">
            <div id="container-header">
                <header>RETS Dashboard</header>
            </div>
            <div class="add-new-btn">
                <div style="float:right;">
                    <v-btn v-for="(tool, i) in addbutton" :key="i" :value="tool" @click="tool.action()" :prepend-icon="buttonIcon" color="#4472C4" rounded="0" id="add-new-btn"  class="main-button" v-if="!store.isDetailsPage">
                        <p class="text-btn" id = "addbtn">{{addbtntext}}</p>
                    </v-btn>
                </div>
            </div>
        </div>

        <v-banner id="feed-banner" lines="two" density="default" min-width="0%">
            <div style="width: 100%;">
                <div class="banner-txt">
                    <p>{{store.activityBanner}}</p>
                    <div class="retsSubtitle">
                        <div id="retSubText">
                            <v-text-field variant="plain" v-if="store.isDetailsPage" :disabled="isSubtitle" placeholder="Enter a subtitle" style="position:relative; top: 1px; right: 3px; max-width: 34ch" class="rets-subtitle-text" v-model="store.retsObj.attributes.RETS_NM" @update:modelValue="store.checkDetailsForComplete()">
                            </v-text-field>
                        </div>
                    </div>
                </div>

                <div v-if="!store.isDetailsPage" style="position: relative; top: .1rem">
                    <div>
                        <v-btn class="banner-btn" @click="store.isfilter = !store.isfilter" density="compact" variant="flat" flat min-width="30">
                            <v-badge color="#4472C4" :content="store.filterTotal">
                                <v-icon size="x-large">mdi-filter</v-icon>
                            </v-badge>
                        </v-btn>
                    </div>
     
                    <v-tooltip location="top">
                        <template v-slot:activator="{props}">
                            <div class="switch" v-bind="props">
                                <v-switch flat v-model="store.isShowSelected" density="compact"  @update:modelValue="updateSelection(store.isShowSelected)" color="primary" :disabled="!store.roadHighlightObj.size"></v-switch>
                            </div>
                        </template>
                        <span>Show Selected Cards</span>
                    </v-tooltip>
                </div>
            </div>
        </v-banner>

        <div id="search-feed" v-if="!store.isDetailsPage">
            <v-text-field density="compact" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" v-model="actvFeedSearch" variant="solo-filled" >
                <template v-slot:append-inner>
                    <v-icon icon="mdi-close" v-if="actvFeedSearch.length" @click="clearContent"></v-icon>
                </template>
            </v-text-field>
        </div>
        <div class="card-feed-div" v-show="store.isCard">
            <RetsCards/>
        </div>
        <div id="Spinner" v-if="isSpinner">
            <v-progress-circular color="blue" indeterminate size="60" ></v-progress-circular>
        </div>
        <RetsDetailPage v-if="store.isDetailsPage"/>
    </div>


    <v-card v-if="uploadAttachment" class="card attachCard"> 
        <div class="cardDiv" id="dragndrop" @drop="dropAttachment($event)" @dragover="dragover()" @click="fileAttach()" @dragleave="dragLeave()">
            <v-card-title>Upload Attachment</v-card-title>
            <div>
                <v-card-text>Drag and drop attachment or click to add attachment</v-card-text>
            </div>
        </div>
    </v-card>
    <Filter v-if="store.isfilter"/>

    <v-card style="position: absolute; float: center; width: 25%; left: 40%; top: 30%; margin: 15px; border-radius: 0%;" color="#212121" v-if="unsavedChanges">
        <v-card-title>Discard unsaved changes?</v-card-title>
        <v-divider style="margin-left: 15px; margin-right: 15px; color:white;"></v-divider>
        <v-card-text>
            If you proceed your changes will be discarded.
        </v-card-text>
        <div style="margin: 15px;">
            <div style="float: right; margin-bottom: 15px;">
                <v-btn variant="plain" @click="cancelReturn">Cancel & Return</v-btn>
                <v-btn variant="outlined" style="border-radius: 0%;" @click="proceed">Proceeed</v-btn>
            </div>
        </div>
    </v-card>

</template>

<script>
import {clickRetsPoint, getQueryLayer, returnHistory, getHighlightGraphic, removeHighlight, createtool, highlightRETSPoint, toggleRelatedRets, zoomTo, changeCursor, outlineFeedCards, openDetails} from './utility.js'
import {appConstants} from '../common/constant.js'
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import {store} from './store.js'
import {view, retsGraphicLayer} from './map-Init.js'
import { sketchWidgetcreate, createretssym } from './map-Init.js'
import {addRETSPT} from '../components/crud.js'

import { defineAsyncComponent } from 'vue'
export default{
    name: "RetsFeed",
    components: {RetsDetailPage: defineAsyncComponent(()=>import('./RetsDetail.vue')),
                 Filter: defineAsyncComponent(()=>import('./RetsFilter.vue')),
                 RetsCards: defineAsyncComponent(()=> import('./retsCards.vue'))
                }, 
    data(){
        return{
            loading: true,
            Spinneractive: false,
            isSpinner: false,
            buttonIcon: 'mdi-plus',
            addbtntext: "New",
            addrets: null,
            filterOptions: appConstants.RetsStatus,
            roads:[],
            currRoad: {},
            isColorPicked: false,
            pickColor: "blue",
            
            flagColor: "",
            timer: "",
            currentValues: "",
            send: null,
            activityBanner: "Activity Feed",
            isSubtitle: false,
            isRetsActivated: true,
            retsSubtitle:"",
            actvFeedSearch: "",
            uploadAttachment: false,
            isfilter: false,
            loggedInUser: '',
            retsFilters: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "EDIT_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, 
                         "filterTotal": 2},
            count: 0,
            store,
            stageData: 0,
            unsavedChanges: false,
            showChanges: false,
            showChanges: false,
            addNewPtEvent: false,
            isCreateEnabled: true,
            addbutton: [
                {title:"New", action: async () =>{
                                const graphicAdd = await this.handlecreate();
                                if (graphicAdd){
                                    this.processAddPt(graphicAdd)
                                    return
                                }

                                return
                }}
                          
            ],

            isShowSelected: false,
            isSwitchDisabled: false
        }
    },
    beforeMount(){
        clickRetsPoint()
    },
    mounted(){
        this.showChanges = true
        reactiveUtils.on(() => view.popup, "trigger-action",
            async (event) => {
                if (event.action.id === "open-details") {
                    removeHighlight("a", true)
                    await getHighlightGraphic()
                    const graphicOid = store.clickedGraphic
                    console.log(graphicOid)
                    console.log(retsGraphicLayer)
                    const returnGraphic = retsGraphicLayer.graphics.items.find(ret => ret.attributes.OBJECTID === graphicOid)
                    returnGraphic.attributes.flagColor = store.setFlagColor(returnGraphic.attributes)
                    returnGraphic.attributes.mdiaccountmultiplecheck = store.isAssigned(returnGraphic.attributes)
                    returnGraphic.attributes.mdiaccountgroup = store.isMOTxDOTConnct(returnGraphic.attributes.ACTV)
                    returnGraphic.attributes.mdipencilboxoutline = store.isRequest(returnGraphic.attributes.ACTV)
                    returnGraphic.attributes.mdialarm = store.isDeadline(returnGraphic.attributes.DEADLINE)
                    returnGraphic.attributes.mdicheckdecagramoutline = store.isComplete(returnGraphic.attributes.STAT)
                    returnGraphic.attributes.mditimersand = store.isNoActivity(returnGraphic.attributes.STAT, returnGraphic.attributes.EDIT_DT)
                    returnGraphic.attributes.mdiexclamation = store.isPrio(returnGraphic.attributes.PRIO)
                    
                    this.stageData = {attributes: returnGraphic.attributes, geometry: [returnGraphic.geometry.x, returnGraphic.geometry.y]}
                    this.checkChanges()
                }
        });
        this.retsFilters.loggedInUser = store.loggedInUser
        this.retsFilters[appConstants.queryField[appConstants.userRoles.find(x => x.value === store.loggedInUser).type]] = appConstants.defaultUserValue
    },
    methods:{
        clearContent(){
            this.actvFeedSearch = ""
        },
        async processAddPt(newPointGraphic){
            try{
                this.isSpinner = true
                this.Spinneractive = false
                store.isCard = false
                const obj = await addRETSPT(newPointGraphic, "rets")
                const objectid = obj.addFeatureResults[0].objectId
                await this.addretss(objectid)
                //this.addrets = objectid
                this.isSpinner = false
                this.Spinneractive = true
                return
            }
            catch(err){
                console.log(err)
            }
            //handleaddrets(newPointGraphic, this.addrets);
        },
        alert(s){
            window.alert(s)
        },
        proceed(){
            this.unsavedChanges = false
            this.double({attributes: this.stageData.attributes, geometry: [this.stageData.geometry[0], this.stageData.geometry[1]]}, 1)
        },
        cancelReturn(){
            this.unsavedChanges = false
            //do nothing
        },
        checkChanges(){
            const beforeAtt = JSON.parse(store.currentInfo)
            const afterAtt = JSON.parse(JSON.stringify(store.retsObj))
            let issue = 0
            for(const [key, value] of Object.entries(beforeAtt.attributes)){
                if(key==='RELATED_RETS' || key==='flagColor' || key==='mdialarm' || key === 'mditimersand'){
                    continue
                }
                if(value !== afterAtt.attributes[key]){
                    this.unsavedChanges = true
                    issue++
                    return
                }
            }

            issue === 0 ? openDetails({attributes: this.stageData.attributes, geometry: [this.stageData.geometry.x, this.stageData.geometry.y]}, 1) : null
        },
        double(road){
            store.isSaving = false
            store.isSaveBtnDisable = true
            store.archiveRetsDataString = JSON.stringify(road)
            store.retsObj = road
            store.historyRetsId = road.attributes.RETS_ID
            
            
            returnHistory(`RETS_ID = ${road.attributes.RETS_ID}`)
            clearTimeout(this.timer)
            this.timer=""
            store.isCard = false
            store.isDetailsPage = true
            store.activityBanner = `${road.attributes.RETS_ID}`
            highlightRETSPoint(road.attributes)
            //outlineFeedCards()
            this.zoomToRetsPt(road)
            toggleRelatedRets(JSON.stringify(road))
            return
        },
        zoomToRetsPt(rets){
            clearTimeout(this.timer)
            this.timer = ""
            this.timer = setTimeout(()=>{
                const zoomToRETS = rets.geometry
                highlightRETSPoint(rets.attributes)
                zoomTo(zoomToRETS)
            },250)
        },
        removeUndefinedIndex(delRd){
            const findRoad = store.roadObj.findIndex(road => road.attributes.OBJECTID === delRd.OBJECTID)
            store.roadObj.splice(findRoad, 1)
        },

        async addretss(objectid){
            const querystring = {"whereString":`OBJECTID = ${objectid}`, "queryLayer": "retsLayer"}
            try{const querypromise = await getQueryLayer(querystring, "PRIO, CREATE_DT DESC")
                if (querypromise.features.length){
                    querypromise.features.forEach(
                        (feat)=> {
                            feat.attributes.flagColor = {flagColor: '', OBJECTID: ''}
                            feat.attributes.mdiaccountmultiplecheck = store.isAssigned(feat.attributes)
                            feat.attributes.mdiaccountgroup = store.isMOTxDOTConnct(feat.attributes.ACTV)
                            feat.attributes.mdipencilboxoutline = store.isRequest(feat.attributes.ACTV)
                            feat.attributes.mdialarm = store.isDeadline(feat.attributes.DEADLINE)
                            feat.attributes.mdicheckdecagramoutline = store.isComplete(feat.attributes.STAT)
                            feat.attributes.mditimersand = store.isNoActivity(feat.attributes.STAT, feat.attributes.EDIT_DT)
                            feat.attributes.mdiexclamation = store.isPrio(feat.attributes.PRIO)
                            feat.attributes.CREATE_NM = store.returnUserName(feat.attributes.CREATE_NM)
                            feat.attributes.EDIT_NM = store.returnUserName(feat.attributes.EDIT_NM)
                            feat.attributes.CREATE_DT = store.returnDateFormat(feat.attributes.CREATE_DT)
                            feat.attributes.EDIT_DT = store.returnDateFormat(feat.attributes.EDIT_DT)
                            feat.attributes.RTE_NM = store.retsObj.attributes.RTE_NM
                            feat.attributes.DFO = store.retsObj.attributes.DFO ? store.retsObj.attributes.DFO : null
                            const addNewRetsPt = {attributes:feat.attributes, geometry:[feat.geometry.x,feat.geometry.y]}
                            store.addRetsID(addNewRetsPt)
                            this.double(addNewRetsPt)
                        }
                    )
                    store.isCancelBtnDisable = true
                }

            }
            catch(error){
                console.log(error)
            }
        },

        fileAttach(){
            const input = document.createElement('input')
            input.type = 'file',
            input.click()
        },
        dragover(){
            document.getElementById("dragndrop").style.color = "green"
        },
        dragLeave(){
            document.getElementById("dragndrop").style.color = "white"
        },
        changeNumFilter(filter){
            if(filter === 'cancel'){
                this.isfilter = false;
                return
            }
            store.retsFilters = filter
            this.isfilter = false
            store.setFilterFeed()
        },
        changeFlagIcon(color){
            if(color === '#FFFFFF'){
                return 'mdi-flag-outline'
            }
            return 'mdi-flag'
        },
        async handlecreate(){
            // const abortPromise = new AbortController()
            // const signal = abortPromise.signal
            if (this.isCreateEnabled === true) {
                this.addbtntext = "Cancel"
                this.buttonIcon = null
                this.isCreateEnabled = !this.isCreateEnabled;
                const newPointGraphic = await createtool(sketchWidgetcreate, createretssym);
                // Process the newPointGraphic as needed
                this.isCreateEnabled = !this.isCreateEnabled;
                this.addbtntext = "New"  
                this.buttonIcon = "mdi-plus"
                return newPointGraphic
                            
                } 
            else {
                changeCursor("default")
                store.isMoveRetsPt = false
                sketchWidgetcreate.cancel();
                store.isAdd = false
                this.isCreateEnabled = !this.isCreateEnabled;
                this.addbtntext = "New"
                this.buttonIcon = "mdi-plus"
            }
        },

        updateSelection(e){
            if(!e){
                store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
                store.updateRetsSearch = store.roadObj.sort((a,b) => new Date(b.EDIT_DT) - new Date(a.EDIT_DT))
                outlineFeedCards(store.roadHighlightObj)
                return
            }
            store.updateRetsSearch = store.roadHighlightObj
            
            return
        },

    },
    watch:{
        actvFeedSearch:{
            handler: function(a){
                try{
                    this.noSearch = false
                    if(!a.length || !a){
                        store.updateRetsSearch = !store.isShowSelected ? store.roadObj.slice().sort((a,b) => b.EDIT_DT - a.EDIT_DT) : store.roadHighlightObj
                        outlineFeedCards(store.roadHighlightObj)
                        return
                    }
                    const searchString = a.toLowerCase()
                    let s;
                    const acceptedObj = []
                    for(s of !store.isShowSelected ? store.roadObj : store.roadHighlightObj){
                        // const createObjKey = Object.values(s.attributes)
                        for(const [key, value] of Object.entries(s.attributes)){
                            if(key === "RETS_ID" || key === "RETS_NM" || key === "DESC_" || key === "RTE_NM" || key === "ACTV" || key === "ACTV_NBR"){
                                if(String(value).toLowerCase().includes(searchString) && (acceptedObj.findIndex(oid => oid.attributes.OBJECTID === s.attributes.OBJECTID) === -1)){
                                    if(acceptedObj.length === 10){
                                        store.updateRetsSearch = acceptedObj.sort((a,b) => b.EDIT_DT - a.EDIT_DT)
                                        return
                                    }
                                    acceptedObj.push(s)
                                }
                            }
                        } 
                    }
                    if(!acceptedObj.length){
                        this.noSearch = true
                    }
                    store.updateRetsSearch = acceptedObj.sort((a,b) => b.EDIT_DT - a.EDIT_DT)
                }
                catch(a){
                    console.log(a)
                }
            },
            immediate: true
        },
        retsSubtitle:{
            handler:function(word){
                if(word.length<0) return
                setTimeout(()=>{
                   // this.filterPros.attributes.RTE_NM = word
                },1000)
            }
        },
        // addrets:{
        //     handler: async function(){
        //         await this.addretss()
        //     },
        //     immediate: true
        // },
        'store.retsObj.attributes.RETS_NM':{
            handler: function(a,b){
                if(!b) return
                if(b.length === 30){
                    store.retsObj.attributes.RETS_NM = a.slice(0, -1)
                    return
                }
            }
        },
        'store.roadHighlightObj.size':{
            handler: function(a){
                if(a === 0){
                    store.updateRetsSearch = store.roadObj.sort((a,b) => new Date(b.EDIT_DT) - new Date(a.EDIT_DT))
                    store.isShowSelected = false
                    return
                }
                
                return
            },
            immediate: true
        },
        // 'store.isSelectEnabled':{
        //     handler: function(){
        //         store.roadHighlightObj.clear()
        //         removeHighlight("a", removeAll); 
        //         scrollToTopOfFeed(store.roadHighlightObj.size) 
        //     },
        //     immediate: true
        // },
    },
    computed:{

    },
        

}
</script>

<style scoped>
    #card-container{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;

        width: 509px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 52px;
        padding: 0px;
        font-size: 7px;
    }

    .card.show{
        transform: translateX(0);
        opacity: 1;
    }
    #Spinner{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 45%;
        min-height: 90%;
    }
    .rets-subtitle-text :deep(input){
        color: #4472C4 !important;
        font-weight: bold;
        padding-left: 10px;
    }
    #addbtn{
        position: relative;
        left: 0%;
        top: 10%;
    }
    #retSubText{
        position: relative;
        right: 15px;
        padding: 0px;
        margin-left: 10px;
        bottom: .3rem;
        max-width: 310px;
        min-width: 20px;
        height:0px;
    }
    .attachCard{
        position: relative; 
        width: 20%; 
        top: 35%; 
        left: 50%; 
        height: 45% !important;
        width: 25% !important;
    }

    #feed-banner{
        font-size: 20px;
        height: 56px;
        position: absolute;
        top: 50px;
        width:100%;
    }

    .v-icon{
        position: relative;
        text-align: center;
    }

    .v-card{
        background-color: rgba(255,0,0,0);
    }
    .mdi-menu-down{
        display: none;
    }

    .rets-card-row.show{
        transform: translateX(0);
        opacity: 1;
    }

    .card-feed-div{
        top: 2rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        /* background: red; */
        /* min-height: 28vh; */
        max-height: 83vh;
        padding-top: 10px;
    }

    #container-header{
        position: relative;
        top: 9px;
        font-size: 23px;
        font-weight: bold; 
        padding-left: 20px;
    }
    #activity-header{
        position: relative;
        top: 0px;
        width: 100%;
    }
    .banner-btn{
        position: relative;
        bottom: 24px;
        float: right;
        margin: 0% !important;
        padding: 0% !important;
        right: 15px;
    }
    .banner-txt{
        position: relative;
        bottom: calc(6% - -3px);
        font-weight: bold;
        font-size: 23px;
        left: 5px;
        display: flex;
        flex-direction: row;
    }
    .retsSubtitleTxt{
        position: relative;
        font-size: 23px;
        left: 5px;
    }
    .add-new-btn{
        position: absolute;
        right: 1rem;
        top: 11px;
        text-align: center;
    }
    .text-btn{
        position: relative;
        padding-top: .2rem;
        right: .3rem;
    }

    #search-feed{
        position: relative;
        height: 54px;
        width: 100%;
        top: 58px;
        border-radius: 0px;
        padding: 0px 10px 10px 14px;
    }

    .route-card{
        position: relative;
        max-width: 50%;
    }


    #flagBtnDetails{
        padding: 1px !important;
        margin: 15px !important;
        min-width: 15px !important;
    }

    #renameRets{
        color: gray;
        left: 5px;
        bottom: 5px;
    }

    #dragndrop{
        height: 95%;
        width: 95%;
        border: 1px solid #4472C4;
    }
    
    .filter-notification-bubble{
        position: relative;
        width: 1.1rem;
        background-color:#4472C4;
        height: 1.1rem;
        float: right;
        bottom: 1rem;
        left: 2.5rem;
        border-radius: 50%;
    }

    .switch{
        position: relative;
        bottom: 32px;
        right: 45px;
        float: right;
        font-size: 10px;
    }

    :deep(.v-switch--inset .v-switch__track){
        height: 20px !important;
        width: 45px !important;
    }

</style>