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
                <p id="banner-txt">Activity Feed</p>
                <template v-slot:actions>
                    <v-select single-line class="banner-btn" center-affix prepend-inner-icon="mdi-filter" :items="filterOptions" multiple flat chips>
                    </v-select>
                </template>
            </v-banner>
        </v-row>
        <v-row id="search-feed">
            <v-text-field label="Search..." rounded="0" prepend-inner-icon="mdi-magnify"></v-text-field>
        </v-row>
        <div id="card-feed-div">
            <v-row class="rets-card-row" v-for="(rd, road) in roadObj" :key="rd" :value="road">
                <v-card :id="rd.RETS_ID" :title="rd.JB_TYPE" :style="{borderLeft: `5px solid ${colorTable[rd.STAT]}`}" class="rets-card" hover v-ripple @click="zoomToRetsPt(rd.RETS_ID)">
                    <v-card-text>
                        {{ rd.DESC_}}
                    </v-card-text>
                </v-card>
            </v-row>
        </div>
       
    </v-col>
    </v-container>
</template>

<script>

import {retsLayer} from './map-Init.js'
import {clickRetsPoint, zoomTo} from './utility.js'
import Query from "@arcgis/core/rest/support/Query.js";
import {appConstants} from '../common/constant.js'
export default{
    name: "RetsCards",
    data(){
        return{
            filterOptions: appConstants.RetsStatus,
            colorTable: appConstants.CardColorMap,
            roadObj: [],
            roadFullData: []
        }
    },
    mounted(){
        this.queryLayer
        clickRetsPoint()
    },  
    methods:{
        zoomToRetsPt(retsId){
            const test = this.roadFullData.find(rts => rts.id === retsId)
            zoomTo(test.geom)
        }
    },

    computed:{
        queryLayer:{
            get(){
                const query = new Query()
                query.where = `RETS_ID < 10`
                query.outFields = ["*"]
                query.returnGeometry = true
                retsLayer.queryFeatures(query).then(obj => {
                    obj.features.forEach((x) => {
                        this.roadObj.push(x.attributes)
                        this.roadFullData.push({
                            id: x.attributes.RETS_ID,
                            geom: [x.geometry.x, x.geometry.y]
                        })
                    })
                })
            }
        }
    }
}
</script>

<style scoped>
    #container{
        width: 25%;
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
        max-height: 7rem;
        width: 100% !important;
        padding: 10px 0px 0px 10px;
        
    }
    #card-feed-div{
        position: relative;
        top: 10rem;
        min-height: 45rem;
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
    .rets-card{
        border-radius: 0%;
        width: 100%;
    }

    #container-header{
        position: relative;
        top: 25%;
        font-size: 23px;
        font-weight: bold; 
        padding-left: 20px;
        height:1.5rem;
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
</style>