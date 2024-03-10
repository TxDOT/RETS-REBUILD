<template>
    <v-container id="container">
        <v-col class="d-flex flex-wrap ga-2" align-self="start">
            <v-row class="main-color">
                <header id="container-header">RETS Dashboard</header>
                <v-btn prepend-icon="mdi-plus" color="#4472C4" rounded="0" id="add-new-btn" class="main-button" @click="alert('This isnt hooked up.  Which add button is the one?')">
                    <p class="text-btn">New</p>
                </v-btn>
                
            </v-row>
            <v-row id="feed-row">
                <v-banner id="feed-banner" lines="two" density="default" min-width="0%">
                    <div style="width: 100%;">
                        <div class="banner-txt">
                            <p>{{activityBanner}}</p>
                            <div id="retsSubtitle"><v-text-field v-if="isSubtitle" label="Enter a subtitle" id="retsSubtitle"></v-text-field></div>
                            
                            <v-btn v-if="isDetailsPage" icon="mdi-pencil-outline" density="compact" flat id="renameRets" @click="displaySubtitle($event)"></v-btn>
                        </div>

                        <div v-if="!isDetailsPage">
                            <v-btn icon="mdi-filter" class="banner-btn" flat @click="isfilter = !isfilter"></v-btn>
                            <div class="filter-notification-bubble" v-if="retsFilters.filterTotal > 0">
                                <p style="font-size: 16.5px; position: relative; left: 21%; bottom: 1px;"><b>{{ retsFilters.filterTotal}}</b></p>
                            </div>
                        </div>
                    </div>
                </v-banner>
            </v-row>
            <v-row id="search-feed" v-if="!isDetailsPage">
                <v-text-field density="compact" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" v-model="actvFeedSearch"></v-text-field>
            </v-row>

            <div class="card-feed-div" v-if="!isDetailsPage">
                <v-row class="rets-card-row" v-for="(rd, road) in roadObj" :key="rd" :value="road" :id="rd.attributes.OBJECTID">
                    <v-btn elevation="0" @click="changeColor(rd.attributes.RETS_ID);" class="flag-btn" size="small" max-width=".5px" density="compact" variant="plain" slim>
                        <template v-slot:prepend>
                            <v-icon size="medium" :id="`${rd.attributes.RETS_ID}Icon`" :color="rd.attributes.flagColor" :icon="rd.attributes.flagColor ? changeFlagIcon(rd.attributes.flagColor) : 'mdi-flag-outline'"></v-icon>
                        </template>
                    </v-btn>
                    <v-col class="color-picker" v-if="flagClickedId === rd.attributes.RETS_ID" v-click-outside="closeFlagDiv">
                        <v-icon size="medium" v-for="i in 7" :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])" ></v-icon>
                    </v-col>    
                    <v-card :id="rd.attributes.RETS_ID-rd.attributes.OBJECTID" :style="{borderLeft: `7px solid ${colorTable[rd.attributes.STAT] ? colorTable[rd.attributes.STAT]: 'Red'}`}" hover v-ripple class="card" @click="zoomToRetsPt(rd)" @dblclick="double(rd, road);">
                        <v-card-text id="retsCard">
                            RETS {{rd.attributes.RETS_ID }}
                        </v-card-text>

                        <v-card-text class="route-name">
                            {{ rd.attributes.RTE_NM ?? "Route name not provided" }}
                        </v-card-text>

                        <div style="position: relative; bottom: 10px; width: 100%;">
                            <p class="text-concat">
                                {{ rd.attributes.DESC_ ? rd.attributes.DESC_ : "If description is empty does it need to be worked ?" }}
                            </p>
                        </div>

                        <v-card-subtitle class="subtitle-text main-color">
                            Created by {{ rd.attributes.CREATE_NM ? rd.attributes.CREATE_NM : "If Create Name is empty is it really created" }} {{ rd.attributes.CREATE_DT ? returnDateFormat(rd.attributes.CREATE_DT) : returnDateFormat(rd.attributes.EDIT_DT)}}
                        </v-card-subtitle>
                        <div>
                            <v-icon icon="mdi-exclamation" id="cardPRIO" v-if="rd.attributes.PRIO === 0"></v-icon>
                        </div>
                        
                    </v-card>
                </v-row>
            </div>
            <div class="card-feed-div" v-if="isNoRets"><p>No RETS for you!</p></div>
        </v-col>
        <RetsDetailPage v-if="isDetailsPage" :retsInfo="send" @close-detail="enableFeed"/>
    </v-container>
    <v-card v-if="uploadAttachment" class="card attachCard"> 
        <div class="cardDiv" id="dragndrop" @drop="dropAttachment($event)" @dragover="dragover()" @click="fileAttach()" @dragleave="dragLeave()">
            <v-card-title>Upload Attachment</v-card-title>
            <div>
                <v-card-text>Drag and drop attachment or click to add attachment</v-card-text>
            </div>
        </div>
    </v-card>
    <Filter v-if="isfilter" @filter-set="changeNumFilter" :filterPros="retsFilters"/>

    <v-card style="position: relative; float: center; width: 25%; left: 40%; top: 30%; margin: 15px;" color="black" v-if="unsavedChanges">
        <v-card-title>Discard unsaved changes?</v-card-title>
        <v-divider style="margin-left: 15px; margin-right: 15px; color:white;"></v-divider>
        <v-card-text>
            If you proceed your chagnes will be discarded.
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
import {clickRetsPoint, zoomTo, filterMapActivityFeed, getQueryLayer, searchCards, highlightRETSPoint, turnAllVisibleGraphicsOff, toggleRelatedRets, getHighlightGraphic, removeHighlight} from './utility.js'
import {appConstants} from '../common/constant.js'
import {getUserId} from './login.js'
import Filter from './RetsFilter.vue'
import RetsDetailPage from './RetsDetail.vue'
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import {store} from './store.js'
import {view, retsGraphicLayer} from './map-Init.js'

