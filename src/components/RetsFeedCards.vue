<template>
    <v-container id="container">
        <v-col class="d-flex flex-wrap ga-2" align-self="start">
            <v-row class="main-color">
                <div id="activity-header">
                    <div id="container-header">
                        <header>RETS Dashboard</header>
                    </div>
                    <div class="add-new-btn">
                        <div style="float:right;">
                            <v-btn v-for="(tool, i) in addbutton" :key="i" :value="tool" @click="tool.action()" :prepend-icon="buttonIcon" color="#4472C4" rounded="0" id="add-new-btn"  class="main-button" v-if="!store.isDetailsPage" >
                            <!-- @click="handlecreate"> -->
                            <p class="text-btn" id = "addbtn">{{addbtntext}}</p>
                            </v-btn>
                        </div>

                    </div>
                </div>
               

            </v-row>
            <v-row id="feed-row">
                <v-banner id="feed-banner" lines="two" density="default" min-width="0%">
                    <div style="width: 100%;">
                        <div class="banner-txt">
                            <p>{{store.activityBanner}}</p>
                            <div class="retsSubtitle">
                                <div id="retSubText">
                                    <v-text-field variant="plain" v-if="store.isDetailsPage" :disabled="isSubtitle" placeholder="Enter a subtitle" style="position:relative; top: 1px;" class="rets-subtitle-text"></v-text-field>
                                </div>
                            </div>
                            
                            <v-btn v-if="store.isDetailsPage" icon="mdi-pencil-outline" density="compact" flat id="renameRets" @click="displaySubtitle($event)"></v-btn>
                        </div>

                        <div v-if="!store.isDetailsPage" style="position: relative; top: .1rem">


                          

                                <div>
                                    <v-btn class="banner-btn" @click="store.isfilter = !store.isfilter" density="compact" variant="flat" flat min-width="30">
                                        <v-badge color="#4472C4" :content="store.filterTotal">
                                            <v-icon size="x-large">mdi-filter</v-icon>
                                        </v-badge>
                                    </v-btn>
                                </div>
     
                             
                                <!-- <v-btn icon="mdi-filter" class="banner-btn" flat @click="store.isfilter = !store.isfilter"></v-btn>
                                <div class="filter-notification-bubble" v-if="store.filterTotal > 0">
                                    <p style="font-size: 13.5px; position: relative; left: 25%; bottom: 1.3px;"><b>{{ store.filterTotal}}</b></p>
                                </div> -->
                            
      
                                <div class="switch">
                                    <v-tooltip text="Show Selected Cards" location="top">
                                        <template v-slot:activator="{props}">
                                            <v-switch flat v-model="store.isShowSelected" density="compact" @update:modelValue="updateSelection(store.isShowSelected)" v-bind="props" color="primary" :disabled="!store.roadHighlightObj.size"></v-switch>
                                        </template>
                                    </v-tooltip>
                                        
                                </div>
            
                        </div>
                    </div>
                </v-banner>
            </v-row>
            <v-row id="search-feed" v-if="!store.isDetailsPage">
                <v-text-field density="compact" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" v-model="actvFeedSearch" variant="plain"></v-text-field>
            </v-row>
            
            <div class="card-feed-div" v-if="store.isCard">
                
                    <v-row v-for="(rd, road) in !store.isShowSelected ? store.roadObj : store.roadHighlightObj" :key="rd.attributes.OBJECTID" :value="road" :id="rd.attributes.OBJECTID" class="rets-card-row"> 
                        <v-btn elevation="0" @click="changeColor(rd.attributes.RETS_ID);" class="flag-btn" size="small" max-width=".5px" density="compact" variant="plain" slim>
                            <template v-slot:prepend>
                                <v-icon size="medium" :id="`${rd.attributes.RETS_ID}Icon`" :color="rd.attributes.flagColor.FLAG" :icon="rd.attributes.flagColor.FLAG ? changeFlagIcon(rd.attributes.flagColor.FLAG) : 'mdi-flag-outline'"></v-icon>
                            </template>
                        </v-btn>
                        <v-col class="color-picker" v-if="flagClickedId === rd.attributes.RETS_ID" v-click-outside="closeFlagDiv">
                            <v-icon size="medium" v-for="i in 7" :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])" ></v-icon>
                        </v-col>
                        <v-card :id="String(rd.attributes.RETS_ID).concat('-',rd.attributes.OBJECTID)" :style="{borderLeft: `7px solid ${colorTable[rd.attributes.STAT] ? colorTable[rd.attributes.STAT]: 'Red'}`}" hover v-ripple :class="!store.isShowSelected ? 'card' : 'card highlight-card'" @click="zoomToRetsPt(rd)" @dblclick="double(rd, road);">
                            <v-card-text id="retsCard">
                                RETS {{rd.attributes.RETS_ID }}
                            </v-card-text>

                            <v-card-text class="route-name">
                                {{ rd.attributes.RTE_NM ?? "Route name not provided" }}
                            </v-card-text>

                            <div style="position: relative; bottom: 7px; width: 100%;">
                                <p class="text-concat">
                                    {{ rd.attributes.DESC_ ? rd.attributes.DESC_ : "If description is empty does it need to be worked ?" }}
                                </p>
                            </div>
                            <div style="position: relative; top: 2%; height: 40px;">
                                <div>
                                    <div style="position: relative; float: right; padding-top: 0px; top:0px; left: 0px;">
                                        <v-tooltip v-for="i in alertIcons" :text="i.popup" location="top">
                                            <template v-slot:activator="{props}" v-if="returnSand(i.icon, rd.attributes)"> 
                                                <v-icon :icon="i.icon" class="cardPRIO" :color="checkColor(i.icon, rd.attributes)" v-bind="props"></v-icon>
                                            </template>
                                        </v-tooltip>
                                    </div>
                                    <div style="height:17px; position: absolute; bottom: 0px; width:fit-content;">
                                    <v-card-subtitle class="subtitle-text">
                                        Created by {{ rd.attributes.CREATE_NM ? returnUserName(rd.attributes.CREATE_NM) : "If Create Name is empty is it really created" }} {{ rd.attributes.CREATE_DT ? returnDateFormat(rd.attributes.CREATE_DT) : returnDateFormat(rd.attributes.EDIT_DT)}}
                                    </v-card-subtitle>
                                    </div>
                                </div>
                            </div>
                            
                        </v-card>
                    </v-row>
                
            </div>
            
            <div class="card-feed-div" v-if="store.isNoRets"><p>No RETS for you!</p></div>
        </v-col>
        <RetsDetailPage v-if="store.isDetailsPage"/>
    </v-container>
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
    <v-container id="Spinner" v-if="isSpinner" >
        <v-progress-circular color="blue" indeterminate size="60" ></v-progress-circular>
    </v-container>
