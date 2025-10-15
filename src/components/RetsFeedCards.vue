<template>
    
    <div id="card-container">
       
        <div id="activity-header" class="main-color">
            <div id="container-header">
                <header>RETS Dashboard</header>
            </div>
            <div class="add-new-btn">
                <div style="float:right;">
                    <v-btn v-for="(tool, i) in addbutton" :key="i" :value="tool" @click="tool.action()" :prepend-icon="buttonIcon" color="#4472C4" rounded="0" id="add-new-btn" :disabled="store.isAddBtn" class="main-button" v-if="!store.isDetailsPage">
                        <span class="text-btn">{{addbtntext}}</span>
                    </v-btn>
                </div>
            </div>
        </div>

        <div class="feed-banner">
            <div style="position: relative; display: flex; flex-direction: row; width: 100% !important; max-height: 100%; padding-left: 10px; padding-right: 10px;">
                <div class="banner-txt" style="display: flex; flex-direction: row;">
                    <div style="position: relative; height: 100%; top: 4px; min-width: fit-content !important;">
                        {{store.activityBanner}}
                    </div>
                    <div style="width: fit-content; position: relative; top: 2px; height: fit-content; max-width: 100px; min-width: 33px;">
                        <span v-if="!store.isDetailsPage" id="headerCount" :style="{ color: countHeaderColor }" @mouseover="store.isShowSelected ? null : countPopupStatus = true; countHeaderColor = 'lightgray'" @mouseout="store.isShowSelected ? null : countPopupStatus = false; countHeaderColor = 'gray'">[{{ store.isShowSelected ? store.roadHighlightObj.size : store.updateRetsSearch.length }}]</span>
                    </div>

                    <div class="retsSubtitle">
                        <div id="retSubText">
                            <v-text-field variant="plain" autocomplete="off" v-if="store.isDetailsPage" :disabled="isSubtitle" placeholder="Add a subtitle" id="subtitleCard" :class="store.retsObj.attributes.RETS_NM?.length ? 'rets-subtitle-text-active' : 'rets-subtitle-text'" v-model="store.retsObj.attributes.RETS_NM" @update:modelValue="retsSubtitleUpdate($event)" maxlength="34"></v-text-field>
                        </div>
                    </div>
                </div>

                <div v-if="!store.isDetailsPage" style="position: relative; top: 4px; display: flex; flex-direction: row; width: 100%; gap: 0px;">
                    <div style="flex: auto;">
                        <v-tooltip location="bottom">
                            <template v-slot:activator="{props}">
                                <v-switch style="position: relative; bottom: 4px;" v-bind="props" flat v-model="store.isShowSelected" density="compact" @update:modelValue="updateSelection(store.isShowSelected)" color="primary" :disabled="!store.roadHighlightObj.size"></v-switch>
                            </template>
                            <span>Show Selected Cards</span>
                        </v-tooltip>
                    </div>

                    <div style="flex: auto;">
                        <v-btn class="banner-btn" @click="store.isfilter = !store.isfilter" density="compact" variant="flat" flat size="20">
                            <v-badge color="#4472C4" :content="store.filterTotal" location="top" style="padding-left: 5px;">
                                <v-icon size="20" style="position: relative; right: 4px;">mdi-filter</v-icon>
                            </v-badge>
                        </v-btn>
                    </div>
                    
                </div>
            </div>
        </div>

        <div id="search-feed" v-if="!store.isDetailsPage">
            <v-text-field class="search" density="compact" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" v-model="actvFeedSearch" variant="solo-filled">
                <template v-slot:append-inner>
                    <v-icon icon="mdi-close" v-if="actvFeedSearch.length ? (true, store.isSearch = true) : (false, store.isSearch = false)" @click="clearContent"></v-icon>
                </template>
            </v-text-field>
        </div>
        <div id="retsURL" v-if="isShowRetsUrl && !store.isDetailsPage" @click="isShowRetsUrl = false; restoreFilters();">
            <v-banner icon="mdi-restore" text="Shared URL bypasses filters. Click to restore." id="retsURLBanner">
                <!-- <template v-slot:prepend>
                    <icon icon="mdi-restore"></icon>
                </template> -->
            </v-banner>
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

    <v-card id="countPopup" v-if="countPopupStatus">
        <span>
            &nbsp;&nbsp;
            <span :style="{ color: notStartedColor, width: '5ch', display: 'inline-block', textAlign: 'left', fontWeight: 'bold'  }">{{ retsNotStartedCount }}</span>
            <span :style="{ color: 'lightgray'}">&nbsp;&nbsp; Not Started</span><br>
            
            &nbsp;&nbsp;
            <span :style="{ color: inProgressColor, width: '5ch', display: 'inline-block', textAlign: 'left', fontWeight: 'bold'  }">{{ retsInProgressCount }}</span>
            <span :style="{ color: 'lightgray' }">&nbsp;&nbsp; In Progress</span><br>
           
            &nbsp;&nbsp;
            <span :style="{ color: completeColor, width: '5ch', display: 'inline-block', textAlign: 'left', fontWeight: 'bold'  }">{{ retsCompleteCount }}</span>
            <span :style="{ color: 'lightgray' }">&nbsp;&nbsp; Complete</span><br>
            
            &nbsp;&nbsp;
            <span :style="{ color: onHoldColor, width: '5ch', display: 'inline-block', textAlign: 'left', fontWeight: 'bold'  }">{{ retsOnHoldCount }}</span>
            <span :style="{ color: 'lightgray' }">&nbsp;&nbsp; On Hold</span><br>
           
        </span>
    </v-card>
        <!-- </div> -->
