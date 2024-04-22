<template>
    <div>
    <v-container>
        <v-row align="start" no-gutters dense style="position: relative; bottom: .5rem; height: 50px;">
            <v-col cols="4" offset="0">
                <v-autocomplete :items="activityList" label="Activity" variant="underlined" density="compact" item-title="value" item-value="name" return-object flat v-model="store.retsObj.attributes.ACTV"></v-autocomplete>
            </v-col>
            <v-col cols="4" offset="3">
                <v-text-field label="Number" density="compact" class="number-field" variant="underlined" :disabled="disableACTVNum(store.retsObj.attributes.ACTV)" v-model="store.retsObj.attributes.ACTV_NBR">
                    <template v-slot:append-inner >
                        <v-icon icon="mdi-link" small class="number-field-icon" @click="paperClipFunc" ></v-icon>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense style="position: relative; bottom: 1.3rem; height: 70px; padding-bottom: 0% !important;" >
            <v-col cols="3" offset="0" style="position: relative; bottom: 5px !important;">
                <v-text-field label="Route" variant="underlined" v-model="store.retsObj.attributes.RTE_NM" :rules="!store.isDisableValidations ? [valueRequired] : [false] " id="route"></v-text-field>
            </v-col>
            <v-col cols="4" offset="4">
                <v-text-field label="DFO" density="compact" class="number-field" variant="underlined" v-model="store.retsObj.attributes.DFO" :rules="onlyNumbers" @update:model-value="onlyNumberss(store.retsObj.attributes.DFO)">
                        <template v-slot:append-inner>
                            <v-tooltip :text="store.zoomInText" location="top">
                                <template v-slot:activator="{props}">
                                    <div v-bind="props">
                                        <v-btn id="dfoCrosshair"  variant="plain" density="compact" class="number-field-icon" v-model="isCrossHair" @click="crossHairFunc" :disabled="store.zoomInToEnable"><v-icon :icon="!store.isMoveRetsPt ? 'mdi-drag-variant' : 'mdi-close'" small ></v-icon></v-btn>
                                    </div>
                                </template>
                            </v-tooltip>
                        </template>
                    
                </v-text-field>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense>
            <v-col>
                <div class="new-proposed-route">
                    <v-checkbox density="compact" class="checkbox-size" v-model="store.retsObj.attributes.NO_RTE">
                        <template v-slot:label>
                            <v-label class="main-color subtitle-text" text="Check for new or proposed routes"></v-label>
                        </template>
                    </v-checkbox>
                </div>
            </v-col>
        </v-row>       
        <v-row align="center" no-gutters dense style="position: relative; bottom: 5.4rem;">
            <v-col cols="8" offset="0">
                <v-autocomplete label="Related RETS" no-filter multiple variant="underlined" class="related-rets" v-model="store.retsObj.attributes.RELATED_RETS" :items="RETSData" item-title="name" item-value="name" return-object @update:search="gimmeRETS($event)" @update:modelValue="addGraphic($event)">
                    <template v-slot:chip="{props, item}">
                        <v-chip v-bind="props" closable @click:close="closeRelatedRetsChip(item)" @click="zoomToRelateRet(item.raw.geometry)" style="z-index: 9999;">{{item.props.title}}</v-chip>
                    </template>
                </v-autocomplete>

            </v-col>
            <v-col cols="1" offset="2">
                <v-btn variant="plain" icon="mdi-magnify-plus-outline" @click="zoomToRETS"></v-btn>
            </v-col>
            <v-col cols="1" offset="0">
                <v-btn variant="plain" icon="mdi-cursor-default"></v-btn>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense style="position: relative; bottom:5.7rem;">
            <v-col cols="12" offset="0">
                <v-autocomplete auto-select-first label="Status" variant="underlined" density="compact" class="rets-status" :items="detailsStat" item-title="name" item-value="value" v-model="store.retsObj.attributes.STAT"></v-autocomplete>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense style="position: relative; bottom: 6.1rem; height: 0px;">
            <v-col cols="12" offset="0">
                <v-textarea label="Description" no-resize variant="underlined" class="rets-description" rows="3" v-model="store.retsObj.attributes.DESC_" :rules="!store.isDisableValidations ? [valueRequired]: []"></v-textarea>
            </v-col>
        </v-row>
        <v-row align="center" style="position: relative; bottom: 2.1rem; height: 25px;">
            <div style="width: 100%; height: 5%">
                <!-- <v-col cols="5" offset="0" style="z-index: 999;"> -->
                <div style="width: 35%;">
                    <v-btn icon="mdi-plus" variant="plain" @click="displayGemSearch" style="bottom: 0px;"></v-btn>
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
                
            <!-- </v-col> -->
                <div style="position:relative; bottom: 4.3rem; cursor: pointer !important; height: 32px; width: 119px; float: right" @click="isDatePicker = true">
                    <v-text-field prepend-icon="mdi-timer-outline" disabled density="compact" variant="plain" class="date-select" style="z-index: 9999; "> {{ datePicker }}</v-text-field>
                    <!-- <v-col offset="0" style="z-index: 999; cursor: pointer; max-width: 6rem; height:2rem; padding: 0px; " @click="isDatePicker = true">
                        
                    </v-col> -->
                </div>
            </div>
            
            <!-- <v-text-field prepend-icon="mdi-timer-outline" disabled density="compact" variant="plain" class="date-select" style="z-index: 9999; cursor: pointer !important;" @click="isDatePicker = true"> {{ datePicker }}</v-text-field> -->
            <div class="date-picker" v-if="isDatePicker">
                <v-date-picker v-model="datePicked" class="date" hide-header @update:modelValue="selectDates()"></v-date-picker>
            </div>
        </v-row>
        
    </v-container>
    </div>
    