</template>

<script>
import {clickRetsPoint, zoomTo, getQueryLayer, searchCards, highlightRETSPoint, toggleRelatedRets, getHighlightGraphic, removeHighlight, removeAllCardHighlight, createtool, returnHistory, toggleHighlightCards} from './utility.js'
import {appConstants} from '../common/constant.js'
import Filter from './RetsFilter.vue'
import RetsDetailPage from './RetsDetail.vue'
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import {store} from './store.js'
import {view, retsGraphicLayer} from './map-Init.js'
import { sketchWidgetcreate, createretssym } from './map-Init.js'
import {addRETSPT, postFlagColor} from '../components/crud.js'


export default{
    name: "RetsCards",
    components: {Filter, RetsDetailPage},
    props: {
        filterPros: Object,
        // addrets:Number
        // addrets:Number
    },
    components: {RetsDetailPage, Filter}, 
    data(){
        return{
            Spinneractive: false,
            isSpinner: false,
            buttonIcon: 'mdi-plus',
            addbtntext: "New",
            addrets: null,
            filterOptions: appConstants.RetsStatus,
            colorTable: appConstants.CardColorMap,
            currRoad: {},
            isColorPicked: false,
            pickColor: "blue",
            swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#008000', '#4472C4', '#B75CFF', '#FFFFFF'],
            flagClickedId: "",
            flagColor: "",
            timer: "",
            currentValues: "",
            send: null,
            activityBanner: "Activity Feed",
            isSubtitle: false,
            isRetsActivated: true,
            retsSubtitle:"",
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
            isCreateEnabled: true,
            addbutton: [
                {title:"New", action: async () =>{
                                const graphicAdd = await this.handlecreate();
                                if (graphicAdd){
                                    this.processAddPt(graphicAdd)
                                }
                                
                }}
                          
            ],
            alertIcons:[
                {icon: "mdi-account-multiple-check", popup: "Assigned to you", color: "white", display: "ASSIGNED_TO", condition: `${store.loggedInUser}`, displaySup: "GIS_ANALYST", supplementCondition: `${store.loggedInUser}`},
                {icon:"mdi-account-group", popup: "MO/TxDOT Connect", color: "white", display: "ACTV", condition: "TxDOTConnect"}, //ACTV === (Minute Order || TxDOTConnect)
                // {icon:"mdi-account-group", popup: "MO/TxDOT Connect", color: "white", display: "ACTV", condition: "Minute Order"},
                {icon:"mdi-pencil-box-outline", popup: "District Request", color: "white", display: "ACTV", condition: "Request"}, //keep null
                {icon:"mdi-alarm", popup: "Deadline set (with date)", color: "white", display: "DEADLINE", condition: null}, //past the deadline set
                {icon:"mdi-check-decagram-outline", popup: "Job Complete", color: "green", display: "STAT", condition: 3},
                {icon: "mdi-timer-sand", popup: "No activity for (# days)", color: "white", display: "STAT", condition: 2, determineDate: (x)=>{returnSand(x)}}, //Only for in progress rets; edit_dt >= 5 weeks
                {icon: "mdi-exclamation", popup:"Priority Job", color:"red", display: "PRIO", condition: 0}                
            ],
            isShowSelected: false,
            isSwitchDisabled: false
        }
    },
    beforeMount(){
        this.queryLayer
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
                    const returnGraphic = retsGraphicLayer.graphics.items.find(ret => ret.attributes.OBJECTID === graphicOid)
                    returnGraphic.attributes.flagColor = store.setFlagColor(returnGraphic.attributes)
                    this.stageData = {attributes: returnGraphic.attributes, geometry: [returnGraphic.geometry.x, returnGraphic.geometry.y]}
                    this.checkChanges()
                }
        });
        this.retsFilters.loggedInUser = store.loggedInUser
        this.retsFilters[appConstants.queryField[appConstants.userRoles.find(x => x.value === store.loggedInUser).type]] = appConstants.defaultUserValue
    },
    methods:{
        checkColor(icon, atts){
            if(icon === 'mdi-alarm' || icon === 'mdi-exclamation' || icon === 'mdi-check-decagram-outline'){
                const deadlineDate = new Date(atts.DEADLINE)
                const todaysDate = new Date()
                const oneDay = 24*60*60*1000;
                const calcTime = deadlineDate.getTime() - todaysDate.getTime()
                const pastDeadline = Math.round(calcTime/oneDay)
                if(atts.DEADLINE && pastDeadline < 0 || icon === 'mdi-exclamation'){
                    return "red"
                }
                if(icon === 'mdi-check-decagram-outline'){
                    return 'green'
                }
                return "white"
            }
            return "white"
        },
        returnSand(icon, atts){
            
            const notiIcons = {
                'mdi-account-multiple-check' : () => {
                    if(atts.ASSIGNED_TO === store.loggedInUser){
                        return true
                    }
                    return false
                },
                'mdi-account-group': () => {
                    if(atts.ACTV === "TxDOTConnect" || atts.ACTV === 'Minute Order'){
                        return true
                    }
                    return false
                },
                'mdi-pencil-box-outline': () =>{
                    if(atts.ACTV === "Request"){
                        return true
                    }
                    return false
                },
                'mdi-alarm' :()=>{
                    
                    
                    if(atts.DEADLINE){
                        return true
                    }
                    return false
                },
                'mdi-check-decagram-outline' : ()=>{
                    if(atts.STAT === 3){
                        return true
                    }
                    return false
                },
                'mdi-timer-sand': ()=>{
                    const editDt = new Date(atts.EDIT_DT)
                    const todayDate = new Date()
                    const oneDay = 24*60*60*1000;
                    const calcTime = todayDate.getTime() - editDt.getTime()
                    const calcDate = Math.round(calcTime/oneDay)
                    if(atts.STAT === 2 && calcDate > 25){
                        return true
                    }
                    return false
                },
                'mdi-exclamation': () =>{
                    if(atts.PRIO === 0){
                        return true
                    }
                    return false
                }
            }
            return notiIcons[icon]()
            //return true
        },
        async processAddPt(newPointGraphic){
            try{
                this.isSpinner = true
                this.Spinneractive = false
                store.isCard = false
                const obj = await addRETSPT(newPointGraphic, "rets")
                const objectid = obj.addFeatureResults[0].objectId
                this.addrets = objectid
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
        displaySubtitle(e){ 
            this.isSubtitle = !this.isSubtitle
        },
        checkChanges(){
            const beforeAtt = JSON.parse(store.currentInfo)
            const afterAtt = JSON.parse(JSON.stringify(store.retsObj))
            let issue = 0
            for(const [key, value] of Object.entries(beforeAtt.attributes)){
                if(key==='RELATED_RETS'){
                    continue
                }
                if(value !== afterAtt.attributes[key]){
                    this.unsavedChanges = true
                    issue++
                    return
                }
            }

            issue === 0 ? this.double({attributes: this.stageData.attributes, geometry: [this.stageData.geometry.x, this.stageData.geometry.y]}, 1) : null
        },
        // processBanner(i){
        //     console.log(i)
        // },
        // async enableFeed(e){
        //     turnAllVisibleGraphicsOff() 
        //     console.log(store.roadHighlightObj)
        //     if(e[0].attributes.isDelete){
        //         e[0].attributes.index ? store.roadObj.splice(e[0].attributes.index, 1) : this.removeUndefinedIndex(e[0].attributes)
        //         this.activityBanner = "Activity Feed"
        //         this.isDetailsPage = e[1]
        //         await this.setActivityFeed
        //         return
        //     }
        //     console.log(store.archiveRetsData)
        //     this.isDetailsPage = e[1]
        //     this.activityBanner = "Activity Feed"
        //     return
        // },

        // highlightToggleAndProcess(){
        //     console.log('not done')
        //     return
        // },
        removeUndefinedIndex(delRd){
            const findRoad = store.roadObj.findIndex(road => road.attributes.OBJECTID === delRd.OBJECTID)
            store.roadObj.splice(findRoad, 1)
        },
        double(road, index){
            store.archiveRetsDataString = JSON.stringify(road)
            store.historyRetsId = road.attributes.RETS_ID
            returnHistory(`RETS_ID = ${road.attributes.RETS_ID}`)
            road.attributes.logInUser = this.loggedInUser 
            road.attributes.index = index
            store.retsObj = road
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
        async addretss(){
            const querystring = {"whereString":`OBJECTID = ${this.addrets}`, "queryLayer": "retsLayer"}
            try{const querypromise = await getQueryLayer(querystring, "PRIO, CREATE_DT DESC")
                if (querypromise.features.length){
                    querypromise.features.forEach(
                        (feat)=> {
                            feat.attributes.flagColor = {flagColor: '', OBJECTID: ''}
                            const addNewRetsPt = {attributes:feat.attributes,geometry:[feat.geometry.x,feat.geometry.y]}
                            store.addRetsID(addNewRetsPt)
                            this.double(addNewRetsPt)
                        }
                    )
                }

            }
            catch(error){
                console.log(error)
            }
        }
        ,
        zoomToRetsPt(rets){
            //removeAllCardHighlight()
            clearTimeout(this.timer)
            this.timer = ""
            this.timer = setTimeout(()=>{
                const zoomToRETS = rets.geometry
                highlightRETSPoint(rets.attributes)
                zoomTo(zoomToRETS)
            },250)
        },

        returnDateFormat(e){
            //10/29/2023 09:11am
            const date = new Date(e)
            return `${date.toLocaleString('en-US')}`
        },
        changeColor(id){
            this.flagClickedId = ""
            this.flagClickedId = id
            this.isColorPicked = true;
        },
        assignColorToFlag(clr){
            document.getElementById(`${this.flagClickedId}Icon`).style.color = clr
            const rets = store.roadObj.find(rd => rd.attributes.RETS_ID === this.flagClickedId)
            rets.attributes.flagColor.FLAG = clr
            postFlagColor(rets)
            this.isColorPicked = false;
            this.closeFlagDiv()
        },
        closeFlagDiv(){
            this.flagClickedId = ""
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
        dropAttachment(event){
            console.log(event)
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
            if (this.isCreateEnabled === true) {
                this.addbtntext = "Cancel"
                this.buttonIcon = null
                this.isCreateEnabled = !this.isCreateEnabled;
                //console.log("true")
                const newPointGraphic = await createtool(sketchWidgetcreate, createretssym);
                // Process the newPointGraphic as needed
                this.isCreateEnabled = !this.isCreateEnabled;
                this.addbtntext = "New"  
                this.buttonIcon = "mdi-plus"
                return newPointGraphic
                            
                } 
            else {
                sketchWidgetcreate.cancel();
                this.isCreateEnabled = !this.isCreateEnabled;
                this.addbtntext = "New"
                this.buttonIcon = "mdi-plus"
                //console.log("false")
                }
        },
        returnUserName(n){
            if(!n) {
                return "My name is Null"
            }
            const usernameRow = appConstants.userRoles.find(name => name.value === n)
            return usernameRow?.name ?? 'My name is not in the RESP table :('
        },
        updateSelection(e){
            toggleHighlightCards(e)
        },

        determineVisibility(id){
            if(!store.isShowSelected) return
            const display = store.roadHighlightObj.includes(id) ? "display: flex" : "display: none"
            return display
        }

    },
    watch:{
        actvFeedSearch:{
            handler: function(){
                if(this.actvFeedSearch.length){
                    searchCards(store.roadObj, this.actvFeedSearch, {param: "OBJECTID", type: "sortA", isFilters: false})
                    return
                }
                const getHideLength = document.getElementsByClassName("hideCards")
                if(getHideLength.length){
                    for(let i=0; i < getHideLength.length; i++ ){
                        document.getElementById(getHideLength[i].id).classList.remove('hideCards')
                    }   
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
        retsSubtitle:{
            handler:function(word){
                if(word.length<0) return
                setTimeout(()=>{
                   // this.filterPros.attributes.RTE_NM = word
                },1000)
            }
        },
        addrets:{
            handler: async function(){
                await this.addretss()
            },
            immediate: true
        },
        // 'store.roadHighlightObj.size':{
        //     handler: function(){
        //         console.log(store.roadHighlightObj.size)
        //         if(store.roadHighlightObj.size > 0){
        //             this.isSwitchDisabled = false
        //             return
        //         }
        //         this.isSwitchDisabled = true
        //         return
        //     },
        //     once: true
        // }
        //},
        // 'store.roadHighlightObj.size':{
        //     handler: function(){
        //         console.log(store.roadHighlightObj.size)
        //         if(store.roadHighlightObj.size > 0){
        //             this.isSwitchDisabled = false
        //             return
        //         }
        //         this.isSwitchDisabled = true
        //         return
        //     },
        //     once: true
        // }
    },
    computed:{
        roadObjs : function(){
            let numIndex = 0
            let numIncrease = 2
            let totalLength = store.roadObj.length
            let road = []
            while(numIndex < totalLength){
                let a = store.roadObj.slice(numIndex, numIncrease)
                numIndex = numIncrease+=1
                numIncrease = numIncrease += 2
                a.forEach(x => road.push(x))
            }
            return road
        }    
    },
        

}
</script>

<style scoped>
#Spinner{
        position: absolute;
        top: 50%;
        left: 12.5%
    }
    #retSubText{
        position: relative;
        right: 15px;
        padding: 0px;
        margin-left: 10px;
        bottom: .4rem;
    }
    .rets-subtitle-text input{
        color: red !important;
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
        bottom: .4rem;
    }
    #retsSubtitle{
        /*  */
    }
    .attachCard{
        position: relative; 
        width: 20%; 
        top: 35%; 
        left: 50%; 
        height: 45% !important;
        width: 25% !important;
    }
    #container{
        width: 509px;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 52px;
        padding: 0px;
        display: block;
        font-size: 10px;
    }
    #feed-row{
        position: absolute;
        top: 36px;
        width:100%;
    }

    #feed-banner{
        font-size: 20px;
        height: 50px;
        padding-bottom: 5px;
        top: 10px;
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
    .rets-card-row{
        position: relative;
        bottom: 1.5rem;
        width: 104% !important;
        padding: 5px 0px 0px 10px;
        height: 120px;
        height: 120px;
    }
    .card-feed-div{
        position: relative;
        top: 9.3rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        min-height: 28vh;
        max-height: 82vh;
    }

    #container-header{
        position: relative;
        top: 50%;
        top: 50%;
        font-size: 23px;
        font-weight: bold; 
        padding-left: 20px;
        height:1.5rem;
        display: block;
    }
    .banner-btn{
        position: relative;
        bottom: 1.7rem;
        float: right;
        margin: 0% !important;
        padding: 0% !important;
        right: 15px;
    }
    .banner-txt{
        position: relative;
        bottom: 0.5px;
        font-weight: bold;
        font-size: 23px;
        left: 5px;
        display: flex;
        flex-direction: row;
        justify-items: end;
    }
    .add-new-btn{
        position: absolute;
        right: 1rem;
        top: 14px;
        top: 14px;
        text-align: center;
    }
    .text-btn{
        position: relative;
        padding-top: .2rem;
        right: .3rem;
    }

    #search-feed{
        position: absolute;
        height: 5px;
        width: 100%;
        top: 100px;
        border-radius: 0px;
        padding: 0px 10px 10px 10px;
    }

    .highlight-card{
        position: relative;

        background-color: #404040;
    }
    #test{
        display: none;

        background-color: #404040;
    }
    #test{
        display: none;
    }
    .route-card{
        position: relative;
        max-width: 50%;
    }
    .route-name{
        position: absolute;
        right: 3.8vh;
        right: 3.8vh;
        float: right;
        top: 0.5rem;
        justify-content: end;
        width: 61%;
        display: flex;
        flex-direction: row;
        padding: 0px;
        font-size: 14px;
        color:#D9D9D9;
        font-weight: bold;
        color:#D9D9D9;
        font-weight: bold;
    }
    
    .text-concat {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        font-size: 14px;
        position: relative;
        color: #a6a6a6;
    }

    .flag-btn{
        font-size: 10px;
        top: 1.6rem;
        left: 90%;
        z-index: 999;
        width: 1px !important;
        padding: 0px !important;
        opacity: 1 !important;
    }
    .color-picker{
        position: absolute;
        background-color: black;
        left: 92%;
        top: 3.4rem;
        width: 6%;
        /* top right bottom left */
        padding: 0rem 1rem 0rem .35rem;
        height: 6.7rem;
        display: flex;
        flex-direction: column;
        z-index: 9999;
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
    
    #retsCard{
        padding:0px; 
        position: relative; 
        bottom: 7px; 
        width: 80%;
        font-size: 15px;
        color: #D9D9D9;
        font-weight: bold;
        color: #D9D9D9;
        font-weight: bold;
    }
    .filter-notification-bubble{
        position: relative;
        width: 1.1rem;
        width: 1.1rem;
        background-color:#4472C4;
        height: 1.1rem;
        height: 1.1rem;
        float: right;
        bottom: 1rem;
        left: 2.5rem;
        border-radius: 50%;
    }

   .card-feed-div > .v-row{
        margin-top: 0px;
        margin-bottom: 0px;
        flex: none;
    }
    .cardPRIO{
        padding: 0px;
        margin-left: 5px;
        padding-bottom: 0px;
        font-size: 22px;
    }

    .switch{
        position: relative;
        bottom: 34px;
        right: 45px;
        float: right;
        font-size: 10px;
    }

    :deep(.v-switch--inset .v-switch__track){
        height: 20px !important;
        width: 45px !important;
    }

</style>