</template>

<script>
import {clickRetsPoint, getQueryLayer, getHighlightGraphic, removeHighlight, createtool, changeCursor, outlineFeedCards, openDetails, doubleClickRetsPoint, filterMapActivityFeed, zoomTo, queryExtent} from './utility.js'
import {appConstants} from '../common/constant.js'
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import {store} from './store.js'
import {view, retsGraphicLayer, sketchWidgetcreate, createretssym } from './map-Init.js'
import {addRETSPT} from '../components/crud.js'

import { defineAsyncComponent } from 'vue'

export default{
    name: "RetsFeed",
    components: {RetsDetailPage: defineAsyncComponent(()=>import('./RetsDetail.vue')),
                 Filter: defineAsyncComponent(()=>import('./RetsFilter.vue')),
                 RetsCards: defineAsyncComponent(()=> import('./retsCards.vue'))
                }, 
    props:{
        retsparam: String
    },
    data(){
        return{
            countHeaderColor: "gray",
            countPopupStatus: false,
            notStartedColor: appConstants.CardColorMap[1],
            onHoldColor: appConstants.CardColorMap[4],
            inProgressColor: appConstants.CardColorMap[2],
            completeColor: appConstants.CardColorMap[3],
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
            disabledAddRd: false,
            flagColor: "",
            timer: "",
            currentValues: "",
            send: null,
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
            isShowRetsUrl: false,
            isShowSelected: false,
            isSwitchDisabled: false,
            searchTimer: null
        }
    },
    beforeMount(){
        clickRetsPoint(),
        doubleClickRetsPoint()

    },
    mounted(){
        if(this.retsparam){
            this.isRetsParamOpen(this.retsparam)
            this.isShowRetsUrl = true
        }
        
        reactiveUtils.on(() => view.popup, "trigger-action",
            async (event) => {
                if (event.action.id === "open-details") {
                    removeHighlight("a", true)
                    await getHighlightGraphic()
                    const graphicOid = store.clickedGraphic
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
        store.retspointlength = store.updateRetsSearch.length
    },
    methods:{
        async restoreFilters(){
            store.defaultFilterSetup()
            filterMapActivityFeed(store.filter)
            localStorage.removeItem("retsParam")
            store.activityBanner = "Activity Feed"
            await store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
            removeHighlight("", true)
            history.replaceState(null, '', `${window.location.origin}${window.location.pathname}`)
            return
        },
        async isRetsParamOpen(retsParam){
            retsParam = Number(retsParam)
            let returnRets = store.roadObj.find(rets => rets.attributes.RETS_ID === retsParam)
            // let returnRets = await store.returnRetsNonFeed(retsParam)
            if(!returnRets){
               
                store.alertTextInfo = {"text": `Rets not found try again.`, "color": "red", "type":"error", "toggle": true}
                store.alertObject.push(store.alertTextInfo)
                store.isAlert = true
                return
            }
            zoomTo(returnRets.geometry)
            .then((c) => {
                openDetails(returnRets)
            })
            .catch(err => console.log(err))
            return
        },
        retsSubtitleUpdate(){
            store.checkDetailsForComplete()
            return  
        },
        async clearContent(){
            store.isSearch = false
            this.actvFeedSearch = ""
            return
        },
        async processAddPt(newPointGraphic){
            try{
                this.isSpinner = true
                this.Spinneractive = false
                store.isCard = false
                const obj = await addRETSPT(newPointGraphic, "rets")
                const objectid = obj.addFeatureResults[0].objectId
                await this.addretss(objectid)
                this.isSpinner = false
                this.Spinneractive = true
                store.activityBanner = objectid
                store.isDetailsPage = true
                store.toggleFeed = 2
                store.isNewRets = true
                return
            }
            catch(err){
                console.log(err)
            }
            //handleaddrets(newPointGraphic, this.addrets);
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
                    store.unsavedChanges = true
                    issue++
                    return
                }
            }
            issue === 0 ? openDetails({attributes: this.stageData.attributes, geometry: [this.stageData.geometry.x, this.stageData.geometry.y]}, 1) : null
        },

        async addretss(objectid){
            const querystring = {"whereString":`OBJECTID = ${objectid}`, "queryLayer": "retsLayer"}
            try{
                const querypromise = await getQueryLayer(querystring, "PRIO, CREATE_DT DESC")
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
                            feat.attributes.NO_RTE = store.retsObj.attributes.NO_RTE
                            const addNewRetsPt = {attributes:feat.attributes, geometry:[feat.geometry.x,feat.geometry.y]}
                            openDetails(addNewRetsPt)
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
            return
        },
        dragover(){
            document.getElementById("dragndrop").style.color = "green"
            return
        },
        dragLeave(){
            document.getElementById("dragndrop").style.color = "white"
            return
        },
        changeNumFilter(filter){
            if(filter === 'cancel'){
                this.isfilter = false;
                return
            }
            store.retsFilters = filter
            this.isfilter = false
            store.setFilterFeed()
            return
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
          
            changeCursor("default")
            store.isMoveRetsPt = false
            sketchWidgetcreate.cancel();
            store.isAdd = false
            this.isCreateEnabled = !this.isCreateEnabled;
            this.addbtntext = "New"
            this.buttonIcon = "mdi-plus"
            return
        },

        async updateSelection(e){
            if(!e){
                store.activityBanner = "Activity Feed"
                store.autozoomextent ? await queryExtent() : await store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
                store.updateRetsSearch = store.roadObj.sort((a,b) => new Date(b.EDIT_DT) - new Date(a.EDIT_DT))
                // console.log(store.updateRetsSearch)
                // outlineFeedCards(store.roadHighlightObj)
                // if (store.autozoomextent){
                //     queryExtent()
                //     return
                // }
                // store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")

                return
            }
            store.updateRetsSearch = [...store.roadHighlightObj]
            return
        },
    },
    watch:{
        actvFeedSearch:{
            handler: async function(a){
                try{

                    if(this.searchTimer){
                        clearTimeout(this.searchTimer)
                    }
                    this.searchTimer = setTimeout(async () => {
                        if(!a.length || !a){
                            store.updateRetsSearch = !store.isShowSelected ? store.roadObj.slice().sort((a,b) => b.EDIT_DT - a.EDIT_DT) : store.roadHighlightObj
                            outlineFeedCards(store.roadHighlightObj)
                            return
                        }
                        const searchString = a.toLowerCase()
                        let s;

                        //search for history items
                        //apply it card metadata
                        let returnHist = await getQueryLayer({"whereString": `Lower(CMNT) like '%${searchString}%' and SYS_GEN = 0`, "queryLayer": "retsHistory"}, "CREATE_DT DESC")
                        
                        const acceptedObj = []
                        for(s of !store.isShowSelected ? store.roadObj : store.roadHighlightObj){
                            s.attributes.Hist = returnHist.features.find(hist => hist.attributes.RETS_ID === s.attributes.RETS_ID)?.attributes?.CMNT ?? ""
                            // const createObjKey = Object.values(s.attributes)
                            for(const [key, value] of Object.entries(s.attributes)){
                                if(key === "RETS_ID" || key === "RETS_NM" || key === "DESC_" || key === "RTE_NM" || key === "ACTV" || key === "ACTV_NBR" || key === "Hist"){
                                    if(String(value).toLowerCase().includes(searchString) && (acceptedObj.findIndex(oid => oid.attributes.OBJECTID === s.attributes.OBJECTID) === -1)){
                                        // if(acceptedObj.length === 10){
                                        //     store.updateRetsSearch = acceptedObj.sort((a,b) => b.EDIT_DT - a.EDIT_DT)
                                        //     return
                                        // }
                                        acceptedObj.push(s)
                                    }
                                }
                            } 
                        }
                        store.updateRetsSearch = acceptedObj.sort((a,b) => b.EDIT_DT - a.EDIT_DT)
                    },600)
                }
                catch(a){
                    console.log("err", a)
                }
            },
            immediate: true
        },

        'store.retsObj.attributes.RETS_NM':{
            handler: function(b){
                if(!b){
                    document.querySelector(".rets-subtitle-text-active")?.classList?.remove()
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
        'store.clickevent': {
            handler: function() {
                if (!store.isSaveBtnDisable && store.isDetailsPage && store.layerName != "TxDOT Roadways" && store.clickevent.button === 0){
                    store.cancelpopup = true
                    return
                }
            },
            immediate: true // Runs the watcher immediately upon creation
        },
    },
    computed:{
        retsInProgressCount(){
            return store.updateRetsSearch.filter(item => item.attributes.STAT === 2).length;
        },
        retsNotStartedCount(){
            return store.updateRetsSearch.filter(item => item.attributes.STAT === 1).length;
        },
        retsOnHoldCount(){
            return store.updateRetsSearch.filter(item => item.attributes.STAT === 4).length;
        },
        retsCompleteCount(){
            return store.updateRetsSearch.filter(item => item.attributes.STAT === 3).length;
        },
    },
        

}
</script>

<style scoped>
    #card-container{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
        width: 450px;
        height: 100vh;
        background-color: black;
        position: absolute;
        left: 38px;
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
        color: #7F7F7F !important;
        font-weight: bold;
        padding-left: 10px;
        font-style: italic;
    }
    .rets-subtitle-text-active :deep(input){
        color: #4472C4 !important;
        font-style: normal !important;
        padding-left: 10px;
        font-weight: bold;
    }
    #retSubText{
        position: relative;
        right: 15px;
        padding: 0px;
        margin-left: -20px;
        max-width: 310px;
        min-width: 20px;
        bottom: 12px
    }
    .attachCard{
        position: relative; 
        width: 20%; 
        top: 35%; 
        left: 50%; 
        height: 45% !important;
        width: 25% !important;
    }

    .feed-banner{
        font-size: 20px;
        min-height: 39px !important;
        max-height: 39px !important;
        position: relative;
        bottom: 9px;
        width: 100%;
        background-color: #212121;
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
        transform: translateX(50);
        opacity: 1;
    }

    .card-feed-div{
        bottom: 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        gap: 5px;
        padding-top: 5px !important;
    }

    #container-header{
        position: relative;
        top: 4px;
        font-size: 20px;
        font-weight: bold; 
        padding-left: 9px;
    }
    #activity-header{
        position: relative;
        top: 0px;
        width: 100%;
        font-weight: normal !important;
    }
    .banner-btn{
        position: relative;
    }
    .retsSubtitleTxt{
        position: relative;
        font-size: 20px; 
    }
    .add-new-btn{
        position: absolute;
        right: 1rem;
        top: 7px;
        text-align: center;
    }
    .text-btn{
        font-size: 13px;
    }

    #search-feed{
        position: relative;
        height: 28px !important;
        width: 100%;
        bottom: 23px;
        border-radius: 0px;
        padding: 0px 0px 0px 0px;
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
        bottom: 0px;
        right: 0px;
        font-size: 7px;
        height: 100%;
        min-width: 50% !important;
        border: 2px solid hotpink;
    }

    #subtitleCard{
        position:relative;
        top: 1px;
        right: 3px;
        max-width: 34ch;
    }
    #headerCount{
        position: relative;
        flex: auto;
        padding-left: 5px;
        font-size: 15px;
        cursor: default;
        white-space: nowrap;
        font-weight: normal;
    }
    #countPopup{
        position: absolute;
        height: 100px;
        width: 160px;
        left: 220px;
        top: 40px;
        background-color: rgba(18, 18, 18, 255);
        opacity: .95;
    }
    :deep(.v-switch__thumb){
        height: 16px !important;
        width: 16px !important;
    }
    :deep(.v-switch__track){
        height: 10px !important;
    }
    #retsURL{
        position: relative;
        width: 100%;
        margin-top: 0px;
        bottom: 15px !important;
    }
    #retsURL:hover{
        cursor: pointer;
    }
    #retsURLBanner{
        background-color: #B35512;
        border-left-style: solid;
        border-left-width: 5px;
        border-left-color: white;
        padding: 5px;
        font-size: 15px;
        width: 100% !important;
    }
    :deep(.v-banner-text){
        font-size: 15px !important;
        padding-inline-end: 7px !important; 
    }
</style>