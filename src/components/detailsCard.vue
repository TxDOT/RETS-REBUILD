<template>
    <div style="margin: 10px; position: relative; bottom: 10px; display: flex; flex-direction: column;">
        <div no-gutters dense class="item" >
            <div style="width: 60%; float: left;">
                <v-autocomplete :items="activityList" label="Activity" variant="underlined" density="compact" item-title="value" flat v-model="store.retsObj.attributes.ACTV" @update:model-value="completeDataSearch()"></v-autocomplete>
            </div>
            <div style="width: 30%; float: right;">
                <v-text-field label="Number" density="compact" variant="underlined" :disabled="disableACTVNum(store.retsObj.attributes.ACTV)" v-model="store.retsObj.attributes.ACTV_NBR" @update:model-value="actvNbrUpdate(store.retsObj.attributes.ACTV_NBR)">
                    <template v-slot:append-inner >
                        <v-tooltip text="Find Minute Order/TxDOT Connect" location="top">
                            <template v-slot:activator="{props}">
                                <div v-bind="props">
                                    <v-icon icon="mdi-link" small class="number-field-icon" @click="paperClipFunc" ></v-icon>
                                </div>
                            </template>
                        </v-tooltip>
                    </template>
                </v-text-field>
            </div>
        </div>
        <div no-gutters dense class="item">
            <div style="width: 60%; float: left;">
                <v-text-field :disabled="store.retsObj.attributes.NO_RTE === false" label="Route" density="compact" variant="underlined" v-model="store.retsObj.attributes.RTE_NM" :rules="!store.retsObj.attributes.NO_RTE ? [valueRequired.required, valueRequired.limitCharacter] : []" :class="!store.retsObj.attributes.NO_RTE && !store.retsObj.attributes.RTE_NM?.length ? 'route route-error' : 'route'" @update:model-value="!store.retsObj.attributes.NO_RTE ? completeDataSearch() : store.isSaveBtnDisable = false" maxlength="17"></v-text-field>
            </div>
            <div style="width: 30%; float: right;">
                <v-text-field :label="this.dfoLabel" density="compact" variant="underlined" :error ="(!store.retsObj.attributes.DFO || store.outOfRange) && !store.retsObj.attributes.NO_RTE ? returnErrMsg(store.retsObj.attributes.DFO, store.outOfRange) : false" v-model="store.retsObj.attributes.DFO" :rules="!store.retsObj.attributes.NO_RTE ? [onlyNumbers.required, onlyNumbers.numbers]: []" @update:model-value="!store.retsObj.attributes.NO_RTE ? manuallyUpdateDFO(store.retsObj.attributes.DFO) : null">
                    <template v-slot:append-inner>
                        <v-tooltip text="Move RETS Point" location="top">
                            <template v-slot:activator="{props}">
                                <div v-bind="props">
                                    <v-btn id="dfoCrosshair"  variant="plain" density="compact" v-model="isCrossHair" @click="crossHairFunc"><v-icon :icon="!store.isMoveRetsPt ? 'mdi-drag-variant' : 'mdi-close'" small ></v-icon></v-btn>
                                </div>
                            </template>
                        </v-tooltip>
                    </template>
                </v-text-field>
            </div>
        </div>
        <div no-gutters dense class="item" style="height: 10%; position: relative; bottom: 4px;">
            <div>
                <v-checkbox density="compact" class="checkbox-size" v-model="store.retsObj.attributes.NO_RTE" @update:model-value="noRTECheck(store.retsObj.attributes.RTE_NM)">
                    <template v-slot:label>
                        <v-label class="main-color" id="newProposedText" text="New, Proposed, or Unspecified"></v-label>
                    </template>
                </v-checkbox>
            </div>
        </div>
        <div class="item zoomToRelRets" style="width: 100%; float: right;">
            <div style="width: 70%; float: left;">
                <v-autocomplete clear-on-select label="Related RETS" density="compact" multiple no-filter variant="underlined" v-model="store.retsObj.attributes.RELATED_RETS" :items="RETSData" item-title="RETS_ID" item-value="RETS_ID" return-object @update:search="gimmeRETS($event)">
                    <template v-slot:chip="{item}">
                        <v-chip closable @click="zoomToRelateRet(item)" @click:close="closeRelatedRetsChip(item)">{{ item.title }}</v-chip>
                    </template>
                </v-autocomplete>
            </div>
            <div style="width: 20%; float: right; position: relative; top: 10px;">
                <div style="width: 30%; float: right; ">
                    <v-tooltip text="Zoom to Related Rets" location="top">
                        <template v-slot:activator="{props}">
                            <div v-bind="props">
                                <v-btn variant="plain" icon="mdi-magnify-plus-outline" @click="zoomToRETS" style="font-size: 14px; height: 26px !important;"></v-btn>
                            </div>
                        </template>
                    </v-tooltip>
                </div>
                <div style="width: 30%; float: left;">
                    <v-btn variant="plain" icon="mdi-cursor-default" disabled style="font-size: 14px; height: 26px !important;"></v-btn>
                </div>
            </div>
        </div>
        
        <div no-gutters dense class="item">
            <v-select label="Status" variant="underlined" density="compact" class="rets-status" :items="detailsStat" item-title="name" item-value="value" v-model="store.retsObj.attributes.STAT" @update:modelValue="completeDataSearch()">
            </v-select>
        </div>
        <div no-gutters dense class="item">
            <v-textarea :error="!store.retsObj.attributes.DESC_?.length ? (this.descLabel = 'Description is empty', true)  : false" :rules=[descRequired.required] rows="4" density="compact" :label="this.descLabel" variant="underlined" v-model="store.retsObj.attributes.DESC_" no-resize @update:model-value="descCheck(store.retsObj.attributes.DESC_)" @keydown.space="preventSpace">
            </v-textarea>
        </div>
        <div class="item" style="position: relative; top: 32px; width: 100%;">
            <div style="position: relative; top: 0px; width: 30%; float: left;">
                <v-btn icon="mdi-plus" density="compact" variant="plain" @click="displayGemSearch" disabled color="white" id="addGemTaskBtn"></v-btn>
                <div id="chips">
                    <v-chip 
                        v-for="i in gemTasks"
                        closable
                        color="#4472C4"
                        density="compact"
                        variant="elevated" 
                        rounded="0"
                        pill
                        size="default"
                        class="gem-chip"
                    >
                    {{ i }}
                    </v-chip>
                </div>
            </div>
            <div style="position:relative; cursor: pointer !important;" @click="toggleVisibility()">
                <v-btn color="white" prepend-icon="mdi-timer-outline" density="compact" variant="plain" class="date-select"> {{ datePicker }}</v-btn>
            </div>
        </div>

        <div class="date-picker" v-if="isDatePicker" v-click-outside="toggleVisibility" >
            <v-date-picker v-model="datePicked" class="date" hide-header @update:modelValue="selectDates()" @update:viewMode="hideDateBtns($event);">
            </v-date-picker>
            <div class="cleardate" v-if="this.dateBtns">
                <v-tooltip location="bottom" text="Close Calendar Pane">
                    <template v-slot:activator="{ props }">
                        <v-btn flat v-bind="props" @click="toggleVisibility" density="compact" style="float: right; font-size: 10px;">CLOSE</v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip location="bottom" text="Clear Due Date" >
                    <template v-slot:activator="{ props }">
                        <v-btn flat v-bind="props"  @click="handleCleardate" density="compact" style="float: left; font-size: 10px;">CLEAR</v-btn>
                    </template>
                </v-tooltip>  
                
            </div>
        </div>
    </div>
