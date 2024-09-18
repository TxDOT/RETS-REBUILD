<template>
    <div >
        <v-card id="filterFeed" >
            <div class="cardDiv regain">
                <v-card-title style="position: relative; bottom:.5rem;">Filter Activity Feed</v-card-title>
                <hr class="popup-title-border" style="position: relative; bottom: 15px; margin : 10px"></hr>
                <v-row no-gutters class="adjustRow">
                    <v-select :items="filterSort" item-title="title" return-object style="position: relative;" density="compact" label="Sort" variant="underlined" v-model="store.CREATE_DT" :disabled="filterDisableStatus"></v-select>
                </v-row>
              
                <v-row no-gutters dense class="adjustRow">
                    <v-select :items="filterJobType" item-title="name" item-value="value" return-object multiple chips closable-chips density="compact" label="Job Type" variant="underlined" v-model="store.JOB_TYPE" :disabled="filterDisableStatus" >
                    </v-select>
                </v-row>
            
                <v-row no-gutters dense id="date" class="adjustRow"> 
                    <v-select label="Date" chips closable-chips variant="underlined" density="compact" v-model="store.EDIT_DT" hide-no-data @click="isDate = !isDate" :disabled="filterDisableStatus">
                        <template v-slot:chip="{item}">
                            <v-chip closable @click:close="closeDateChip()">{{ item.props.title}}</v-chip>
                        </template>
                    </v-select>
                </v-row>
                
                <v-row no-gutters dense class="adjustRow">
                        <v-select :items="filterStatus" item-title="name" item-value="value" label="Status" return-object chips closable-chips multiple variant="underlined" density="compact" v-model="store.STAT" :disabled="filterDisableStatus">
                        </v-select>
                </v-row>
       
                <v-row no-gutters dense class="adjustRow">
                    <v-autocomplete :items="filterActivity" item-title="value" item-value="value" return-object multiple label="Activity" chips closable-chips variant="underlined" density="compact" v-model="store.ACTV" @update:modelValue="actvSearch = ''" :search="actvSearch" @update:search="this.actvSearch = $event" @update:menu="actvSearch = ''" :disabled="filterDisableStatus"></v-autocomplete>
                </v-row>

                <v-row no-gutters dense class="adjustRow"> 
                    <v-autocomplete :items="filterDistrict" item-title="name" item-value="value" return-object multiple label="District" chips closable-chips variant="underlined" density="compact" v-model="store.DIST_NM" @update:modelValue="this.districtSearch = ''" :search="this.districtSearch" @update:search="this.districtSearch = $event" @update:menu="districtSearch = ''" :disabled="filterDisableStatus"></v-autocomplete>
                </v-row>
                <v-row no-gutters dense class="adjustRow">
                    <v-autocomplete :items="filterCounty" item-title="name" item-value="value" return-object multiple label="County" chips closable-chips variant="underlined" density="compact" v-model="store.CNTY_NM" @update:modelValue="countySearch = ''" :search="countySearch" @update:search="countySearch = $event" @update:menu="countySearch = ''" :disabled="filterDisableStatus"></v-autocomplete>
                </v-row>
                <v-row no-gutters dense class="adjustRow"> 
                    <v-autocomplete :items="filterUser" item-title="name" item-value="value" return-object label="Users" multiple chips closable-chips variant="underlined" density="compact" v-model="store.USER" :disabled="store.isAssignedTo" @update:modelValue="userSearch = ''" :search="userSearch" @update:search="userSearch = $event" @update:menu="userSearch = ''"  ></v-autocomplete>
                </v-row>
                <div style="position: relative; float: left; margin-left: 10px; font-size: 11px; display: flex; flex-wrap: wrap; bottom: 1rem;">
                    <v-checkbox label="RETS Assigned to Me" density="compact" class="checkbox-size" v-model="store.isAssignedTo" :disabled="filterDisableStatus"></v-checkbox>
                </div>
                <v-expansion-panels flat variant="accordion"  style="width: 96.5%; left: 4px; bottom:5px;" >
                    <!-- disabled -->
                    <v-expansion-panel elevation="0" tile>
                        <v-expansion-panel-title expand-icon="mdi-menu-down" collapse-icon="mdi-menu-up" static > Custom SQL Query</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-combobox 
                                    v-model="store.filterquery" 
                                    :items="this.filteritems" 
                                    item-value="raw"  
                                    item-text="raw"    
                                    :error-messages="errorMessages" 
                                    @input="validateFields" 
                                    class="cardDiv" 
                                    rounded="0" 
                                    flat 
                                    density="compact" 
                                    rows="2" 
                                    variant="outlined" 
                                    style="position: relative !important; top: 0px !important;"
                                    ref="combobox"


                                >
                                    <template v-slot:item="data">
                                        <div 
                                            class="item-container" 
                                            @click="updateCurrentFilter(data.item.raw)"
                                        >
                                            <span>{{ data.item.raw }}</span> 
                                            <v-icon 
                                                :size="'12px'"
                                                @click.stop="deleteQuery(store.loggedInUser, data.item.raw)" 
                                                style="cursor: pointer;"
                                            >
                                                mdi-close
                                            </v-icon>
                                        </div>
                                    </template>
                                </v-combobox>                   
                                <div style="float:right; bottom: 1rem; position: relative; margin-right:10px;">
                                    <v-btn @click="clearQuery()" variant="plain">Clear</v-btn>
                                    <v-btn @click="runCustomQuery()" variant="outlined" class="main-button-style" :disabled="queryvalidation">Run</v-btn>
                                </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
            <div>
                <hr class="popup-title-border" style="position: relative; bottom: 0px; margin-right: 20px; margin: 10px;"></hr>
                <div style="float: right; margin: 10px; position: relative;" >     
                    <v-btn @click="cancelFilter()" class="secondary-button" variant="plain">Cancel</v-btn>
                    <v-btn @click="setFilterNumber()" class="main-button-style" variant="outlined">Save</v-btn>
                </div>
                <div style="float: left; margin-left: 15px; position: relative; top: 9px;">
                    <v-btn id="restoreDefault" variant="plain" @click="restoreDefault()">Restore Default</v-btn>
                </div>
            </div>
        </v-card>
    </div>
    <div style="position: absolute; left: calc(50vh + 47vh + 74px); top: 21.5%;" v-if="isDate">

            <v-date-picker class="date" multiple hide-header v-model="selectDate" @update:modelValue="selectDates()" tile width="300" :disabled="selectDate.length === 2"></v-date-picker>
                
        
        <div style="position: relative; bottom: 3.3rem; ">
            <v-checkbox label="Current Year" style="position: relative; z-index: 9999; float: right; margin-bottom: 15px; margin-right: 15px" v-model="currentYear"></v-checkbox>
        </div>
        <div style="position: relative; bottom: 3.3rem; height: 50px; width: 98px;">
            <v-btn style="float: left; margin-left: 10px; top: 12px;" @click="isDate = false" flat>CLOSE</v-btn>
        </div>
    </div>
