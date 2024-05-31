<template>
    <div>
        <v-text-field v-if="!store.roadObj.length" disabled variant="plain" style="position: relative; left: 15px;">{{store.RetsCardStatus}}</v-text-field>
    </div>
    <div v-for="(rd, road) in store.updateRetsSearch" :key="rd.attributes.OBJECTID" :id="rd.attributes.OBJECTID" class="rets-card-row">
        <v-btn elevation="0" @click="changeColor(rd.attributes.RETS_ID);" class="flag-btn" size="small" max-width=".5px" density="compact" flat slim variant="plain">
            <template v-slot:prepend>
                <v-icon size="medium" :id="`${rd.attributes.RETS_ID}Icon`" :color="rd.attributes.flagColor.FLAG" :icon="rd.attributes.flagColor.FLAG ? changeFlagIcon(rd.attributes.flagColor.FLAG) : 'mdi-flag-outline'"></v-icon>
            </template>
        </v-btn>
        <div>
            
            <div class="color-picker" v-if="flagClickedId === rd.attributes.RETS_ID" v-click-outside="closeFlagDiv">
                <v-icon style="font-size: 13.5px;" v-for="i in 7" :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])" ></v-icon>
            </div>

            <v-card :id="String(rd.attributes.RETS_ID).concat('-',rd.attributes.OBJECTID)" :style="{borderLeft: `5px solid ${colorTable[rd.attributes.STAT] ? colorTable[rd.attributes.STAT]: 'Red'}`}" hover v-ripple :class="checkhighlight(String(rd.attributes.RETS_ID).concat('-',rd.attributes.OBJECTID))" @click="zoomToRetsPt(rd)" @dblclick="double(rd, road);">
                <!-- <div class="boundary-rets-card"> -->

                <div style="position: relative; top: 0px;">
                    <v-card-text id="retsCard">
                        RETS {{rd.attributes.RETS_ID }}
                    </v-card-text>
   

                    <v-card-text class="route-name">
                        {{ rd.attributes.RTE_NM ?? "Route name not provided" }}
                    </v-card-text>
                    <v-card-text id="retsCMNT">
                        {{ rd.attributes.RETS_NM}}
                    </v-card-text>
                </div>
                
                <div style="position: relative; bottom: 27px; width: 100%; max-height: 40px;">
                    <p class="text-concat">
                            {{ rd.attributes.DESC_ ? rd.attributes.DESC_ : "Description is empty" }}
                    </p>
                </div>
                <div class="bottomCardText">
                    <div style="position:relative; float:right; font-size: 11px; bottom: 5px;">
                        <v-tooltip text="Assigned to you" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-account-multiple-check" color="white" v-if="rd.attributes.mdiaccountmultiplecheck === true" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="MO/TxDOT Connect" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-account-group" color="white" v-if="rd.attributes.mdiaccountgroup === true" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="District Request" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-pencil-box-outline" color="white" v-if="rd.attributes.mdipencilboxoutline === true" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip :text="`Deadline set ${rd.attributes['mdialarm'].date}`" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-alarm" :color="rd.attributes['mdialarm'].color" v-if="rd.attributes['mdialarm'].bool" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Job Complete" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-check-decagram-outline" color="green" v-if="rd.attributes.mdicheckdecagramoutline === true" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip :text="`No activity for ${rd.attributes['mditimersand'].numDays} days`" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-timer-sand" color="" v-if="rd.attributes['mditimersand'].bool === true" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>

                        <v-tooltip text="Priority Job" location="top">
                            <template v-slot:activator="{props}">
                                <v-icon icon="mdi-exclamation" color="red" v-if="rd.attributes.mdiexclamation === true" class="cardPRIO" v-bind="props"></v-icon>
                            </template>
                        </v-tooltip>
                    </div>
                            
                            <!-- <div style="position: relative; float: right; padding-top: 0px; bottom: 20px; left: 5px; right: 10px; ">
                                <v-tooltip v-for="i in alertIcons" :text="i.popup" >
                                    <template v-slot:activator="{props}" v-if="rd.attributes[i.name] === true"> 
                                        <v-icon :icon="i.icon" class="cardPRIO" :color="i.color" v-bind="props"></v-icon>
                                    </template>
                                </v-tooltip>
                            </div> -->
                            <div style="height:17px; position: relative; bottom: 0px; width:fit-content;">
                                <v-card-subtitle class="subtitle-text">
                                    Created by {{ rd.attributes.CREATE_NM }} {{ rd.attributes.CREATE_DT }}
                                </v-card-subtitle>
                            </div>

                        
                    </div>  
                <!-- </div> -->
            </v-card>
        </div>
    </div>
