<template>
    <v-container id="container">
        <v-col class="d-flex flex-wrap ga-2" align-self="start">
            <v-row class="main-color">
                <header id="container-header">RETS Dashboard</header>
                <v-btn prepend-icon="mdi-plus" color="#4472C4" rounded="0" id="add-new-btn" class="main-button">
                    <p class="text-btn">new</p>
                </v-btn>
                
            </v-row>
            <v-row id="feed-row">
                <v-banner id="feed-banner" lines="two" density="default" min-width="0%">
                    <div style="width: 100%;">
                        <div class="banner-txt">
                            <p>{{activityBanner}}</p>
                            <v-btn v-if="isDetailsPage" icon="mdi-pencil-outline" density="compact" flat id="renameRets"></v-btn>
                        </div>

                        <div v-if="isDetailsPage" id="detailsHeaderIcon">
                            <v-btn icon="mdi-paperclip" density="compact" flat @click="uploadAttachment = !uploadAttachment"></v-btn>
                            <v-btn density="compact" flat @click="changeColor(currRoad.RETS_ID);" id="flagBtnDetails">
                                <template v-slot:prepend>
                                    <v-icon size="25px" :id="`${currRoad.RETS_ID}Icon`" :color="currRoad.flagColor" icon="mdi-flag" style="position: relative; left: 7px; bottom: 2px"></v-icon>
                                </template>
                            </v-btn>
                            <v-col class="details-color-picker" v-if="flagClickedId === currRoad.RETS_ID" v-click-outside="closeFlagDiv">
                                <v-icon size="20px" v-for="i in 6" icon="mdi-flag" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])"></v-icon>
                            </v-col>    
                            <v-btn icon="mdi-exclamation" density="compact" flat style="color:red"></v-btn>
                        </div>

                        <div v-if="!isDetailsPage">
                            <v-btn icon="mdi-filter" class="banner-btn" flat @click="isfilter = !isfilter"></v-btn>
                            <div class="filter-notification-bubble" v-if="numFilters.filterTotal > 0">
                                <p style="font-size: 16.5px; position: relative; left: 21%; bottom: 1px;"><b>{{ numFilters.filterTotal}}</b></p>
                            </div>
                        </div>
                    </div>
                </v-banner>
            </v-row>
            <v-row id="search-feed" v-if="!isDetailsPage">
                <v-text-field density="compact" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify"></v-text-field>
            </v-row>

            <div class="card-feed-div" v-if="!isDetailsPage">
                <v-row class="rets-card-row" v-for="(rd, road) in roadObj" :key="rd" :value="road">
                    <v-btn elevation="0" @click="changeColor(rd.RETS_ID);" class="flag-btn" size="small" max-width=".5px" density="compact" variant="plain" slim>
                        <template v-slot:prepend>
                            <v-icon size="medium" :id="`${rd.RETS_ID}Icon`" :color="rd.flagColor">mdi-flag</v-icon>
                        </template>
                    </v-btn>
                    <v-col class="color-picker" v-if="flagClickedId === rd.RETS_ID" v-click-outside="closeFlagDiv">
                        <v-icon size="medium" v-for="i in 6" icon="mdi-flag" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])" ></v-icon>
                    </v-col>    
                    <v-card :id="rd.RETS_ID" :title="rd.JB_TYPE" :style="{borderLeft: `7px solid ${colorTable[rd.STAT] ? colorTable[rd.STAT]: 'Red'}`}" hover v-ripple class="card" @click="zoomToRetsPt(rd.RETS_ID)" @dblclick="double(rd);">
                        <v-card-text style="" id="retsCard">
                            RETS {{rd.RETS_ID }}
                        </v-card-text>

                        <v-card-text class="route-name">
                            {{ rd.RTE_NM ?? null }}
                        </v-card-text>

                        <div style="position: relative; bottom: 10px; width: 100%;">
                            <p class="text-concat">
                                {{ rd.DESC_ ? rd.DESC_ : "If description is empty does it need to be worked ?" }}
                            </p>
                        </div>

                        <v-card-subtitle class="subtitle-text main-color">
                            Created by {{ rd.CREATE_NM ? rd.CREATE_NM : "If Create Name is empty is it really created" }} {{ rd.CREATE_DT ? returnDateFormat(rd.CREATE_DT) : returnDateFormat(rd.EDIT_DT)}}
                        </v-card-subtitle>
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
    <Filter v-if="isfilter" @filter-set="changeNumFilter" :filterPros="numFilters"/>

</template>

<script>
import {clickRetsPoint, zoomTo, filterMapActivityFeed} from './utility.js'
import {retsLayer} from './map-Init.js'
import {appConstants} from '../common/constant.js'
import RetsDetailPage from './RetsDetail.vue'
import {getUserId} from './login.js'
import Filter from './RetsFilter.vue'
import Query from "@arcgis/core/rest/support/Query.js";