</template>

<script>
import { appConstants } from '../common/constant'
import {getQueryLayer, addRelatedRetsToMap, removeRelatedRetsFromMap, zoomToRelatedRets, zoomTo, 
        createRoadGraphic, getRoadInformation, cancelSketchPt, hitTestMoveRETS, queryRoads, isDFOInRange, changeCursor} from './utility.js'
import {store} from './store.js'

    export default{
        name: "DetailsCard",
        data(){
            return{
                counter: 0,
                activityList: appConstants.activityList,
                gemTasks: [],
                isDatePicker: false,
                datePicked: null,
                dateBtns: true,
                datePicker: 'Add a deadline',
                descLabel: "Description",
                dfoLabel: "DFO",
                disabledRoute: false,
                disableSave: false,
                detailsStat: appConstants.statDomainValues,
                ogValues: {},
                RETSData: [],
                store,
                isFocused: false,
                typeTimeout: null,
                isCrossHair: false,
                retsRouteArchive: {},
                removeListner: {},
                onlyNumbers: {
                    required: value => !!value || null,
                    numbers: value => /[\d]/.test(Number(value)) || `Whoa! Numbers are more my vibe!`,
                },
                valueRequired:{
                    required: value => !!value || "Gimme a route a name!",
                    limitCharacter: value => value.length <= 10|| 'Max limit reached',
                },
                descRequired:{
                    required: value => !!value || ""
                },
                outOfRange: false
            }
        },
        beforeMount(){
            this.splitAndAddRelatedRets(store.retsObj.attributes.RELATED_RETS)
            // splitString.map((ret)=>{
            //     this.gimmeRETS(ret, `RETS_ID = ${ret}`)
            // })
            // document.addEventListener('click',this.handleClickOutside)
        },
        mounted(){
            this.ogValues = store.retsObj
            this.datePicker = !store.retsObj.attributes.DEADLINE ? "Add a deadline" : this.returnDateFormat(new Date(store.retsObj.attributes.DEADLINE)) 
            
            store.retsObj.attributes.NO_RTE = this.convertNoRTE(store.retsObj.attributes.NO_RTE)
            if(store.retsObj.attributes.NO_RTE === true){
                store.isDisableValidations = true
                store.retsObj.attributes.NO_RTE = true
                return
            }

            //this.valueRequired()
            this.retsRouteArchive = JSON.parse(store.archiveRetsDataString)
            //createRoadGraphic(store.retsObj, true)

        },
        methods:{
            returnErrMsg(dfo, isOutOfRange){
                if(isOutOfRange){
                    this.dfoLabel = "DFO is out of Range"
                    return false
                }
                this.dfoLabel = "I'm blank!"
                store.isAlert = true
                store.alertTextInfo = {"text": `Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.`, "color": "red", "type":"error", "toggle": true}
                return true
            },
            handleCleardate(){
                if (this.datePicked != store.retsObj.attributes.DEADLINE){
                    this.datePicker = "Add a deadline"
                    store.retsObj.attributes.DEADLINE = null 
                    store.isSaveBtnDisable = false
                }
                this.isDatePicker = !this.isDatePicker
                return 
            },
            toggleVisibility(){
                this.isDatePicker =! this.isDatePicker
            },
            convertNoRTE(noRte){
                if(noRte === 0 || noRte === -1){
                    return false
                }
                if(noRte === 1){
                    return true
                }
                return noRte
            },
            disableACTVNum(actv){
                if(!actv) return true
                if((actv?.value ?? actv) === 'Minute Order' || (actv?.value ?? actv) === 'TxDOTConnect'){
                    return false
                }
                return true
            },
            returnDateFormat(e){
                //10/29/2023 09:11am
                const date = new Date(e)
                const year = date.getFullYear()
                const day = date.getDate()
                const month = date.getMonth()+1
                return `${month}/${day}/${year}`
            },
            zoomToRelateRet(ret){
                
                let query = {"whereString" : `RETS_ID = ${Number(ret.title)}`, "queryLayer": "retsLayer"}
                getQueryLayer(query, 'RETS_ID', 5)
                .then((ret) => {
                    let createRelatedRetsInfo = {RETS_ID: ret.features[0].attributes.RETS_ID, OBJECTID: ret.features[0].attributes.OBJECTID, JOB_TYPE: ret.features[0].attributes.JOB_TYPE, fullData: ret.features[0].attributes, geometry: [ret.features[0].geometry.x, ret.features[0].geometry.y]}
                    zoomTo([ret.features[0].geometry.x, ret.features[0].geometry.y])
                    this.addGraphic([createRelatedRetsInfo])
                })
                //this.gimmeRETS(ret.title, `RETS_ID = ${Number(ret.title)}`)
            },
            splitAndAddRelatedRets(relatedRets){
                if(typeof relatedRets === "object" || !relatedRets.length){
                    // relatedRets.map((ret)=>{
                    //     this.gimmeRETS(ret, `RETS_ID = ${ret}`)
                    // })
                    return
                }
                
                const splitString = relatedRets.split(",")
                store.retsObj.attributes.RELATED_RETS = []
                splitString.map((ret)=>{
                    this.gimmeRETS(ret, `RETS_ID = ${ret}`)
                })
                return this.RETSData
            },
            completeDataSearch(){
                store.checkDetailsForComplete()
            },
            descCheck(){
                const isLettersOrNum = /\S/g
                if(!store.retsObj.attributes.DESC_.length || !isLettersOrNum.test(store.retsObj.attributes.DESC_)){
                    this.descLabel = 'Description is empty'
                    store.isSaveBtnDisable = true
                    return true
                }
                this.descLabel = 'Description'
                this.completeDataSearch()
                return false
            },
            preventSpace(e){
                if (!e.target.value) return e.preventDefault();
                return
            },
            async noRTECheck(){
                store.outOfRange = false
                let roadDFO = store.retsObj.attributes.DFO
                let routeName = store.retsObj.attributes.RTE_NM
                if(store.retsObj.attributes.NO_RTE){
                    if(!store.retsObj.attributes.DESC_ ){
                        store.isSaveBtnDisable = true
                        return
                    }
                    store.isAlert = false
                    store.isSaveBtnDisable = false
                    this.dfoLabel = 'DFO'
                    return
                }
                if(!store.retsObj.attributes.DESC_ || !roadDFO){
                    store.isSaveBtnDisable = true
                    return
                }
                const findRoad = await queryRoads("RTE_NM", `'${routeName}'`)
                if(!findRoad.features.length && !store.retsObj.attributes.NO_RTE){
                    store.isAlert = true
                    store.alertTextInfo = {"text": `Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.`, "color": "red", "type":"error", "toggle": true}
                    store.dfoIndex = "not in range"
                    store.isSaveBtnDisable = true
                    return
                }
                let isInRange = isDFOInRange(findRoad, roadDFO)

                if(!isInRange[0]){
                    store.isAlert = true
                    store.alertTextInfo = {"text": `DFO is out of Range. Begin DFO: ${isInRange[1].toFixed(3)} End DFO: ${isInRange[2].toFixed(3)}`, "color": "red", "type":"error", "toggle": true}
                    store.dfoIndex = "not in range"
                    store.isSaveBtnDisable = true
                    store.outOfRange = true
                    return
                }

                this.completeDataSearch()
                return
            },
            isDFOValid(){
                if(this.onlyNumbers.numbers(store.retsObj.attributes.DFO) !== true || this.onlyNumbers.required(store.retsObj.attributes.DFO) !== true){
                    return false
                }
                return true
            },
            isRTENMValid(){
                if(this.onlyNumbers.required(store.retsObj.attributes.RTE_NM) !== true){
                    return false
                }
                return true
            },
            sendDisabledSave(bool){
                this.$emit("disable-save", bool)
            },
            paperClipFunc(){
                store.retsObj.attributes.ACTV.value === 'Minute Order' || store.retsObj.attributes.ACTV === 'Minute Order' ? window.open(`https://publicdocs.txdot.gov/minord/mosearch/Pages/Minute-Order-Search-Results.aspx#k=${store.retsObj.attributes.ACTV_NBR}`, '_blank') :
                                                            window.open(`https://txdot.sharepoint.com/sites/division-tpp/DM-Admin/Lists/Data%20Request/EditForm.aspx?ID=${store.retsObj.attributes.ACTV_NBR}`, '_blank')
            },
            crossHairFunc(){
                try{
                    store.isMoveRetsPt = !store.isMoveRetsPt
                    if(store.isMoveRetsPt){
                        changeCursor("crosshair")
                        store.cancelEvent = hitTestMoveRETS()
                        getRoadInformation()
                        changeCursor("default")
                        return
                    }
                    const ogRteNm = JSON.parse(store.archiveRetsDataString).attributes.RTE_NM
                    store.retsObj.attributes.RTE_NM = ogRteNm
                    store.isMoveRetsPt = false
                    store.cancelEvent.remove()
                    cancelSketchPt()
                    return
                }
                catch(err){
                    if(store.cancelEvent){
                        store.isMoveRetsPt = false
                        store.cancelEvent.remove()
                        changeCursor("default")
                    }
                    
                }
                
                    //getPointRoadInteraction(store.retsObj)
                    //store.isMoveRetsPt = true
                    return
                //}
                // const parseOG = JSON.parse(this.retsRouteArchive)
                // store.retsObj.attributes.DFO = parseOG.attributes.DFO
                // store.retsObj.attributes.RTE_NM = parseOG.attributes.RTE_NM
                // getPointRoadInteraction(parseOG)
                //return
            },
            // setDate(date){

            //     return new Date(date).getFullYear() === 1969 ? 'Pick a date' : this.returnDateFormat(date)
                
            // },
            displayGemSearch(){
                document.querySelectorAll(".gem-search")[0].style.display =  document.querySelectorAll(".gem-search")[0].style.display === "block" ? "none" : "block"
            },
            async gimmeRETS(a, string){
                if(a.length){
                    const queryString = string ?? `CAST(RETS_ID AS VARCHAR(12)) LIKE '%${a}%'`
                    const query = {"whereString" : queryString, "queryLayer": "retsLayer"}
                    try{
                        const retsid = await getQueryLayer(query, 'RETS_ID', 5)
                        this.RETSData.length = 0
                        retsid.features.forEach((x) => {
                            this.RETSData.push({RETS_ID: x.attributes.RETS_ID, OBJECTID: x.attributes.OBJECTID, JOB_TYPE: x.attributes.JOB_TYPE, fullData: x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                        })
                        return
                    }
                    catch(err){
                        console.log("incorrect Query")
                    }

                    
                    return
                }
            },
            addGraphic(e){
                store.isSaveBtnDisable = false
                if(!e.length) return
                addRelatedRetsToMap(e.at(-1))
                
                return
            },
            zoomToRETS(){
                zoomToRelatedRets(store.retsObj.attributes.RELATED_RETS)
            },
            closeRelatedRetsChip(ret){
                removeRelatedRetsFromMap(ret.value, ret)
            },
            hideDateBtns(i){
                if(i === 'month'){
                    this.dateBtns = true
                    return
                }
                this.dateBtns = false
                return
            },
            selectDates(){
                this.datePicker = this.returnDateFormat(this.datePicked)
                const newDateConstruct = new Date(this.datePicked)
                const dateToEpoch = newDateConstruct.getTime()
                store.retsObj.attributes.DEADLINE = dateToEpoch
                this.isDatePicker = false
                store.isSaveBtnDisable = false
                return
            },
            checkIfRouteExists(){

            },
            actvNbrUpdate(txt){
                if(txt){
                    const regex = new RegExp(/[^\d]/)
                    store.retsObj.attributes.ACTV_NBR = regex.test(store.retsObj.attributes.ACTV_NBR) ? store.retsObj.attributes.ACTV_NBR.slice(0,-1) : store.retsObj.attributes.ACTV_NBR.slice()
                     this.completeDataSearch()
                    return
                }
            },
            manuallyUpdateDFO(a){
                store.isAlert = false
                store.outOfRange = false
                const validNumCheck = new RegExp('^[0-9]*[.]?[0-9]+$')
                const check = validNumCheck.test(Number(a))
                const b = a.split(".")
                this.dfoLabel = 'DFO'

                if(b[1] && b[1].length > 3){
                    store.retsObj.attributes.DFO = b.length > 1 ? b[0].concat(".", b[1].slice(0,3)): b[0]
                    return
                }
                if(!a.length || isNaN(a) || !check){
                    a.replace(/[a-zA-Z]/g, '')
                    store.retsObj.attributes.DFO = a.replace(/[a-zA-Z]/g, '')
                    store.isSaveBtnDisable = true
                    return
                }
                const ogDFO = this.retsRouteArchive
                
                clearTimeout(this.typeTimeout)
                if(Number(a) !== ogDFO && !store.isMoveRetsPt){
                    this.typeTimeout = setTimeout(()=>{
                        createRoadGraphic(store.retsObj, false)
                        this.completeDataSearch();
                    },900)
                }
                return
            }
        },
        watch:{
            'store.attributes.RETS_ID':{
                handler: function(){
                    store.currentInfo = JSON.stringify(store.retsObj)
                },
                immediate: true
            },
        },

    }
</script>

<style scoped>
.v-text-field, .v-select{
    height: 40px;
}
.popup{
    position: relative;
    top: 0rem !important;
}
.checkbox-size{
    position: relative;
    right: 10px;
    bottom: 15px; 
    height: 10px;
    font-size: 9px !important;
    border-radius: 0px !important;
    color:white;
}
#newProposedText{
    font-weight: bold;
    padding-bottom: 7px !important;
}
.cleardate{
    position: absolute;
    bottom:10px;
    right: 0px;
    margin-left: 0px;
    margin-right: 0px;
    width: 100%;
}
.route {
    width: 260px;
}

.route-error{
    color: #cf6679 !important;
}
:deep(#route-messages){
    position: absolute !important;
    bottom: 20px !important;
    left: 123px !important;
    width: 55px !important;
    color: rgb(207,102,121);
    z-index: 9999 !important;
    opacity: 1 !important;
}
#details-page{
    position: relative;
    height: 400px !important;
    width: 100vh !important;
    border-radius: 0px;
}