</template>

<script>
import {postFlagColor} from '../components/crud.js'
import {zoomTo, highlightRETSPoint, toggleRelatedRets,returnHistory, removeHighlight, removeOutline, includes} from './utility.js'
import {appConstants} from '../common/constant.js'
import {store} from './store.js'
import { outlineFeedCards } from './utility.js';

export default{
    name: "RetsCards",
    data(){
        return{
            swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#008000', '#4472C4', '#B75CFF', '#FFFFFF'],
            colorTable: appConstants.CardColorMap,
            alertIcons:[
                {name: "mdiaccountmultiplecheck", icon: "mdi-account-multiple-check", popup: "Assigned to you", color: "white", display: "ASSIGNED_TO", condition: `${store.loggedInUser}`, displaySup: "GIS_ANALYST", supplementCondition: `${store.loggedInUser}`},
                {name: "mdiaccountgroup", icon:"mdi-account-group", popup: "MO/TxDOT Connect", color: "white", display: "ACTV", condition: "TxDOTConnect"}, //ACTV === (Minute Order || TxDOTConnect)
                // {icon:"mdi-account-group", popup: "MO/TxDOT Connect", color: "white", display: "ACTV", condition: "Minute Order"},
                {name: "mdipencilboxoutline", icon:"mdi-pencil-box-outline", popup: "District Request", color: "white", display: "ACTV", condition: "Request"}, //keep null
                {name: "mdialarm", icon:"mdi-alarm", popup: "Deadline set (with date)", color: "white", display: "DEADLINE", condition: null}, //past the deadline set
                {name: "mdicheckdecagramoutline", icon:"mdi-check-decagram-outline", popup: "Job Complete", color: "green", display: "STAT", condition: 3},
                {name: "mditimersand", icon: "mdi-timer-sand", popup: "No activity for (# days)", color: "white", display: "STAT", condition: 2, determineDate: (x)=>{returnSand(x)}}, //Only for in progress rets; edit_dt >= 5 weeks
                {name: "mdiexclamation", icon: "mdi-exclamation", popup:"Priority Job", color:"red", display: "PRIO", condition: 0}                
            ],
            store,
            flagClickedId: "",
            isColorPicked: true,
            roads: []
        }
    },

    beforeMount(){
        //
    },
    mounted(){
        //this.roadsNext
        this.loadData()
        //this.retsToGet
        // setTimeout(()=>{
        //     let rd;
        //     for(rd=0; rd < store.roadObj.length; rd++){
        //         store.roadObj[rd].attributes.mdiaccountmultiplecheck = store.isAssigned(store.roadObj[rd].attributes)
        //         store.roadObj[rd].attributes.mdiaccountgroup = store.isMOTxDOTConnct(store.roadObj[rd].attributes.ACTV)
        //         store.roadObj[rd].attributes.mdipencilboxoutline = store.isRequest(store.roadObj[rd].attributes.ACTV)
        //         store.roadObj[rd].attributes.mdialarm = store.isDeadline(store.roadObj[rd].attributes.DEADLINE)
        //         store.roadObj[rd].attributes.mdicheckdecagramoutline = store.isComplete(store.roadObj[rd].attributes.STAT)
        //         store.roadObj[rd].attributes.mditimersand = store.isNoActivity(store.roadObj[rd].attributes.STAT, store.roadObj[rd].attributes.EDIT_DT)
        //         store.roadObj[rd].attributes.mdiexclamation = store.isPrio(store.roadObj[rd].attributes.PRIO)
        //     }
        //     console.log("check")
        // },3000)
        store.isSaving = false
        outlineFeedCards(store.roadHighlightObj)

    },

    methods:{
        checkhighlight(retsid){
            // const elementId = retsid;
            // const element = document.getElementById(elementId);
            // console.log(element )

            // if (element) {
            //     //element.classList.toggle('highlight-card');
            //     return "card-rets highlight-card"

            // } 
            // return "card-rets"
            const elementId = retsid;
            const element = document.getElementById(elementId);

            if (store.isShowSelected === true) {
                return "card-rets highlight-card"

            } 
            if (element){
                return "card-rets highlight-card"

            }
             
            
            return "card-rets"
        },
        loadData(){
            const cards = document.querySelectorAll('.rets-card-row') 
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.classList.toggle("show", entry.isIntersecting)
                })
            })

            cards.forEach(card => observer.observe(card))
            
        },
        changeFlagIcon(color){
            if(color === '#FFFFFF'){
                return 'mdi-flag-outline'
            }
            return 'mdi-flag'
        },
        closeFlagDiv(){
            this.flagClickedId = ""
        },
        assignColorToFlag(clr){
            document.getElementById(`${this.flagClickedId}Icon`).style.color = clr
            const rets = store.updateRetsSearch.find(rd => rd.attributes.RETS_ID === this.flagClickedId)
            rets.attributes.flagColor.FLAG = clr
            postFlagColor(rets)
            this.isColorPicked = false;
            this.closeFlagDiv()
        },
        async zoomToRetsPt(rets){
            await includes(rets.attributes).then(result => {
                 var isIncluded = result
                 if (isIncluded === false){
                    removeHighlight("a", true)
                    removeOutline()
                    store.roadHighlightObj.clear()
                    const elementId = String(rets.attributes.RETS_ID).concat('-', rets.attributes.OBJECTID);
                    const element = document.getElementById(elementId);

                    if (element) {
                    element.classList.toggle('highlight-card');
                    } 
                    return
                }
            });
            clearTimeout(this.timer)
            this.timer = ""
            this.timer = setTimeout(()=>{
                const zoomToRETS = rets.geometry
                highlightRETSPoint(rets.attributes)

                zoomTo(zoomToRETS)

            },250)
        },
        double(road, index){
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
            //highlightRETSPoint(road.attributes)
            //outlineFeedCards()
            this.zoomToRetsPt(road)
            toggleRelatedRets(JSON.stringify(road))
            return
        },

        changeColor(id){
            this.flagClickedId = ""
            this.flagClickedId = id
            this.isColorPicked = true;
        },

    },
    watch:{
        'store.roadObj.length':{
            handler: function(a,b){
                this.retsToGet
            },
            immediate: true
        }
    },
    computed:{
        retsToGet: function(){
            return store.updateRetsSearch
        }
    }

}

