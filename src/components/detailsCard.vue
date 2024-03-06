<template>
    <div>
        <v-row align="start" no-gutters dense style="position: relative; bottom: .5rem;">
            <v-col cols="4" offset="0">
                <v-autocomplete :items="activityList" label="Activity" variant="underlined" density="compact" flat v-model="infoRets.ACTV"></v-autocomplete>
            </v-col>
            <v-col cols="4" offset="3">
                <v-text-field label="Number" density="compact" class="number-field" variant="underlined" :disabled="this.infoRets.ACTV === 'Minute Order' || this.infoRets.ACTV === 'TxDOTConnect' ? false : true" :v-model="infoRets.ACTV === 'Minute Order' ? infoRets.MO_NBR : infoRets.MO_NBR">
                    <template v-slot:append-inner >
                        <v-icon icon="mdi-paperclip" small class="number-field-icon" @click="paperClipFunc" ></v-icon>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense style="position: relative; bottom: 1.3rem;">
            <v-col cols="3" offset="0" style="position: relative; bottom: 5px !important;">
                <v-text-field label="Route" variant="underlined" v-model="infoRets.RTE_NM" :rules="[valueRequired]" id="route"></v-text-field>
            </v-col>
            <v-col cols="4" offset="4">
                <v-text-field label="DFO" density="compact" class="number-field" variant="underlined" v-model="infoRets.DFO" :rules="[onlyNumbers]">
                    <template v-slot:append-inner >
                        <v-btn id="dfoCrosshair" variant="plain" density="compact" class="number-field-icon"><v-icon icon="mdi-drag-variant" small  @click="crossHairFunc"></v-icon></v-btn>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense>
            <v-col>
                <div class="new-proposed-route">
                    <v-checkbox density="compact" class="checkbox-size">
                        <template v-slot:label>
                            <v-label class="main-color subtitle-text" text="Check for new or proposed routes"></v-label>
                        </template>
                    </v-checkbox>
                </div>
            </v-col>
        </v-row>       
        <v-row align="center" no-gutters dense style="position: relative; bottom: 5.4rem;">
            <v-col cols="8" offset="0">
                <v-autocomplete label="Related RETS" chip closable-chips no-filter multiple variant="underlined" class="related-rets" v-model="infoRets.RELATED_RETS" :items="RETSData" item-title="name" item-value="name" return-object @update:search="gimmeRETS($event)" @update:modelValue="addGraphic($event)">
                    <template v-slot:chip="{item}">
                        <v-chip closable @click:close="closeRelatedRetsChip(item)">{{item.props.title}}</v-chip>
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
                <v-autocomplete auto-select-first label="Status" variant="underlined" density="compact" class="rets-status" :items="detailsStat" item-title="name" item-value="value" v-model="infoRets.STAT"></v-autocomplete>
            </v-col>
        </v-row>
        <v-row align="center" no-gutters dense style="position: relative; bottom: 6.1rem;">
            <v-col cols="12" offset="0">
                <v-textarea label="Description" no-resize variant="underlined" class="rets-description" rows="3" v-model="infoRets.DESC_" :rules="[valueRequired]"></v-textarea>
            </v-col>
        </v-row>
        <v-row align="center" style="position: relative; bottom: 9.1rem; ">
            <v-col cols="5" offset="0" style="z-index: 999;">
                <v-btn icon="mdi-plus" variant="plain" @click="displayGemSearch" style="top: 9px;"></v-btn>
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
                        class="gem-chip",
                    >
                    {{ i }}
                </v-chip>
                </div>
            </v-col>
            <div class="cardDiv" id="outerDeadlineDiv" >
                <div class="deadline-div" @click="isDatePicker = !isDatePicker" style="cursor: pointer;">
                    <v-text-field prepend-icon="mdi-timer-outline" disabled density="compact" variant="plain" class="date-select"> {{ datePicker }}</v-text-field>
                 </div>
            </div>

            <div class="date-picker" v-if="isDatePicker">
                <v-date-picker v-model="datePicked"></v-date-picker>
            </div>
        </v-row>
    </div>
</template>