#outerDeadlineDiv{
    position: absolute;
    width: 100%;
}
.number-field{
    position: relative;
    top: 9px;
}

.number-field-icon{
    font-size: 15px;
}
#dfoCrosshair{
    position: relative;
    float: right;
    padding: 0% !important;
    margin: 0% !important;
    min-width: 0px !important;
}

.dropdwn-field{
    position: relative;
    left: 19px;
    padding: 0% !important;
}

.new-proposed-route{
    position: relative;
    max-height: 8px;
    bottom: 3px; 
    width: 200px; 
    margin-bottom: 13px;
}


.v-btn{
    margin-right: 15px;
}

.date-select{
    position: relative;
    float: right;
    font-size: 10px;
    top: 5px;
    padding: 0px;
    margin: 0px;
    text-transform: none;
    
}

#deadline-div .v-btn{
    padding-top: 7px !important;
}
#deadline-div{
    position: relative;
    margin-right: 0px;
    padding-top: 0px;
    top: 0px;
    float: right;
}

#chips{
    position: relative;
    bottom: 0rem;
    left: 3rem;
    width: 130%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
}

.gem-chip{
    margin: 0px;
    border-radius: 1 !important;
    width: 100%;
    height: 22px;
}

#addGemTaskBtn{
    font-size: 13px;
    position: relative;
    top: 3px;
    right: 8px;
}

.actDiv{
    position: relative;
    width: 220px !important;
}

.actNum{
    position: relative;
    float: right;
    width: 150px;
    bottom: 0px;
}

.routeNum{
    position: relative;
    width: 220px;
}

.routeDFO{
    position: relative;
    width: 150px;
    bottom: 54px;
    float: right;
}
.relatedRETS{
    position: relative;
    width: 300px;
    border: 2px solid blue;
    height: 35px;
}
.zoomToRelRets{
    position: relative;
    font-size: 14px;
    color:white;
    /* bottom: 42px;
    left: 350px; 
    float: right;
    max-width: 75px;
    min-width: 75px;
    min-height: 40px;
    max-height: 40px; */
}
.selectBtn{
    position: relative;
    bottom: 48px;
    float: right;
    left: 30px;
    font-size: 14px;
    color:white;
}
:deep(.v-date-picker){
    width: 290px !important;
    border-radius: 0% !important;
}
:deep(.v-date-picker-month){
    width: 290px !important;
    min-width: 290px !important;
    padding: 0px !important;
}
:deep(.v-date-picker-month__days){
  row-gap: 0px !important;
}
:deep(.v-date-picker-month__day){
  height: 40px !important;
  width: 40px !important;
}
</style>