</script>

<style scoped>
.bottomCardText{
    position: relative;
    top: 21px; 
    height: 15px;
    z-index: 9999;
}
.rets-card-row{
    position: relative;
    bottom: 1.5rem;
    right: 23px;
    width: 100% !important;
    padding: 0% 5% 5% 0%;
    height: 120px;
    opacity: 1;
    /* transform: translateX(30px);
    transition: 150ms; */
}
.rets-card-row.show{
    opacity: 1;
    /* transform: translateX(0); */
    padding: 0px;
    width: 96% !important;
}
.flag-btn{
    font-size: 10px;
    top: 1.6rem;
    left: 500px;
    z-index: 999;
    width: 1px !important;
    padding: 0px !important;
    opacity: 1 !important;
    min-width: 15px !important;
}
.color-picker{
    position: absolute;
    background-color: black;
    left: 496px;
    top: 2.7rem;
    width: 19px;
    /* top right bottom left */
    padding: 0rem 0px 0rem 0px;
    height: 6.7rem;
    display: flex;
    flex-direction: column;
    z-index: 9999;
    float: right;
}
.card-rets{
    position: relative !important;
    width: 100% !important;
    border-radius: 0% !important;
    margin: 0% !important;
    height: 115px !important;
    padding: 15px !important;
    left: 40px;
    box-sizing: border-box;
}
.highlight-card{
    background-color: #404040 !important;
}
.boundary-rets-card{
    position: relative;
    top: 0px;
}
#retsCard{
    padding:0px; 
    position: relative; 
    bottom: 7px; 
    width: fit-content;
    font-size: 15px;
    color: #D9D9D9;
    font-weight: bold;
}
#retsCMNT{
    position: relative;
    max-width: 34ch;
    overflow: hidden;
    padding: 0px 0px 0px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    color: #4472C4;
    bottom: 28px;
    left:75px;
}
.route-name{
    position: relative;
    right: 23px;
    float: right;
    bottom: 26.6px;
    justify-content: end;
    width: 45%;
    display: flex;
    flex-direction: row;
    padding: 0px;
    font-size: 14px;
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
    width: 96%;
}
.cardPRIO{
    margin-left:10px;
    font-size: 20px;
}
.v-card{
    background-color: rgba(255,0,0,0);
}
</style>