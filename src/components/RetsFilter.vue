<template>
    <div>
        <v-card id="filterFeed" >
            <div class="cardDiv regain">
                <v-card-title style="position: relative; bottom:.5rem;">Filter Activity Feed</v-card-title>
                <hr class="popup-title-border" style="position: relative; bottom: 15px"></hr>
                <v-row no-gutters class="adjustRow">
                    <v-select :items="filterSort" item-title="title" return-object style="position: relative;" density="compact" label="Sort" variant="underlined" v-model="store.CREATE_DT"></v-select>
                </v-row>
              
                <v-row no-gutters dense class="adjustRow">
                    <v-select :items="filterJobType" item-title="name" item-value="value" return-object multiple chips closable-chips density="compact" label="Job Type" variant="underlined" v-model="store.JOB_TYPE">
                    </v-select>
                </v-row>
            
                <v-row no-gutters dense id="date" class="adjustRow"> 
                    <v-select label="Date" chips closable-chips variant="underlined" density="compact" v-model="store.EDIT_DT" hide-no-data @click="isDate = !isDate">
                        <template v-slot:chip="{item}">
                            <v-chip closable @click:close="closeDateChip()">{{ item.props.title}}</v-chip>
                        </template>
                    </v-select>
                </v-row>
                
                <v-row no-gutters dense class="adjustRow">
                        <v-select :items="filterStatus" item-title="name" item-value="value" label="Status" return-object chips closable-chips multiple variant="underlined" density="compact" v-model="store.STAT">
                        </v-select>
                </v-row>
       
                <v-row no-gutters dense class="adjustRow">
                    <v-autocomplete :items="filterActivity" item-title="value" item-value="value" return-object multiple label="Activity" chips closable-chips variant="underlined" density="compact" v-model="store.ACTV"></v-autocomplete>
                </v-row>

                <v-row no-gutters dense class="adjustRow"> 
                    <v-autocomplete :items="filterDistrict" item-title="name" item-value="value" return-object multiple label="District" chips closable-chips variant="underlined" density="compact" v-model="store.DIST_NM"></v-autocomplete>
                </v-row>
                <v-row no-gutters dense class="adjustRow">
                    <v-autocomplete :items="filterCounty" item-title="name" item-value="value" return-object multiple label="County" chips closable-chips variant="underlined" density="compact" v-model="store.CNTY_NM"></v-autocomplete>
                </v-row>
                <v-row no-gutters dense class="adjustRow"> 
                    <v-autocomplete :items="filterUser" item-title="name" item-value="value" return-object label="Users" multiple chips closable-chips variant="underlined" density="compact" v-model="store.USER" :disabled="store.isAssignedTo"></v-autocomplete>
                </v-row>
                <div style="position: relative; float: left; margin-left: 10px; font-size: 11px; display: flex; flex-wrap: wrap; bottom: 1rem;">
                    <v-checkbox label="RETS Assigned to Me" density="compact" class="checkbox-size" v-model="store.isAssignedTo"></v-checkbox>
                </div>
                
                <v-expansion-panels flat variant="accordion" disabled style="width: 96.5%; left: 4px; bottom:5px;">
                    <v-expansion-panel elevation="0" tile>
                        <v-expansion-panel-title expand-icon="mdi-menu-down" collapse-icon="mdi-menu-up" static> Custom SQL Query</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-textarea class="cardDiv" rounded="0" flat density="compact" rows="2" variant="outlined" style="position: relative !important; top: 0px !important;"></v-textarea>
                                    <div style="float:right; bottom: 1rem; position: relative; margin-right:10px;">
                                        <v-btn variant="plain">Clear</v-btn>
                                        <v-btn variant="outlined" class="main-button-style">Run</v-btn>
                                    </div>
                            </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
                    <div>
                        <hr class="popup-title-border" style="position: relative; bottom: 0px; margin-right: 20px;"></hr>
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

            <v-date-picker class="date" multiple hide-header v-model="selectDate" @update:modelValue="selectDates()" tile width="300"></v-date-picker>
                
        
        <div style="position: relative; bottom: 3.3rem; ">
            <v-checkbox label="Current Year" style="position: relative; z-index: 9999; float: right; margin-bottom: 15px; margin-right: 15px" v-model="currentYear"></v-checkbox>
        </div>
    </div>
</template>

<script>
    import {filterMapActivityFeed, home} from './utility.js'
    import {appConstants} from '../common/constant.js'
    import { store } from './store'

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
                selectDate: null,
                currentYear: null,
                store,

            }
        },
        mounted(){
            this.archiveFilter()
            //console.log(appConstants.userRoles.find(y => y.value === console.log(y.value)))
            // this.filter = JSON.parse(this.filterPros)
            // console.log(this.filterPros[appConstants.userQueryField])
            // console.log(this.filterPros)
            // this.filterPros[appConstants.queryField[appConstants.userRoles.find(x => x.value === store.loggedInUser).type]] = appConstants.userRoles.filter(y => y.value === this.filterPros[appConstants.queryField[appConstants.userRoles.find(x => x.value === store.loggedInUser).type]][0].value)
        },
        methods:{
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
                this.calcFilterDiff()
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
                    isAssignedTo: store.isAssignedTo
                }
                // console.log(this.userQuery)
                // const filterField = appConstants.queryField[appConstants.userRoles.find(x => x.value === this.userQuery[0].value).type]
                // console.log(filterField)
                // console.log(this.userQuery)
                // this.filterPros[filterField] = this.userQuery[0].value
                //const filters = this.calcFilterDiff()
                //console.log(filters)
                //this.$emit('filter-set', this.filter)
                this.calcFilterDiff()
                store.setFilterFeed()
                // filterMapActivityFeed(store.filter)

                store.isfilter = false
                return
            },
            addNumFilter(){
                this.numFilters++
                return
            },  
            calcFilterDiff(){
                const typeField = [store.JOB_TYPE, store.STAT, store.ACTV, store.DIST_NM, store.CNTY_NM, store.USER]
                store.filterTotal = typeField.filter(x => x.length).length
                // for(const [key, value] of Object.entries(this.filterPros)){
                //     if(ignoreField.includes(key) || !value) continue
                //     if(value.length){
                //         this.addNumFilter()
                //     }
                //}

                // this.filterPros.filterTotal = this.numFilters
                // this.numFilters = 0
                // return keyFields
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
                this.selectDate = null
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
</style>