<template>
    <div>
        <v-text-field v-if="!store.roadObj.length" disabled variant="plain" style="position: relative; left: 15px;">{{store.RetsCardStatus}}</v-text-field>
    </div>
    <Teleport to="body">
        <div v-if="showFlagLabel" class="color-picker">
            <div style="padding: 0px !important;">
                <div style="display: flex; flex-direction: column; gap: 35px; height: 100%; justify-content: center; align-items: center;"> 
                    <v-checkbox density="compact" class="checkbox" :false-value="false" :error="!store.flagLabels.redCheckbox?.length" multiple :value="redValue" v-model="store.flagsChecked" @update:modelValue="updateCheckbox($event, 'redCheckboxError')">
                        <template v-slot:append>
                            <v-icon icon="mdi-flag" color="#FF0000" class="checkbox-flag"></v-icon>
                            <input v-model="store.flagLabels.redCheckbox" placeholder="Add label" style="border: 2px solid #FF0000;" class="checkbox-input" density="compact" @input="checkboxFlagObj()"></input>
                        </template>
                    </v-checkbox>
                    <span class="labelCheckboxError" id="redCheckboxError">Enter a valid label</span>
                    <v-checkbox density="compact" class="checkbox" :false-value="false" :error="!store.flagLabels.orangeCheckbox?.length" multiple :value="orangeValue" v-model="store.flagsChecked" @update:modelValue="updateCheckbox($event, 'orangeCheckboxError')">
                        <template v-slot:append>
                            <v-icon icon="mdi-flag" color="#FF7F00" class="checkbox-flag"></v-icon>
                            <input v-model="store.flagLabels.orangeCheckbox" placeholder="Add label" style="border: 2px solid #FF7F00;" class="checkbox-input" @input="checkboxFlagObj()"></input>
                        </template>
                    </v-checkbox>
                    <span class="labelCheckboxError" id="orangeCheckboxError">Enter a valid label</span>
                    <v-checkbox density="compact" class="checkbox" :false-value="false" :error="!store.flagLabels.yellowCheckbox?.length" multiple :value="yellowValue" v-model="store.flagsChecked" @update:modelValue="updateCheckbox($event, 'yellowCheckboxError')">
                        <template v-slot:append>
                            <v-icon icon="mdi-flag" color="#FFFF00" class="checkbox-flag"></v-icon>
                            <input v-model="store.flagLabels.yellowCheckbox" placeholder="Add label" style="border: 2px solid #FFFF00;" class="checkbox-input" @input="checkboxFlagObj()"></input>
                        </template>
                    </v-checkbox>
                    <span class="labelCheckboxError" id="yellowCheckboxError">Enter a valid label</span>
                    <v-checkbox density="compact" class="checkbox" :false-value="false" :error="!store.flagLabels.greenCheckbox?.length" multiple :value="greenValue" v-model="store.flagsChecked" @update:modelValue="updateCheckbox($event, 'greenCheckboxError')"> 
                        <template v-slot:append>
                            <v-icon icon="mdi-flag" color="#008000" class="checkbox-flag"></v-icon>
                            <input v-model="store.flagLabels.greenCheckbox" placeholder="Add label" style="border: 2px solid #008000;" class="checkbox-input" @input="checkboxFlagObj()"></input>
                        </template>
                    </v-checkbox>
                    <span class="labelCheckboxError" id="greenCheckboxError">Enter a valid label</span>
                    <v-checkbox density="compact" class="checkbox" :false-value="false" :error="!store.flagLabels.blueCheckbox?.length" multiple :value="blueValue" v-model="store.flagsChecked" @update:modelValue="updateCheckbox($event, 'blueCheckboxError')">
                        <template v-slot:append>
                            <v-icon icon="mdi-flag" color="#4472C4" class="checkbox-flag"></v-icon>
                            <input v-model="store.flagLabels.blueCheckbox" placeholder="Add label" style="border: 2px solid #4472C4;" class="checkbox-input" @input="checkboxFlagObj()"></input>
                        </template>
                    </v-checkbox>
                    <span class="labelCheckboxError" id="blueCheckboxError">Enter a valid label</span>
                <v-checkbox density="compact" class="checkbox" :false-value="false" :error="!store.flagLabels.purpleCheckbox?.length" multiple :value="purpleValue" v-model="store.flagsChecked" @update:modelValue="updateCheckbox($event, 'purpleCheckboxError')">
                        <template v-slot:append>
                            <v-icon icon="mdi-flag" color="#B75CFF" class="checkbox-flag"></v-icon>
                            <input v-model="store.flagLabels.purpleCheckbox" placeholder="Add label" style="border: 2px solid #B75CFF;" class="checkbox-input" @input="checkboxFlagObj()"></input>
                        </template>
                    </v-checkbox>
                    <span class="labelCheckboxError" id="purpleCheckboxError">Enter a valid label</span>
                    <div id="checkboxCloseBtnDiv">
                        <v-btn size="small" id="checkboxCloseBtn" @click="showFlagLabels()">Close</v-btn>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    
    <div v-for="(rd, road) in store.updateRetsSearch" :key="rd.attributes.OBJECTID" :id="rd.attributes.OBJECTID" class="rets-card-row">
        <!-- <v-btn elevation="0" @click="changeColor(rd.attributes.RETS_ID);" class="flag-btn" size="small" max-width=".5px" density="compact" flat slim variant="plain">
            <template v-slot:prepend>
                <v-icon size="medium" :id="`${rd.attributes.RETS_ID}Icon`" :color="rd.attributes.flagColor.FLAG" :icon="rd.attributes.flagColor.FLAG ? changeFlagIcon(rd.attributes.flagColor.FLAG) : 'mdi-flag-outline'"></v-icon>
            </template>
        </v-btn> -->
        <!-- <div> -->

            <v-lazy :options="{'threshold': 0, 'scrollMargin': '0px'}" transition="expand-transition" height="100" width="100%" >
                <v-card :id="String(rd.attributes.RETS_ID).concat('-',rd.attributes.OBJECTID)" :style="{borderLeft: `5px solid ${colorTable[rd.attributes.STAT] ? colorTable[rd.attributes.STAT]: 'Red'}`}" hover v-ripple :class="checkhighlight(String(rd.attributes.RETS_ID)) ?? 'card-rets'"  @dblclick="double(rd, road);" @click="zoomToRetsPt(rd)">
                    <div>
                        <div>
                            <div class="shareUrlAlert" :id="'share'+rd.attributes.OBJECTID">
                                <span>Share that thang!</span>
                            </div>
                            <div style="display:flex; flex-direction: row; align-items: center; justify-content: space-between;">
                                <div>
                                    <v-card-text id="retsId">
                                        RETS {{  rd.attributes.RETS_ID  }}
                                    </v-card-text>
                                </div>
                                
                                <div style="flex: 1; container-type: inline-size;">
                                    <v-card-text id="retsCMNT" >
                                        {{ rd.attributes.RETS_NM}}
                                    </v-card-text>
                                </div> 
                                <div>
                                    <v-card-text class="route-name" >
                                        {{ rd.attributes.RTE_NM ?? "No Route" }}
                                    </v-card-text>
                                </div>
                                <div style="padding-left: 5px;">
                                    <v-tooltip text="Share Url" location="top">
                                        <template v-slot:activator="{props}"> 
                                            <v-icon v-bind="props" class="exportRetsUrl" icon="mdi-export" size="medium" @click="shareURL(rd.attributes.RETS_ID); $event.stopPropagation()"></v-icon>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </div>
                            <div style="min-height: 54%;">
                                <span class="text-concat">
                                    {{ rd.attributes.DESC_ ? rd.attributes.DESC_ : "Description is empty" }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="bottomCardText">
                        <div>
                            <v-card-subtitle class="subtitle-text">
                                {{ rd.attributes.historyUpdate }}
                            </v-card-subtitle>
                        </div>
                        <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
                            <!-- <template v-slot:prepend> -->
                            <div @click="showFlagLabels(rd); $event.stopPropagation();" style="display: flex; flex-direction: row; gap: 2px;">
                                <div v-if="!rd.attributes.flagColor.FLAG || !rd.attributes.flagColor.FLAG.length">
                                    <v-icon size="medium" icon="mdi-flag-outline" color="'#FFFFFF'"></v-icon>
                                </div>
                                <div v-for="flag in rd.attributes.flagColor.FLAG">
                                    <v-tooltip :text="store.flagLabels[`${flag.label}`] ?? 'No Flag'" location="top">
                                        <template v-slot:activator="{props}">
                                            <v-icon v-bind="props" size="medium" icon="mdi-flag" :color="flag.color ?? '#FFFFFF'"></v-icon>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </div>
                            <div>
                                <v-tooltip text="Assigned to you" location="top">
                                    <template v-slot:activator="{props}">
                                        <v-icon icon="mdi-human-dolly" color="white" v-if="rd.attributes.mdiaccountmultiplecheck === true" class="cardPRIO" v-bind="props"></v-icon>
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

                                <v-tooltip text="Has Attachments" location="top">
                                    <template v-slot:activator="{props}">
                                        <v-icon icon="mdi-paperclip" color="" v-if="rd.attributes.mdipaperclip === true" class="cardPRIO" v-bind="props"></v-icon>
                                    </template>
                                </v-tooltip>
                            </div>
                            <!-- </template> -->
                        </div>
                                        
                                    
                        <!-- <div style="position: relative; float: right; padding-top: 0px; bottom: 20px; left: 5px; right: 10px; ">
                            <v-tooltip v-for="i in alertIcons" :text="i.popup" >
                                <template v-slot:activator="{props}" v-if="rd.attributes[i.name] === true"> 
                                    <v-icon :icon="i.icon" class="cardPRIO" :color="i.color" v-bind="props"></v-icon>
                                </template>
                            </v-tooltip>
                        </div> -->


                                            
                    </div>

                    <!-- </div> -->
                </v-card>
            </v-lazy>
        <!-- </div> -->
    
    </div>
      
    
</template>

<script>
import {zoomTo, highlightRETSPoint, removeHighlight, checkhighlightfunction, loadData, openDetails, createCheckboxFlagObj, updateCheckboxFlag, isHighlighted} from './utility.js'
import {appConstants} from '../common/constant.js'
import {store} from './store.js'

export default{
    name: "RetsCards",
    data(){
        return{
            swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#008000', '#4472C4', '#B75CFF', '#FFFFFF'],
            colorTable: appConstants.CardColorMap,
            alertIcons:[
                {name: "mdiHumanDolly", icon: "mdi-human-dolly", popup: "Assigned to you", color: "white", display: "ASSIGNED_TO", condition: `${store.loggedInUser}`, displaySup: "GIS_ANALYST", supplementCondition: `${store.loggedInUser}`},
                {name: "mdiaccountgroup", icon:"mdi-account-group", popup: "MO/TxDOT Connect", color: "white", display: "ACTV", condition: "TxDOTConnect"}, //ACTV === (Minute Order || TxDOTConnect)
                // {icon:"mdi-account-group", popup: "MO/TxDOT Connect", color: "white", display: "ACTV", condition: "Minute Order"},
                {name: "mdipencilboxoutline", icon:"mdi-pencil-box-outline", popup: "District Request", color: "white", display: "ACTV", condition: "Request"}, //keep null
                {name: "mdialarm", icon:"mdi-alarm", popup: "Deadline set (with date)", color: "white", display: "DEADLINE", condition: null}, //past the deadline set
                {name: "mdicheckdecagramoutline", icon:"mdi-check-decagram-outline", popup: "Job Complete", color: "green", display: "STAT", condition: 3},
                {name: "mditimersand", icon: "mdi-timer-sand", popup: "No activity for (# days)", color: "white", display: "STAT", condition: 2, determineDate: (x)=>{returnSand(x)}}, //Only for in progress rets; edit_dt >= 5 weeks
                {name: "mdiexclamation", icon: "mdi-exclamation", popup:"Priority Job", color:"red", display: "PRIO", condition: 0}                
            ],
            store,
            flagLabels: [],
            flagsChecked: [],
            isColorPicked: true,
            roads: [],
            currIter: 0,
            nextIter: 100,
            showFlagLabel: false,
            labelTimeout: null,
            redValue: {'color': '#FF0000', 'label': 'redCheckbox'},
            orangeValue: {'color': '#FF7F00', 'label': 'orangeCheckbox'},
            yellowValue: {'color': '#FFFF00', 'label': 'yellowCheckbox'},
            greenValue: {'color': '#008000', 'label': 'greenCheckbox'},
            blueValue: {'color': '#4472C4', 'label': 'blueCheckbox'},
            purpleValue: {'color': '#B75CFF', 'label': 'purpleCheckbox'}
        }
    },

    mounted(){
        this.setLayer
        store.isSaving = false
        loadData()
        const flagLabel = appConstants.defaultUserValue[0].labels
        if(!flagLabel) return
        let parseFlagLabel = JSON.parse(flagLabel)
        this.setFlagLabels(parseFlagLabel)
        return
    },

    updated(){
        if(store.isSearch){
            loadData()
            return
        }
        this.setLayer
        loadData()
        return
    },
    methods:{
        shareURL(retsid){
            let copyUrl = `${window.location.origin}${window.location.pathname}?retsid=${retsid}`
            navigator.clipboard.writeText(copyUrl)
            store.alertTextInfo = {"text": `${copyUrl} has been copied to clipboard.`, "color": "#70ad47", "type":"success", "toggle": true}
            store.isAlert = true
            return
        },
        setFlagLabels(labels){
            let {redLabel, orangeLabel, yellowLabel, greenLabel, blueLabel, purpleLabel} = labels
            store.flagLabels.redCheckbox = redLabel
            store.flagLabels.orangeCheckbox = orangeLabel
            store.flagLabels.yellowCheckbox = yellowLabel
            store.flagLabels.greenCheckbox = greenLabel
            store.flagLabels.blueCheckbox = blueLabel
            store.flagLabels.purpleCheckbox = purpleLabel
            return
        },
        checkboxFlagObj(){
            if(this.labelTimeout){
                clearTimeout(this.labelTimeout)
            }
            this.labelTimeout = setTimeout((() =>{
                createCheckboxFlagObj()
            }), 300)
            return
        },
        showFlagLabels(rets){
            store.showRetsFlag = !this.showFlagLabel
            if(!store.showRetsFlag) return
            store.flagClickedId = rets.attributes.RETS_ID
            store.flagsChecked = rets.attributes.flagColor.FLAG
            return
        },
        checkhighlight(retsid){
            return checkhighlightfunction(retsid)
        },

        changeFlagIcon(color){
            if(color === '#FFFFFF'){
                return 'mdi-flag-outline'
            }
            return 'mdi-flag'
        },
        closeFlagDiv(){
            store.flagClickedId = null
            return
        },
        updateCheckbox(e, div){
            updateCheckboxFlag(e, div)
            return
        },
        async zoomToRetsPt(rets){
            if (!await isHighlighted(rets.attributes)  ){
                removeHighlight("a", true)
                store.roadHighlightObj.clear()
                if (!store.isShowSelected){
                    store.roadHighlightObj.add(rets);
                }

            }
            
            highlightRETSPoint(rets.attributes)
            zoomTo(rets.geometry)
            return
        },
        double(road, index){  
            store.openAfterDiscardRets = road

            if ((store.retsObj.attributes.CREATE_DT != null && store.retsObj.attributes.EDIT_DT != null) && (store.retsObj.attributes.CREATE_DT === store.retsObj.attributes.EDIT_DT) && (store.activityBanner != "Activity Feed" )){
                store.deleteafterdiscard = true
                store.cancelpopup = true
                return
            }
            if (store.archiveRetsDataString.length){
                const archiveRets = JSON.parse(store.archiveRetsDataString)
                if (archiveRets.attributes.RETS_ID === road.attributes.RETS_ID ){
                    openDetails(road)
                    return
                }

            }   
            
            if(!store.isSaveBtnDisable || store.alertTextInfo.text ==='Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.' || (store.retsObj.attributes.GIS_ANALYST === null || store.retsObj.attributes.GRID_ANALYST === null || store.retsObj.attributes.DIST_ANALYST === null|| store.retsObj.attributes.DIST_NM === null || store.retsObj.attributes.CNTY_NM === null) ){
                clearTimeout(this.timer)
                store.cancelpopup = true
                return
            }

           
            openDetails(road)
            return
        },


    },
    watch:{
        'store.showRetsFlag': {
            handler: function(n,o){
                this.showFlagLabel = n
            },
            immediate: true
        },
    },
    computed: {
        setLayer: () => {                                              
            store.updateRetsSearch = store.roadObj
        } 
    }
}

</script>

<style scoped>
.bottomCardText{
    display: flex;
    bottom: 10px;
    flex-direction: row;
    position: relative;
    bottom: 0px;
    justify-content: space-between;
    align-items: center;
}
.rets-card-row{
    position: relative;
    bottom: 0px;
    right: 0px;
    padding: 0% 0% 0% 0%;
    height: 70px;
    opacity: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* transform: translateX(30px);
    transition: 150ms; */
}
.rets-card-row.show{
    opacity: 1;
    /* transform: translateX(0); */
    padding: 0px;
    width: 100% !important;
    height: 100px;
}
.flag-btn{
    font-size: 10px;
    top: 21.2px;
    left: 460px;
    z-index: 999;
    width: 1px !important;
    padding: 0px !important;
    opacity: 1 !important;
    min-width: 15px !important;
}
.color-picker{
    position: absolute;
    background-color: black;
    left: 488px;
    top: 2.7rem;
    width: 300px;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 45px;
    padding: 10px 10px 10px 10px;
}
.card-rets{
    position: relative !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100% !important;
    border-radius: 0% !important;
    margin: 0% !important;
    height: 100% !important;
    padding: 0px 5px 0px 5px !important;
    left: 0px;
    box-sizing: border-box;
}
.highlight-card{
    background-color: #404040 !important;
}
.boundary-rets-card{
    position: relative;
    top: 0px;
}
#retsId{
    padding:0px; 
    position: relative; 
    font-size: 12px;
    color: #D9D9D9;
    font-weight: bold;
    margin-right: 10px;
    white-space: nowrap;
}
#retsCMNT{
    position: relative;
    overflow: hidden;
    padding: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    color: #4472C4;
    font-size: 12px;

}
.route-name{
    padding: 0;
    font-size: 12px;
    color:#D9D9D9;
    font-weight: bold;
    z-index: 2;
    white-space: nowrap;

}
.text-concat {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    font-size: 11.5px;
    position: relative;
    color: #a6a6a6;
    width: 100%;
    height: 50px;
    /* bottom: 33px; */
}
.cardPRIO{
    margin-left:10px;
    font-size: 20px;
}
.v-card{
    background-color: rgba(255,0,0,0);
}
.checkbox{
    position: relative;
    right: 5px !important;
    bottom: 5px;
}
.v-checkbox{
    height: 0px;
}
.checkbox-input{
    padding-left: 35px;
    position: relative;
    width: 100%;
    left: 5px;
    bottom: 0px;
}
.checkbox-input:focus{
    outline: none;
}

.checkbox-flag{
    position: relative;
    left: 35px;
    bottom: 0px;
}

.labelCheckboxError{
    display: none;
    color: red;
    padding-bottom: 0px;
}
.exportRetsUrl{
    color: grey;
}
.exportRetsUrl:hover{
    color: white;
}
.shareUrlAlert{
    background-color: red; 
    color: white; 
    font-size: 12px; 
    display: flex; 
    flex-direction: row; 
    justify-content: center; 
    align-items: center;
    display: none;
    position: absolute;
    width: 100%;
    right:1px;
    z-index: 9999;
}
#checkboxCloseBtn{
    border: 1px solid grey;
    border-radius: 0px;
}
#checkboxCloseBtnDiv{
    position: relative;
    width: 100%; 
    display: flex; 
    flex-direction: row; 
    justify-content: end;
    margin-top: 7px;
}
</style>