<script>
import { appConstants } from '../common/constant'
import {getQueryLayer, addRelatedRetsToMap, removeRelatedRetsFromMap, zoomToRelatedRets} from './utility.js'

    export default{
        name: "DetailsCard",
        props: {
            infoRets: Object,
            taskGem: Number
        },
        data(){
            return{
                activityList: ['CRI', 'GSC Review', 'HPMS Sample Review', 'Interstate Project', 'Minute Order', 
                               'OSOSRE', 'Proposed FC', 'Recover Minute Order', 'ROW Crowdsource', 'Sprint 1',
                               'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Toll', 'TxDOTConnect', 'Urban Area Interaction'],
                gemTasks: [],
                isDatePicker: false,
                datePicked: null,
                datePicker: '',
                disabledRoute: false,
                disableSave: false,
                detailsStat: appConstants.statDomainValues,
                ogValues: {},
                RETSData: [],
            }
        },
        mounted(){
            this.infoRets.RELATED_RETS ? this.splitAndAddRelatedRets(this.infoRets.RELATED_RETS) : null
            this.ogValues = this.infoRets
            const milliDate = new Date(this.infoRets.DEADLINE)
            this.datePicker = this.setDate(milliDate)
            this.initDataCheck()
            
        },
        methods:{
            splitAndAddRelatedRets(relatedRets){
                if(typeof relatedRets !== "object") return
                console.log(relatedRets)
                const splitString = relatedRets.split(",")
                this.infoRets.RELATED_RETS = splitString
                splitString.forEach((ret)=>{
                    this.gimmeRETS(ret, `RETS_ID = ${ret}`)
                    console.log(this.RETSData)
                    //this.addGraphic(this.RETSData[0])
                })
            },
            initDataCheck(){
                // if Route, status or description; save button disabled
                let item = [this.infoRets.RTE_NM, this.infoRets.STAT, this.infoRets.DESC_].find(x => !x)
                if(!item){
                    this.sendDisabledSave(true)
                }
            },
            valueRequired(e){
                if(!e.length){
                    this.sendDisabledSave(true)
                    return `Wrong :(`
                }
                this.sendDisabledSave(false)
                return
            },
            sendDisabledSave(bool){
                this.$emit("disable-save", bool)
            },
            onlyNumbers(i){
                let convert = Number(i)
                if(!convert){
                    this.sendDisabledSave(true)
                    return `Whoa! Numbers are more my vibe!`
                }
                this.sendDisabledSave(false)
                return
            },
            paperClipFunc(){
                this.infoRets.ACTV === 'Minute Order' ? window.open(`https://publicdocs.txdot.gov/minord/mosearch/Pages/Minute-Order-Search-Results.aspx#k=${this.infoRets.MO_NBR}`, '_blank') :
                                                            window.open(`https://txdot.sharepoint.com/sites/division-tpp/DM-Admin/Lists/Data%20Request/EditForm.aspx?ID=${1138}`, '_blank')
            

                console.log("paperclip clicked")
                console.log(this.infoRets)
            },
            crossHairFunc(){
                console.log('crosshair clicked')
            },
            setDate(date){
                return date.toLocaleDateString('en-US')
            },
            displayGemSearch(){
                document.querySelectorAll(".gem-search")[0].style.display =  document.querySelectorAll(".gem-search")[0].style.display === "block" ? "none" : "block"
            },
            async gimmeRETS(a, string){
                if(a.length){
                    const queryString = string ?? `RETS_ID >= ${a}`
                    const query = {"whereString" : queryString, "out": ['RETS_ID', 'JOB_TYPE', 'OBJECTID']}
                    try{
                        const retsid = await getQueryLayer(query, 'RETS_ID', 5)
                        this.RETSData.length = 0
                        retsid.features.forEach((x) => {
                            this.RETSData.push({name: x.attributes.RETS_ID, oid: x.attributes.OBJECTID, jobType: x.attributes.JOB_TYPE, geometry: [x.geometry.x, x.geometry.y]})
                        })
                        if(string){
                            this.addGraphic(this.RETSData)
                            return
                        }
                    }
                    catch(err){
                        console.log("incorrect Query")
                    }

                    
                    return
                }
            },
            addGraphic(e){
                addRelatedRetsToMap(e.at(-1))
            },
            zoomToRETS(){
                console.log(this.infoRets.RELATED_RETS)
                zoomToRelatedRets(this.infoRets.RELATED_RETS)
            },
            closeRelatedRetsChip(ret){
                removeRelatedRetsFromMap(ret)
                const retsPos =  this.infoRets.RELATED_RETS.findIndex(x => x.oid === ret.raw.oid)
                this.infoRets.RELATED_RETS.splice(retsPos,1)
            }
        },
        watch:{
            datePicked:{
                handler: function(){
                    this.datePicker = this.setDate(this.datePicked)
                    this.infoRets.DEADLINE = this.datePicker 
                    this.isDatePicker = false
                },
            },
            taskGem:{
                handler: function(){
                    if(!this.taskGem) return
                    this.gemTasks.push(this.taskGem)
                },
            },
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
#details-page{
    position: relative;
    height: 400px !important;
    width: 100vh !important;
    bottom: 1rem;
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
}

.checkbox-size{
    font-size: 10px !important;
}
.v-btn{
    margin-right: 15px;
}

.date-select{
    float: right;
}

.deadline-div .v-btn{
    padding-top: 7px !important;
}
.deadline-div{
    position: relative;
    margin-right: 0px;
    padding-top: 0px;
    bottom: 0rem;
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