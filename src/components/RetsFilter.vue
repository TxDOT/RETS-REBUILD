<template>
        <div id="filterFeed">
            <v-card>
                <div style="margin: 10px;">
                    <div style="position: relative; bottom:0rem; font-weight: normal; font-size: 20px; flex: auto;">Filter Activity Feed</div>
                    <hr></hr>
                    <div class="container" @click="isDisabled = false; store.customquery = null">
                        <div no-gutters class="item">
                            <v-select :disabled="isDisabled" :items="filterSort" item-title="title" return-object density="compact" label="Sort" variant="underlined" v-model="store.CREATE_DT" style="">
                            </v-select>
                        </div>

                        <div no-gutters dense class="item">
                            <v-select :disabled="isDisabled" :items="filterJobType" item-title="name" item-value="value" return-object multiple chips closable-chips density="compact" label="Job Type" variant="underlined" v-model="store.JOB_TYPE">
                            </v-select>
                        </div>

                        <div no-gutters dense id="date" class="item"> 
                            <v-select :disabled="isDisabled" label="Date" chips closable-chips variant="underlined" density="compact" v-model="store.EDIT_DT" hide-no-data @click="isDate = !isDate">
                                <template v-slot:chip="{item}">
                                    <v-chip closable @click:close="closeDateChip()">{{ item.props.title}}</v-chip>
                                </template>
                            </v-select>
                        </div>
                        
                        <div no-gutters dense class="item">
                            <v-select :disabled="isDisabled" :items="filterStatus" item-title="name" item-value="value" label="Status" return-object chips closable-chips multiple variant="underlined" density="compact" v-model="store.STAT"></v-select>
                        </div>

                        <div no-gutters dense class="item">
                            <v-autocomplete :disabled="isDisabled" :items="filterActivity" item-title="value" item-value="value" return-object multiple label="Activity" chips closable-chips variant="underlined" density="compact" v-model="store.ACTV" @update:modelValue="actvSearch = ''" :search="actvSearch" @update:search="this.actvSearch = $event" @update:menu="actvSearch = ''"></v-autocomplete>
                        </div>

                        <div no-gutters dense class="item"> 
                            <v-autocomplete :disabled="isDisabled" :items="filterDistrict" item-title="name" item-value="value" return-object multiple label="District" chips closable-chips variant="underlined" density="compact" v-model="store.DIST_NM" @update:modelValue="this.districtSearch = ''" :search="this.districtSearch" @update:search="this.districtSearch = $event" @update:menu="districtSearch = ''"></v-autocomplete>
                        </div>
                        <div no-gutters dense class="item">
                            <v-autocomplete :disabled="isDisabled" :items="filterCounty" item-title="name" item-value="value" return-object multiple label="County" chips closable-chips variant="underlined" density="compact" v-model="store.CNTY_NM" @update:modelValue="countySearch = ''" :search="countySearch" @update:search="countySearch = $event" @update:menu="countySearch = ''"></v-autocomplete>
                        </div>
                        <div no-gutters dense class="item"> 
                            <v-autocomplete :items="filterUser" item-title="name" item-value="value" return-object label="Users" multiple chips closable-chips variant="underlined" density="compact" v-model="store.USER" :disabled="store.isAssignedTo || isDisabled" @update:modelValue="userSearch = ''" :search="userSearch" @update:search="userSearch = $event" @update:menu="userSearch = ''"></v-autocomplete>
                        </div>
                        <div style="position: relative; float: left; max-height: 40px !important; font-size: 11px; display: flex; flex-wrap: wrap; bottom: 0rem;" class="item">
                            <v-checkbox :disabled="isDisabled" label="RETS Assigned to Me" density="compact" class="checkbox-size" v-model="store.isAssignedTo"></v-checkbox>
                        </div>
                    </div>
                        
                        
                    <v-expansion-panels flat variant="accordion">
                        <v-expansion-panel elevation="0" tile>
                            <v-expansion-panel-title expand-icon="mdi-menu-down" collapse-icon="mdi-menu-up" static > Custom SQL Query</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-combobox style="position: relative; right: 25px; width: 115.5% !important;" ref="combobox" @input="clearValidation" v-model="store.customquery" :items="store.userFilters.customQuery" rounded="0" flat density="compact" variant="outlined">
                                        <template #item="{ item }">
                                            <v-list-item :title="item.value" @click="selectQuery(item.value)">
                                                 <template v-slot:append>
                                                    <v-btn  
                                                    @click="deleteQuery(item.value)"
                                                    icon="mdi-close"
                                                    density="compact"
                                                    tile
                                                    flat
                                                    size="small"
                                                    style="position: relative; right: 10px;"
                                                    >
                                                    </v-btn>
                                                 </template>

                                            </v-list-item>
                                        </template>
                                        <template #append style="border: 2px solid red">
                                            <v-menu open-on-click v-model="fieldDiv" style=" width: 300px; left:910px ;position: absolute; ">
                                                <template v-slot:activator="{ props }">
                                                    <v-tooltip text="Field Names" location="top">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn 
                                                                icon="mdi-table-eye"
                                                                v-bind="props"
                                                                flat
                                                                @click="fieldDiv = true"
                                                                size="small"
                                                                >
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
    

                                                </template>
                                                <v-list id="fieldsList" value = "selected" max-height="800">
                                                    <v-list-item v-for="(item,index) in fieldNames" :key="index" density="compact">
                                                    <v-list-item-title @click="appendField(item)" density="compact"> {{ item }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </template>
                                    </v-combobox> 
                                    <span style="color: red; font-size: 12px; margin-left: 10px;">{{validationMessage}}</span>
                                        <div style="float:right; position: relative; left: 29px;">
                                            <v-btn-toggle class="trigger-buttons" density="compact">
                                                <v-btn variant="plain" @click="clearCustomQuery">Clear</v-btn>
                                                <v-btn variant="outlined" class="main-button-style" @click="runCustomQuery" :disabled="store.customquery?.length > 5 ? false : true">Run</v-btn>
                                            </v-btn-toggle>
                                        </div>
                                </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    
                    <hr class="popup-title-border" style="position: relative; width: 100%; position: relative; bottom: 0px;"></hr>
                    <div style="position: relative; float: right;">
                        <v-btn-toggle class="trigger-buttons" density="compact">
                            <v-btn @click="cancelFilter()" class="secondary-button" variant="plain" size="small">Cancel</v-btn>
                            <v-btn @click="setFilterNumber()" class="main-button-style" variant="outlined" size="small">Save</v-btn>
                        </v-btn-toggle>
                    </div>
                    <div>
                        <div style="float: left;">
                            <v-btn id="restoreDefault" variant="plain" @click="restoreDefault()">Restore Default</v-btn>
                        </div>
                    </div>    
                </div>
            
            </v-card>
        </div>
        <div style="position: absolute; left: 890px; top: 100px;" v-if="isDate">
            <v-date-picker class="date" multiple hide-header v-model="selectDate" @update:modelValue="selectDates()" tile width="300" :disabled="selectDate.length === 2"></v-date-picker>
            <div style="position: relative; bottom: 3.3rem; ">
                <v-checkbox label="Current Year" style="position: relative; z-index: 9999; float: right; margin-bottom: 15px; margin-right: 15px" v-model="currentYear"></v-checkbox>
            </div>
            <div style="position: relative; bottom: 3.3rem; height: 50px; width: 98px;">
                <v-btn style="float: left; margin-left: 10px; top: 12px;" @click="isDate = false" flat>CLOSE</v-btn>
            </div>
        </div>

        <!-- <div style="position: absolute; left: calc(50vh + 47vh + 74px); top: 21.5%;" v-if="isDate">
            <v-date-picker class="date" multiple hide-header v-model="selectDate" @update:modelValue="selectDates()" tile width="300" :disabled="selectDate.length === 2"></v-date-picker>
            <div style="position: relative; bottom: 3.3rem; ">
                <v-checkbox label="Current Year" style="position: relative; z-index: 9999; float: right; margin-bottom: 15px; margin-right: 15px" v-model="currentYear"></v-checkbox>
            </div>
            <div style="position: relative; bottom: 3.3rem; height: 50px; width: 98px;">
                <v-btn style="float: left; margin-left: 10px; top: 12px;" @click="isDate = false" flat>CLOSE</v-btn>
            </div>
        </div> -->
</template>

<script>
    import {filterMapActivityFeed, home} from './utility.js'
    import {appConstants} from '../common/constant.js'
    import { store } from './store'
    import {addRETSFilter} from './crud.js'
    import { retsLayer, view } from './map-Init.js';

    export default{
        name: "Filter",
        data(){
            return{
                filterSort: [
                             {title: "Date: Newest to Oldest", sortType: "DESC", filter: "CREATE_DT"}, 
                             {title: "Date: Oldest to Newest", sortType: "ASC", filter: "CREATE_DT"},
                             {title: "Status: Ascending", sortType: "ASC", filter: "STAT"}, 
                             {title: "Status: Descending", sortType: "DESC", filter: "STAT"}
                            ],
                filterJobType: appConstants.jobTypeDomainValues,
                filterStatus: appConstants.statDomainValues,
                filterDistrict: appConstants.districtDomainValues,
                filterCounty: appConstants.countyDomainValues,
                filterUser: appConstants.userRoles,
                filterActivity: appConstants.activityList,
                numFilters: 0,
                defaultFilter: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "CREATE_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, 
                         "filterTotal": 2},
                isDate: false,
                selectDate: [],
                currentYear: null,
                store,
                userSearch: "",
                countySearch: "",
                districtSearch: "",
                actvSearch: "",
                customquery: "",
                itemsTest: [
                    { title: 'Click Me 1' },
                    { title: 'Click Me 2' },
                    { title: 'Click Me 3' },
                    { title: 'Click Me 4 ' },
                ],
                fieldNames : [],
                selected:"",
                validationMessage: "",
                isDisabled: store.customquery ? true : false,
                customqueryArray: [],
                fieldDiv: false,
                isExpandCustomQuery: true
            }
        },
        mounted(){
            this.archiveFilter(),
            this.getFields(),
            this.testmethod()
            

            
        },
        computed: {
            
        },
        methods:{
            clearValidation(){
                if ((store.customquery === null || store.customquery === "") && (this.validationMessage != null || this.validationMessage != "" ) ){
                    this.validationMessage = ''
                }
            },
            testmethod(){
                if (store.customquery === retsLayer.definitionExpression){
                    
                    return
                }
            },
            cancelsaveQuery(filter){
                const filterObject = {attributes: {OBJECTID : appConstants.defaultUserValue[0].objectid, FILTERS : JSON.stringify(filter)}}
                addRETSFilter(filterObject)
            },
            deleteQuery(selection){
                console.log(selection)
                const findItem = store.userFilters.customQuery.findIndex((index) => {
                    return index === selection
                    
                })
                store.userFilters.customQuery.splice(findItem,1)
                this.$refs.combobox.blur()
            },
            selectQuery(selection){
                store.customquery = selection
                this.$refs.combobox.blur()
            },
            clearValue(){
                appConstants.defaultUserValue[0].filters = null
                const filterObject = {attributes: {OBJECTID : appConstants.defaultUserValue[0].objectid, FILTERS : null}}
                addRETSFilter(filterObject)
            },
            appendField(field){
                if (store.customquery === null){
                    store.customquery = field
                }
                else{
                    store.customquery = store.customquery + ' ' + field

                }
            },
            getFields(){
                retsLayer.when(() => {
                    this.fieldNames = retsLayer.fields.map(a => a.name)
                })
            },
            runCustomQuery(){
                // this.clearValue()
                // return
                if (store.customquery === ''){
                    return
                }

                const query = {
                    where: store.customquery
                }

                retsLayer.queryFeatures(query)
                    .then((response) =>         
                        {
                            if (!response.features.length){
                                this.validationMessage = "No features returned."
                                return
                            }
                            retsLayer.definitionExpression = store.customquery
                            store.getRetsLayer(store.loggedInUser,store.customquery, 'retsLayerLayerView', 'EDIT_DT DESC')
                                retsLayer.queryExtent()
                                    .then((resp) =>{
                                        view.goTo(resp.extent)
                                        if (store.customquery)
                                            {
                                                
                                                store.userFilters.customQuery.push(store.customquery)
                                                this.isDisabled = true
                                                store.customquery = store.userFilters.customQuery.at(-1)
                                            }
                                        
                                    })
                                   
                                    
                                    
                                   
                                    
                                    
                        })
                        .catch((error) => {
                            
                            if (error.message === 'Unable to complete operation.'){
                                this.validationMessage = "Invalid Query."
                            }
                        })
                

                
            },
            clearCustomQuery(){
                store.customquery = ""
                this.isDisabled = false
                this.validationMessage = ""
            },
            archiveFilter(){
                store.archiveFilter = JSON.stringify({
                    createDt: store.CREATE_DT,
                    jobType: store.JOB_TYPE,
                    editDt: store.EDIT_DT,
                    stat: store.STAT,
                    actv: store.ACTV,
                    distNM: store.DIST_NM,
                    cntyNM: store.CNTY_NM,
                    user: store.USER,
                    isAssignedTo: store.isAssignedTo
                })
                return 
            },
            cancelFilter(){
                const filterParse = JSON.parse(store.archiveFilter)
                store.CREATE_DT = filterParse.createDt
                store.JOB_TYPE = filterParse.jobType
                store.EDIT_DT = filterParse.editDt
                store.STAT = filterParse.stat
                store.ACTV = filterParse.actv
                store.DIST_NM = filterParse.distNM
                store.CNTY_NM = filterParse.cntyNM
                store.USER = filterParse.user
                store.isAssignedTo = filterParse.isAssignedTo

                const filterObject = {
                    createDt: store.CREATE_DT,
                    jobType: store.JOB_TYPE,
                    editDt: store.EDIT_DT,
                    stat: store.STAT,
                    actv: store.ACTV,
                    distNM: store.DIST_NM,
                    cntyNM: store.CNTY_NM,
                    user: store.USER,
                    isAssignedTo: store.isAssignedTo,
                    customQuery: store.userFilters.customQuery

                }
                this.cancelsaveQuery(filterObject)
                this.calcFilterDiff()
                store.isfilter = false
                return
            },
            setFilterNumber(){
                store.filter = {
                    createDt: store.CREATE_DT,
                    jobType: store.JOB_TYPE,
                    editDt: store.EDIT_DT,
                    stat: store.STAT,
                    actv: store.ACTV,
                    distNM: store.DIST_NM,
                    cntyNM: store.CNTY_NM,
                    user: store.USER,
                    isAssignedTo: store.isAssignedTo,
                    customQuery: store.userFilters.customQuery

                }

                this.cancelsaveQuery(store.filter)
                this.calcFilterDiff()
                store.customquery ? null : store.setFilterFeed()
                store.isfilter = false
                return
            },
            addNumFilter(){
                this.numFilters++
                return
            },  
            calcFilterDiff(){
                const typeField = [store.JOB_TYPE.length, store.STAT.length, store.ACTV.length, store.DIST_NM.length, store.CNTY_NM.length, store.USER.length, store.isAssignedTo]
                store.filterTotal = typeField.filter(x => x).length
                return
            },
            restoreDefault(){
                store.CREATE_DT = {title: "Date: Newest to Oldest", sortType: "DESC", filter: "EDIT_DT"}
                store.JOB_TYPE.length = 0
                store.EDIT_DT = null
                store.STAT = appConstants.defaultStatValues
                store.ACTV.length = 0
                store.DIST_NM.length = 0
                store.CNTY_NM.length = 0
                store.USER = [appConstants.userRoles.find(usr => usr.value === appConstants.defaultUserValue[0].value)]
                store.isAssignedTo = false
                store.customquery =  null
                store.defaultFilterSetup()
                // this.defaultFilter.loggedInUser = appConstants.defaultUserValue[0].value
                // this.filter.CREATE_DT = this.defaultFilter.CREATE_DT
                // this.filter.JOB_TYPE = this.defaultFilter.JOB_TYPE
                // this.filter.EDIT_DT = this.defaultFilter.EDIT_DT
                // this.filter.STAT = this.defaultFilter.STAT
                // this.filter.ACTV = this.defaultFilter.ACTV
                // this.filter.DIST_NM = this.defaultFilter.DIST_NM
                // this.filter.CNTY_NM = this.defaultFilter.CNTY_NM
                // this.filter[appConstants.userQueryField] = appConstants.defaultUserValue
                // this.filter.filterTotal = this.defaultFilter.filterTotal
                
                filterMapActivityFeed(store.filter)
                this.setFilterNumber()
                //this.$emit('filter-set', this.filterPros)
                return
            },
            selectDates(){
                if(this.selectDate.length > 2 ) return
                if(this.selectDate.length === 2){
                    this.selectDate.sort((a,b) => a - b)
                    store.EDIT_DT = `${this.selectDate[0].toLocaleDateString('en-US')} - ${this.selectDate[1].toLocaleDateString('en-US')}`
                    this.isDate = false
                    return
                }
                store.EDIT_DT = `${this.selectDate[0].toLocaleDateString('en-US')}`
                return
            },
            closeDateChip(){
                this.selectDate = []
                store.EDIT_DT = null
                return
            }

        },
        watch:{
            currentYear:{
                handler: function(){
                    if(this.currentYear){
                        this.selectDate = []
                        this.EDIT_DT = null
                        const year = new Date().getFullYear()
                        const constrctBegDate = new Date(`January 01, ${year}`)
                        const constrctEndDate = new Date(`December 31, ${year}`)
                        this.selectDate = [constrctBegDate, constrctEndDate]
                        this.selectDates()
                        return
                    }
                    //this.filterPros.EDIT_DT = null
                    this.selectDate = []
                    return
                },
                immediate: true
            }
        }

    }
</script>

<style scoped>
    .container{
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        gap: 0px;
    }
    .item{
        flex: auto;
    }
    .v-input{
        padding: 0px;
    }
    #filterFeed{
        position: relative;
        top: 39px;
        width: 400px;
        left: calc(59px + 429px);
        border-radius: 0%;
        min-height: 53%;
        max-height: 80%;
        overflow-y: auto;
    }

    #restoreDefault{
        font-size: 8px;
        text-decoration: underline;
        color: #4472C4;
        right: 1rem;
    }
    .adjustRow{
        position: relative !important;
    }
    .checkbox-size{
        font-size: 10px !important;
    }

    #trigger-buttons{
        padding-top: .5rem;
        position: relative;
        margin-right: 0px;
        left: 10px; 
    }

    :deep(.v-input__details){
        min-height: 1px !important;
    }
    :deep(.v-messages){
        min-height: 1px !important;
    }
</style>