export default{
    name: "RetsCards",
    components: {Filter, RetsDetailPage},
    props: {
        filterPros: Object,
        addrets:Number
    },
    components: {RetsDetailPage, Filter}, 
    data(){
        return{
            filterOptions: appConstants.RetsStatus,
            colorTable: appConstants.CardColorMap,
            roadObj: [],
            currRoad: {},
            isColorPicked: false,
            pickColor: "blue",
            swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#008000', '#4472C4', '#B75CFF', '#FFFFFF'],
            flagClickedId: "",
            flagColor: "",
            timer: "",
            currentValues: "",
            isDetailsPage: false,
            isNoRets: false,
            send: null,
            activityBanner: "Activity Feed",
            isSubtitle: false,
            isRetsActivated: true,
            actvFeedSearch: "",
            flagColor: '',
            uploadAttachment: false,
            isfilter: false,
            loggedInUser: '',
            retsFilters: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "CREATE_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": appConstants.defaultUserValue, 
                         "filterTotal": 2},
            count: 0,
            store,
            stageData: 0,
            unsavedChanges: false
        }
    },
    beforeMount(){
        this.queryLayer
        clickRetsPoint()
    },
    mounted(){
        reactiveUtils.on(() => view.popup, "trigger-action",
            async (event) => {
                if (event.action.id === "open-details") {
                    removeHighlight("a", true)
                    await getHighlightGraphic()
                    const graphicOid = store.clickedGraphic
                    const returnGraphic = retsGraphicLayer.graphics.items.find(ret => ret.attributes.OBJECTID === graphicOid)
                    this.stageData = {attributes: returnGraphic.attributes, geometry: [returnGraphic.geometry.x, returnGraphic.geometry.y]}
                    this.checkChanges()
                    
                    
                }
        });
    },
    methods:{
        alert(s){
            window.alert(s)
        },
        proceed(){
            this.unsavedChanges = false
            this.double({attributes: this.stageData.attributes, geometry: [this.stageData.geometry.x, this.stageData.geometry.y]}, 1)
        },
        cancelReturn(){
            this.unsavedChanges = false
            //do nothing
        },
        displaySubtitle(e){ 
            this.isSubtitle = true
            console.log(e)
        },
        checkChanges(){
            const beforeAtt = JSON.parse(store.currentInfo)
            const afterAtt = JSON.parse(JSON.stringify(this.currRoad))
            console.log(afterAtt)
            let issue = 0
            for(const [key, value] of Object.entries(beforeAtt.attributes)){
                if(key==='RELATED_RETS'){
                    continue
                }
                if(value !== afterAtt.attributes[key]){
                    this.unsavedChanges = true
                    console.log(beforeAtt)
                    console.log(afterAtt)
                    issue++
                    return
                }
            }
            console.log("done")
            issue === 0 ? this.double({attributes: this.stageData.attributes, geometry: [this.stageData.geometry.x, this.stageData.geometry.y]}, 1) : null
        },
        processBanner(i){
            console.log(i)
        },

        async enableFeed(e){
            console.log(e)
            turnAllVisibleGraphicsOff()
            if(e.isDelete){
                this.roadObj.splice(e.index, 1)
                this.activityBanner = "Activity Feed"
                return
            }
            await this.setActivityFeed
            this.isDetailsPage = e[1]
            this.activityBanner = "Activity Feed"
            return
        },
        double(road, index){
            console.log(road)
            road.attributes.logInUser = this.loggedInUser 
            road.attributes.index = index
            this.send = this.currRoad = road
            clearTimeout(this.timer)
            this.timer=""
            this.isDetailsPage = true
            this.activityBanner = `${road.attributes.RETS_ID}`
            highlightRETSPoint(road.attributes)
            this.zoomToRetsPt(road)
            toggleRelatedRets(JSON.stringify(road))
        },
        zoomToRetsPt(rets){
            clearTimeout(this.timer)
            this.timer = ""
            this.timer = setTimeout(()=>{
                const zoomToRETS = rets.geometry
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
            this.roadObj.find(rd => rd.attributes.RETS_ID === this.flagClickedId).flagColor = clr
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
        }

    },
    watch:{
        actvFeedSearch:{
            handler: function(){
                if(this.actvFeedSearch.length){
                    searchCards(this.roadObj, this.actvFeedSearch, "OBJECTID")
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
        addrets:{
            handler: function(){

            },
            immediate: true
        }
        
    },
    computed:{
        queryLayer:{
            async get(){
                const user = await getUserId()
                this.loggedInUser = user
                this.retsFilters.loggedInUser = user
                const queryString = {"whereString": `(GIS_ANALYST = '${user}') AND (STAT = 1 OR STAT = 2)`}
                const orderField = "PRIO, CREATE_DT DESC"
                getQueryLayer(queryString, orderField)
                .then(obj => {
                    if(obj.features.length){
                        obj.features.forEach((x) => {
                            this.roadObj.push({attributes:x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                        })
                        return
                    }
                    this.isDetailsPage = false
                    this.isNoRets = true
                    })
                .catch((err)=> console.log(err))
            },
        },
        setActivityFeed:{
            async get(){
                const filter = await filterMapActivityFeed(this.retsFilters)
                this.roadObj = []
                const query = {"whereString": `${filter}`}
                const orderField = `${this.retsFilters.CREATE_DT.filter} ${this.retsFilters.CREATE_DT.sortType}`
                getQueryLayer(query, orderField)
                    .then(obj => {
                        if(obj.features.length){
                            obj.features.forEach((x) => {
                                this.roadObj.push({attributes:x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                            })
                            this.isNoRets = false
                            return
                        }
                        this.isDetailsPage = false
                        this.isNoRets = true
                        
                    })
                    .catch((err)=> {
                        console.log(err)
                    })
            }
        },

    }
}
</script>

<style scoped>
    #retsSubtitle{}
    .attachCard{
        position: relative; 
        width: 20%; 
        top: 35%; 
        left: 50%; 
        height: 45% !important;
        width: 25% !important;
    }
    #container{
        width: 50vh;
        height: 100vh;
        background-color: black;
        position: absolute;
        left: 74px;
        padding: 0px;
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
        height: 105px;
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
        top: 25%;
        font-size: 23px;
        font-weight: bold; 
        padding-left: 20px;
        height:1.5rem;
        display: block;
    }
    .banner-btn{
        position: relative;
        bottom: 2.5rem;
        float: right;
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
    #add-new-btn{
        position: absolute;
        right: 1rem;
        top: .5rem;
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
        animation: fade 2500ms ease-out forwards;
        transform: scale(1);
        background-color: rgba(9, 107, 219, 0.7);
        top: 0rem;
        width: 100%;
    }

    .route-card{
        position: relative;
        max-width: 50%;
    }
    .route-name{
        position: absolute;
        right: 3.5vh;
        float: right;
        top: 0.5rem;
        justify-content: end;
        width: 61%;
        display: flex;
        flex-direction: row;
        padding: 0px;
        font-size: 14px;
    }
    
    .text-concat {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        font-size: 14px;
        position: relative;
        top: .5rem;
    }

    .flag-btn{
        font-size: 10px;
        top: 1.6rem;
        left: 90%;
        z-index: 999;
        width: 1px !important;
        padding: 0px !important;
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
    }
    .filter-notification-bubble{
        position: relative;
        width: 1.2rem;
        background-color:#4472C4;
        height: 1.2rem;
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
    #cardPRIO{
        float: right;
        color: red;
        top: 1rem;
    }
</style>