</template>

<script>
import { appConstants } from '../common/constant'
import {getQueryLayer, addRelatedRetsToMap, removeRelatedRetsFromMap, zoomToRelatedRets, zoomTo, createRoadGraphic, getRoadInformation, completeMovePtSketch, changeCursor} from './utility.js'

import {store} from './store.js'
    export default{
        name: "DetailsCard",
        props: {
            taskGem: Number
        },
        data(){
            return{
                activityList: appConstants.activityList,
                gemTasks: [],
                isDatePicker: false,
                datePicked: null,
                datePicker: 'Pick a Date',
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
                onlyNumbers: [
                    value =>{
                        if(!value) return false
                        const num = Number(value)
                        if(!/[\d]/.test(num) && !store.retsObj.attributes.NO_RTE ) return `Whoa! Numbers are more my vibe!`
                        if(!value.length && !store.retsObj.attributes.NO_RTE ) return `But where am I? Don't leave me blank!`
                        
                    }
                ]
            }
        },
        beforeMount(){
            this.splitAndAddRelatedRets(store.retsObj.attributes.RELATED_RETS)
        },
        mounted(){

            this.ogValues = store.retsObj
            
            this.datePicker = !store.retsObj.attributes.DEADLINE ? "Pick a date" : this.returnDateFormat(new Date(store.retsObj.attributes.DEADLINE)) 
            
            store.retsObj.attributes.NO_RTE = this.convertNoRTE(store.retsObj.attributes.NO_RTE)
            if(store.retsObj.attributes.NO_RTE === true){
                store.isAlert = false
                store.isDisableValidations = true
                store.retsObj.attributes.NO_RTE = true
                return
            }
            //this.initDataCheck()
            this.retsRouteArchive = JSON.parse(store.archiveRetsDataString)
            createRoadGraphic(store.retsObj, true)
        },
        methods:{
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
            zoomToRelateRet(geom, event){
                zoomTo(geom)
                
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
            initDataCheck(){
                // if Route, status or description; save button disabled
                let item = [store.retsObj.attributes.RTE_NM, store.retsObj.attributes.STAT, store.retsObj.attributes.DESC_].filter(x => !x)
                if(!store.retsObj.attributes.NO_RTE){
                    if(store.retsObj.attributes.DFO === null || !store.retsObj.attributes.RTE_NM){
                        store.isAlert = true
                        store.alertTextInfo = {"text": "Route Number or DFO is missing", "color": "red", "toggle": true}
                        return store.isSaveBtnDisable = true
                    }
                    if(!store.retsObj.attributes.RTE_NM.length){
                        store.isAlert = true
                        store.alertTextInfo = {"text": "Route Number or DFO is missing", "color": "red", "toggle": true}
                        return store.isSaveBtnDisable = true
                    }
                }
                if(item.length > 0){
                    store.isAlert = false
                    store.isSaveBtnDisable = true
                    return true
                }
                store.isAlert = false
                store.isSaveBtnDisable = false
                return false
            },
            valueRequired(e){
                if(e === null) return false
                if(!e.length){
                    store.isSaveBtnDisable = true
                    return `Field is required`
                }
                store.isSaveBtnDisable = false
                
                return false
            },
            sendDisabledSave(bool){
                this.$emit("disable-save", bool)
            },
           onlyNumberss(i, event){
                if(store.isDisableValidations) return true
                if(!i){
                    store.isSaveBtnDisable = true
                    return `But where am I? Don't leave me blank!`
                }
                if(!store.retsObj.attributes.NO_RTE){
                    let convert = Number(i)

                    if(!convert){
                        store.isSaveBtnDisable = true
                        return `Whoa! Numbers are more my vibe!`
                    }
                    //createRoadGraphic(store.retsObj)
                    store.isSaveBtnDisable = false
                    return false
                }
                store.isSaveBtnDisable = false
                return false
                
            },
            paperClipFunc(){
                store.retsObj.attributes.ACTV.value === 'Minute Order' ? window.open(`https://publicdocs.txdot.gov/minord/mosearch/Pages/Minute-Order-Search-Results.aspx#k=${store.retsObj.attributes.ACTV_NBR}`, '_blank') :
                                                            window.open(`https://txdot.sharepoint.com/sites/division-tpp/DM-Admin/Lists/Data%20Request/EditForm.aspx?ID=${store.retsObj.attributes.ACTV_NBR}`, '_blank')
            },
            crossHairFunc(){
                store.isMoveRetsPt = !store.isMoveRetsPt
                if(store.isMoveRetsPt){
                    this.removeListner = getRoadInformation()
                    return
                }
                changeCursor("default")
                this.removeListner.remove()
                completeMovePtSketch()
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
                            this.RETSData.push({name: x.attributes.RETS_ID, oid: x.attributes.OBJECTID, retsid: store.retsObj.attributes.RETS_ID, jobType: x.attributes.JOB_TYPE, fullData: x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                        })
                        if(string){
                            this.addGraphic(this.RETSData)
                            store.retsObj.attributes.RELATED_RETS.push(this.RETSData[0])
                            return
                        }
                        return
                    }
                    catch(err){
                        console.log("incorrect Query")
                    }

                    
                    return
                }
            },
            addGraphic(e){
                e = typeof e === "object" ? e : this.splitAndAddRelatedRets(store.retsObj.attributes.RELATED_RETS)
                addRelatedRetsToMap(e.at(-1))
            },
            zoomToRETS(){
                zoomToRelatedRets(store.retsObj.attributes.RELATED_RETS)
            },
            closeRelatedRetsChip(ret){
                removeRelatedRetsFromMap(ret.raw?.name)
                // const retsPos = store.retsObj.attributes.RELATED_RETS.findIndex(x => x.name === Number(ret.raw?.name))
                // console.log(retsPos)
                //store.retsObj.attributes.RELATED_RETS.splice(retsPos,1)
            },
            queryRdFeatureLayer(){
                
            },
            selectDates(){
                this.datePicker = this.returnDateFormat(this.datePicked)
                const newDateConstruct = new Date(this.datePicked)
                const dateToEpoch = newDateConstruct.getTime()
                store.retsObj.attributes.DEADLINE = dateToEpoch
                this.isDatePicker = false
                return
            },
        },
        watch:{
            taskGem:{
                handler: function(){
                    if(!this.taskGem) return
                    this.gemTasks.push(this.taskGem)
                },
            },
            'store.attributes.RETS_ID':{
                handler: function(){
                    store.currentInfo = JSON.stringify(store.retsObj)
                    this.splitAndAddRelatedRets(store.retsObj.attributes.RELATED_RETS)
                },
                immediate: true
            },
            'store.retsObj.attributes.NO_RTE':{
                handler: function(){
                    if(store.retsObj.attributes.NO_RTE){
                        store.isDisableValidations = true
                        store.isSaveBtnDisable = false
                        store.isAlert = false
                        return
                    }
                    store.isDisableValidations = false
                    this.initDataCheck()

                    return
                },
                immediate: true
            },
            'store.retsObj.attributes.DFO':{
                handler: function(a,b){
                    if(a === null){
                        a = ""
                    }
                    if(!a.length || !Number(a)) return
                    if(Number(a) === b) return
                    const ogDFO = this.retsRouteArchive
                    clearTimeout(this.typeTimeout)
                    if(Number(a) !== ogDFO && !store.retsObj.attributes.NO_RTE && !store.isMoveRetsPt){
                        this.typeTimeout = setTimeout(()=>{
                            createRoadGraphic(store.retsObj, false)
                        },900)
                    }
                    return

                }
            }
        },

    }
</script>

<style scoped>
:deep(#route-messages){
    position: absolute !important;
    width: 55px !important;
    left: 120px !important;
    bottom: 1.5rem
}
#route{
    width: 50px;
}
#details-page{
    position: relative;
    height: 400px !important;
    width: 100vh !important;
    bottom: rem;
    border-radius: 0px;
    
}

#outerDeadlineDiv{
    position: absolute;
    width: 100%;
}
.number-field{
    position: relative;
    padding-left: 2.5rem;
    width: 16vh;
    left: 24%;
    font-size: 20vh;
}

.number-field-icon{
    font-size: 17px;
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
    font-size: 10px !important;
    position: relative;
    bottom: 58px;
    right: 7.2px;
}


.v-btn{
    margin-right: 15px;
}

.date-select{
    float: right;
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
    bottom: 2.2rem;
    left: 3rem;
    width: 130%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    height: 30px;
}

.gem-chip{
    margin: 1px;
    width: fit-content;
    padding: 0%;
}
</style>