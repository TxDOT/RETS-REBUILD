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
                    <p id="banner-txt">{{activityBanner}}</p>
                    <template v-slot:actions>
                        <v-select single-line class="banner-btn" center-affix prepend-inner-icon="mdi-filter" :items="filterOptions" multiple flat chips>
                        </v-select>
                    </template>
                </v-banner>
            </v-row>
            <v-row id="search-feed" v-if="!isDetailsPage">
                <v-text-field label="Search..." rounded="0" prepend-inner-icon="mdi-magnify"></v-text-field>
            </v-row>

            <!-- <v-color-picker icon="mdi-flag"  hide-canvas show-swatches hide-sliders hide-inputs :swatches="swatchColor" color="black" ></v-color-picker> -->
            <div class="card-feed-div" v-if="!isDetailsPage">
                <v-row class="rets-card-row" v-for="(rd, road) in roadObj" :key="rd" :value="road">
                    <v-btn elevation="0" @click="changeColor(rd.RETS_ID);" class="flag-btn" size="small" max-width=".5px" density="compact" variant="plain" slim>
                        <template v-slot:prepend>
                            <v-icon size="medium" :id="`${rd.RETS_ID}Icon`">mdi-flag</v-icon>
                        </template>
                    </v-btn>
                    <v-col class="color-picker" v-if="flagClickedId === rd.RETS_ID" v-click-outside="closeFlagDiv">
                        <v-icon size="medium" v-for="i in 6" icon="mdi-flag" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])"></v-icon>
                    </v-col>    
                    <v-card :id="rd.RETS_ID" :title="rd.JB_TYPE" :style="{borderLeft: `7px solid ${colorTable[rd.STAT]}`}" hover v-ripple class="card" @click="zoomToRetsPt(rd.RETS_ID)" @dblclick="double(rd);">
                        <v-card-text style="padding:0px; position: relative; bottom: 7px; width: 80%;">
                            RETS {{rd.RETS_ID }}
                        </v-card-text>

                        <v-card-text class="route-name">
                            {{ rd.RTE_NM ?? null }}
                        </v-card-text>

                        <div style="position: relative; bottom: 10px; width: 80%;">
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
</template>

<script>
import {retsLayer} from './map-Init.js'
import {clickRetsPoint, zoomTo} from './utility.js'
import Query from "@arcgis/core/rest/support/Query.js";
import {appConstants} from '../common/constant.js'
import RetsDetailPage from './RetsDetail.vue'
import {getUserId} from './login.js'

export default{
    name: "RetsCards",
    components: {RetsDetailPage}, 
    data(){
        return{
            filterOptions: appConstants.RetsStatus,
            colorTable: appConstants.CardColorMap,
            roadObj: [],
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
            activityBanner: "Activity Feed"
        }
    },
    mounted(){
        this.queryLayer
        clickRetsPoint()
    },  
    methods:{
        enableFeed(e){
            this.isDetailsPage = e
            this.activityBanner = "Activity Feed"
        },
        double(road){
            this.send = road
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
            const month = date.getMonth()+1
            const day = date.getDate()
            const year = date.getFullYear()

            const hours = date.getHours()
            const minutes = new String(date.getMinutes()).padStart(2, '0')
            const ampm = hours >= 12 ? 'pm' : 'am'
            return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`
        },
        changeColor(id){
            this.flagClickedId = ""
            this.flagClickedId = id
            console.log(id)
            this.isColorPicked = true;
        },
        assignColorToFlag(clr){
            console.log(clr)
            document.getElementById(`${this.flagClickedId}Icon`).style.color = clr
            this.flagClickedId = ""
        },
        closeFlagDiv(){
            this.flagClickedId = ""
        }
    },

    computed:{
        queryLayer:{
            async get(){
                const user = await getUserId()
                const query = new Query()
                query.where = `GIS_ANALYST = '${user}'`
                query.orderByFields = ["EDIT_DT"]
                query.outFields = ["*"]
                query.returnGeometry = true
                retsLayer.queryFeatures(query)
                    .then(obj => {
                        if(obj.features.length){
                            obj.features.forEach((x) => {
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
            }
        }
    }
}
</script>

<style scoped>
    #container{
        width: 50vh;
        height: 100%;
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
    }

    .v-icon{
        position: relative;
        text-align: center;
    }
    .mdi-menu-down{
        display: none;
    }
    .rets-card-row{
        position: relative;
        top: 0rem;
        height: 150px;
        width: 100% !important;
        padding: 0px 0px 0px 10px;
        display: block !important;
        margin-top: 1px !important;
    }

    .card-feed-div{
        position: relative;
        top: 9.5rem;
        min-height: 2rem;
        max-height: 75vh;
        width: 100%;
        display:flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        scroll-behavior: smooth;
        scrollbar-width: thin;
    }
    ::-webkit-scrollbar {
        width: 10px;
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
    }
    #banner-txt{
        position: relative;
        bottom: 35.5px;
        font-weight: bold;
        font-size: 23px;
        left: 5px;
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
        top: 6rem;
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
        font-size: .8rem;
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


    /* .v-row + .v-row{
        padding-bottom: 0rem !important;
        padding-top: 0rem !important;
    } */
</style>