</template>

<script>
    import {filterMapActivityFeed} from './utility.js'
    import {appConstants} from '../common/constant.js'
    import { store } from './store'
    import { retsLayer, view } from './map-Init.js';
    import Query from "@arcgis/core/rest/support/Query.js";
    import { updateRETSROLE, getFilterItems, deleteCustomQuery } from './crud.js';



    export default{
        name: "Filter",
        data(){
            return{
                filteritems: [],
                selectedItem: null,
                queryvalidation: false,
                searchField : ["GIS_ANALYST", "GRID_ANALYST", "DIST_ANALYST", "STAT", "CNTY_NM", "DIST_NM", "ACTV", "JOB_TYPE", "ASSIGNED_TO"],
                invalidFields : [],
                errorMessages: [],
                filteredFeatures: [],
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
                filterDisableStatus: false,
                validKeys: ['GIS_ANALYST', 'GRID_ANALYST', 'STAT', 'DIST_NM', 'CNTY_NM', 'ACTV'],
            }
        },
        mounted(){
            this.archiveFilter()
            
        },
        async created(){
            store.filterItems = await getFilterItems(store.loggedInUser); //creates array from filters in FILTERS field
            if (store.currFilter !== '') {
                store.filterquery = store.currFilter;
            } else {
                if (store.lastQuery === appConstants['defaultQuery'](store.loggedInUser)) {
                    store.filterquery = '';
                } else {
                    store.filterquery = store.lastQuery;
                }
            }

            if (store.filterItems) {
                this.filteritems = store.filterItems.filter(item => item !== appConstants['defaultQuery'](store.loggedInUser));
            }
        },
        computed:{
            filter() {
                return this.$store.getters.filter;
                },
        },
        methods:{
            handleFilters(){
                store.isAssignedTo = true;
                this.filterDisableStatus = true;
                store.JOB_TYPE = []
                store.EDIT_DT = null
                store.STAT = []
                store.ACTV = []
                store.DIST_NM = []
                store.CNTY_NM = []
                store.USER = []
                
            },
            updateCurrentFilter(filter){
                this.$refs.combobox.blur();
                store.filterquery = filter
            },
            clearQuery(){
                // setTimeout(() => {
                //     this.restoreDefault()
                //     updateRETSROLE(store.loggedInUser, appConstants['defaultQuery'](store.loggedInUser))

                // }, 1000);
                store.filterquery = null
            },
            validateFields(){
                let regex = /(\w+)\s*=/g;

                this.invalidFields = [];
                let match;

                this.errorMessages = []

                while ((match = regex.exec(store.filterquery)) !== null) {
                let fieldName = match[1].toLocaleUpperCase(); 

                if (!this.searchField.includes(fieldName)) {
                    this.invalidFields.push(fieldName);
                }
                }

                if (this.invalidFields.length){
                    this.errorMessages = this.invalidFields.map(field => `Invalid field: ${field}`);
                    this.queryvalidation = true

                }
                else{
                    this.errorMessages = [];
                    this.queryvalidation = false

                }
            },
            runCustomQuery() {
                this.filterDisableStatus = true
                if (!this.invalidFields.length && store.filterquery) {
                    let filterQuery = store.filterquery; 
                    const districtDomainValues = appConstants.districtDomainValues;
                    const countyDomainValues = appConstants.countyDomainValues;
                    const statusDomainValues = appConstants.statDomainValues

                    const replaceDomainValues = (query, fieldName, domainValues) => {
                        domainValues.forEach((domain) => {
                            const regex = new RegExp(`${fieldName}\\s*=\\s*'${domain.name}'`, 'gi');
                            query = query.replace(regex, `${fieldName} = ${domain.value}`);
                        });
                        return query;
                    };

                    const capitalizeAll = (str) => str.toUpperCase();

                    const capitalizeFirstLetterOfEachWord = (str) => {
                        return str.replace(/\b\w/g, char => char.toUpperCase());
                    };

                    const modifyFieldValues = (query) => {
                        const regex = /(\w+)\s*=\s*'([^']+)'/gi;

                        return query.replace(regex, (match, fieldName, value) => {
                            if (['GIS_ANALYST', 'GRID_ANALYST'].includes(fieldName)) {
                                value = capitalizeAll(value);
                                return `${fieldName} = '${value}'`;
                            } else if (fieldName === 'ACTV') {
                                value = capitalizeFirstLetterOfEachWord(value);
                                return `${fieldName} = '${value}'`;
                            } else if (fieldName === 'DIST_ANALYST') {
                                value = capitalizeAll(value);
                                return `${fieldName} LIKE '%${value}%'`;  
                            }
                            return match;
                        });
                    };

                    filterQuery = modifyFieldValues(filterQuery);

                    filterQuery = replaceDomainValues(filterQuery, 'DIST_NM', districtDomainValues);
                    filterQuery = replaceDomainValues(filterQuery, 'CNTY_NM', countyDomainValues);
                    filterQuery = replaceDomainValues(filterQuery, 'STAT', statusDomainValues);


                    retsLayer.definitionExpression = filterQuery;

                    var query = new Query();
                    query.where = filterQuery;
                    query.returnGeometry = true;

                    retsLayer.queryFeatures(query)
                        .then((results) => {
                            var geometries = results.features.map(function(feature) {
                                return feature.geometry;
                            });

                            if (geometries.length) {
                                view.goTo(geometries);
                                store.getRetsLayer(store.loggedInUser, filterQuery, 'retsLayerLayerView',' EDIT_DT DESC')////////////////////////////////////
                                updateRETSROLE(store.loggedInUser, filterQuery)
                                store.currFilter = store.filterquery
                                store.isfilter = false



                            } else {
                                this.errorMessages = ["No features returned"];
                            }
                        })
                        .catch((error) => {
                            this.errorMessages = ["Query failed, please check your query"];
                        });

                }
            },
            async deleteQuery(username, filterToRemove){
                await deleteCustomQuery(username, filterToRemove)
                updateRETSROLE(store.loggedInUser, appConstants['defaultQuery'](store.loggedInUser))
                store.filterquery = ""
                this.$refs.combobox.blur();
                store.isfilter = false;  // This runs after the first line completes

                setTimeout(() => {
                    store.isfilter = true;  // This runs after the first line completes

                }, 5);


                
                
               
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

                store.isfilter = false
                this.calcFilterDiff()
                return
            },
            setFilterNumber(){
                //if (!store.filterquery){
                    store.filter = {
                    createDt: store.CREATE_DT,
                    jobType: store.JOB_TYPE,
                    editDt: store.EDIT_DT,
                    stat: store.STAT,
                    actv: store.ACTV,
                    distNM: store.DIST_NM,
                    cntyNM: store.CNTY_NM,
                    user: store.USER,
                    isAssignedTo: store.isAssignedTo
                    
                }
                if (store.JOB_TYPE.length === appConstants.jobTypeDomainValues.length){
                    store.filter.jobType = []
                    console.log("okkkk")
                }
              

                store.filterquery  = ""
                this.calcFilterDiff()
                store.setFilterFeed()
      
                
                //}
                
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

                store.getRetsLayer(store.loggedInUser, appConstants['defaultQuery'](store.loggedInUser), 'retsLayerLayerView',' EDIT_DT DESC')////////////////////////////////////
                updateRETSROLE(store.loggedInUser, appConstants['defaultQuery'](store.loggedInUser))

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
            },
        }

    }
</script>

<style scoped>
    #filterFeed{
        top: 57px;
        width: 47vh;
        left: calc(52px + 509px);
        display: flex;
        flex-direction: column;
        border-radius: 0%;
        position: absolute;
        min-height: 64vh;
        max-height: 91vh;
        overflow-y: auto;
    }

    .v-btn + .v-btn {
        margin-left: 10px;
    }

    #restoreDefault{
        float: left;
        font-size: 8px;
        text-decoration: underline;
        color: #4472C4;
        right: 1rem;
    }
    .adjustRow{
        position: relative !important; 
        margin-left: 15px !important; 
        margin-right: 15px !important;
    }
    .checkbox-size{
        font-size: 10px !important;
    }
    .item-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    cursor: pointer;
    padding: 4px 8px; 
    font-size: 14px; 
    transition: background-color 0.3s ease; 
}

.item-container:hover {
    background-color: #6c6969;
}
</style>