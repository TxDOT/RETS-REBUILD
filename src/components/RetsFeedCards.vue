<template>
    <v-container id="container" >
        <v-row id="feed-row">
            <v-banner id="feed-banner" lines="one" min-width="0%" text="Activity Feed">
                <template v-slot:actions>
                    <v-btn icon="mdi-plus" density="compact" size="x-large"></v-btn>
                    <v-btn icon="mdi-filter" density="compact" size="x-large"></v-btn>
                </template>
            </v-banner>
        </v-row>

        <v-col class="d-flex flex-wrap ga-2" align-self="start">
            <v-card class="rets-card" :title="rd.JB_TYPE" v-for="(rd, road) in roadObj" :key="rd" :value="road" style="border-left: 5px solid red">
                <v-card-text>
                    {{ rd.DESC_}}
                </v-card-text>
            </v-card>
        </v-col>

    </v-container>
</template>

<script>

import {retsLayer} from './map-Init.js'
import Query from "@arcgis/core/rest/support/Query.js";

export default{
    name: "RetsCards",
    data(){
        return{
            roadObj: []
        }
    },
    mounted(){
        this.queryLayer
    },  
    methods:{
        // queryLayer(){
        //     const query = new Query()
        //     query.where = `GIS_ANLST = 'David Prosack'`
        //     query.outFields = ["*"]
        //     retsLayer.queryFeatures(query).then(obj => {
        //         this.roadObj = obj.features
        //         console.log(this.roadObj)
        //         console.log(obj)
        //     })
        // }
    },

    computed:{
        queryLayer:{
            get(){
                const query = new Query()
                query.where = `GIS_ANLST = 'David Prosack' and STAT = 'Not Started'`
                query.outFields = ["*"]
                retsLayer.queryFeatures(query).then(obj => {
                    obj.features.forEach((x) => {
                        this.roadObj.push(x.attributes)
                    })
                })
            }
        }
    }
}
</script>

<style scoped>
    #container{
        width: 30%;
        height: 100%;
        background-color: black;
        position: absolute;
        left: 74px;
        padding: 0px;
        display:flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #feed-row{
        position: relative;
        top: 64.3px;
        padding: 5px 10px 5px 10px;
    }

    #feed-banner{
        font-size: 20px;
    }

    .v-icon{
        position: relative;
        text-align: center;
    }

    .rets-card{
        position: relative;
        top: 4rem;
        width: 100%;
    }
</style>