export default{
    name: "RetsCards",
    components: {RetsDetailPage, Filter},
    props: {
        filterPros: Object
    },
    data(){
        return{
            filterOptions: appConstants.RetsStatus,
            colorTable: appConstants.CardColorMap,
            roadObj: [],
            currRoad: {},
            roadFullData: [],
            isColorPicked: false,
            pickColor: "blue",
            swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#4472C4', '#008000', '#FFFFFF'],
            flagClickedId: "",
            flagColor: "",
            timer: "",
            isDetailsPage: false,
            isNoRets: false,
            send: null,
            activityBanner: "Activity Feed",
            flagColor: '',
            uploadAttachment: false,
            isfilter: false,
            loggedInUser: '',
            numFilters: {"CREATE_DT": "Date: Newest to Oldest", "JB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": appConstants.defaultUserValue, 
                         "filterTotal": 3},
            rerun: false,
        }
    },
    beforeMount(){
        this.queryLayer
        clickRetsPoint()
    },  
    methods:{
        enableFeed(e){
            this.isDetailsPage = e
            this.activityBanner = "Activity Feed"
        },
        double(road){
            console.log(road)
            road.logInUser = this.loggedInUser 
            this.send = this.currRoad = road
            clearTimeout(this.timer)
            this.timer=""
            console.log("double click")
            this.isDetailsPage = true
            this.activityBanner = `RETS ${road.RETS_ID}`
        },
        zoomToRetsPt(retsId){
            clearTimeout(this.timer)
            this.timer = ""
            this.timer = setTimeout(()=>{
                const test = this.roadFullData.find(rts => rts.id === retsId)
                zoomTo(test.geom)
                console.log("single click")
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
            console.log(id)
            this.isColorPicked = true;
        },
        assignColorToFlag(clr){
            console.log(clr)
            console.log(this.flagClickedId)
            document.getElementById(`${this.flagClickedId}Icon`).style.color = clr
            
            console.log(this.roadObj)
            this.roadObj.find(rd => rd.RETS_ID === this.flagClickedId).flagColor = clr
            this.isColorPicked = false;
            this.closeFlagDiv()
        },
        closeFlagDiv(){
            this.flagClickedId = ""
        },
        fileAttach(){
            console.log("hey")
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
            console.log(filter)
            this.numFilters = filter
            this.isfilter = false
            this.rerun = true
        },
        searchRetsCards(){
            //searchCards
            //maybe it will be best to concatentate values to a string and search via that
            //filter rets cards
            //highlight text in cards that match serach text
        },
        async querysLayer(){
            const filter = await filterMapActivityFeed(this.numFilters)
            console.log(this.numFilters)
            this.roadObj = []
                console.log('heelo')
                const query = new Query()
                console.log(filter)
                query.where = `${filter}`
                query.orderByFields = ["EDIT_DT"]
                query.outFields = ["*"]
                query.returnGeometry = true
                retsLayer.queryFeatures(query).then(obj => {
                if(obj.features.length){
                    obj.features.forEach((x) => {
                        //console.log(x)
                        this.roadObj.push(x.attributes)
                        this.roadFullData.push({
                            id: x.attributes.RETS_ID,
                            geom: [x.geometry.x, x.geometry.y]
                        })
                    })
                    this.rerun = false
                    return
                }
                this.isDetailsPage = false
                this.isNoRets = true
                })
                .catch((err)=> console.log(err))
        }
    },

    watch:{
        rerun:{
            handler: function(){
                this.querysLayer()
                console.log('toggled')
            },
            immediate: true
        }
    },
    computed:{
        queryLayer:{
            async get(){
                this.roadObj = []
                console.log('heelo')
                const user = await getUserId()
                this.loggedInUser = user
                this.numFilters.loggedInUser = user
                const query = new Query()
                query.where = `(GIS_ANALYST = '${user}') AND (STAT = 1 OR STAT = 2)`
                query.orderByFields = ["EDIT_DT"]
                query.outFields = ["*"]
                query.returnGeometry = true
                retsLayer.queryFeatures(query).then(obj => {
                if(obj.features.length){
                    obj.features.forEach((x) => {
                        //console.log(x)
                        this.roadObj.push(x.attributes)
                        this.roadFullData.push({
                            id: x.attributes.RETS_ID,
                            geom: [x.geometry.x, x.geometry.y]
                        })
                    })
                    return
                }
                this.isDetailsPage = false
                this.isNoRets = true
                })
                .catch((err)=> console.log(err))
            },
        }
    }
}
</script>

<style scoped>

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
        padding: 0px 0px 0px 10px;
        display: block !important;
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
        left: 73.5%;
        top: 0.5rem;
        width: 21%;
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
        top: 1.8rem;
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

    .details-color-picker{
        position: fixed; 
        display: flex; 
        flex-direction: column; 
        z-index: 9999; 
        width:2.3%; 
        float: right;
        margin-left: 2.2rem;
        background-color: black;
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

    #detailsHeaderIcon{
        float: right;
        position: relative;
        bottom: 3rem;
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
</style>