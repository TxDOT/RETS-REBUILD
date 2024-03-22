<template>
    <div>
        <v-card id="filterFeed" >
            <div class="cardDiv regain">
                <v-card-title style="position: relative; bottom:.5rem;">Filter Activity Feed</v-card-title>
                <v-row no-gutters >
                    <v-select :items="filterSort" item-title="title" item-value="sortType" return-object style="position: relative;" density="compact" label="Sort" variant="underlined" v-model="filterPros.CREATE_DT"></v-select>
                </v-row>
              
                <v-row no-gutters dense >
                    <v-select :items="filterJobType" item-title="name" item-value="value" return-object multiple chips closable-chips density="compact" label="Job Type" variant="underlined" v-model="filterPros.JOB_TYPE">
                    </v-select>
                </v-row>
            
                <v-row no-gutters dense id="date">
                    <v-select label="Date" chips closable-chips variant="underlined" density="compact" v-model="filterPros.EDIT_DT" hide-no-data @click="isDate = !isDate">
                        <template v-slot:chip="{item}">
                            <v-chip closable @click:close="closeDateChip()">{{ item.props.title}}</v-chip>
                        </template>
                    </v-select>
                </v-row>
                
                <v-row no-gutters dense>
                        <v-select :items="filterStatus" item-title="name" item-value="value" label="Status" return-object chips closable-chips multiple variant="underlined" density="compact" v-model="filterPros.STAT">
                        </v-select>
                </v-row>
       
                <v-row no-gutters dense >
                    <v-autocomplete :items="filterActivity" item-title="value" item-value="value" return-object multiple label="Activity" chips closable-chips variant="underlined" density="compact" v-model="filterPros.ACTV"></v-autocomplete>
                </v-row>

                <v-row no-gutters dense > 
                    <v-autocomplete :items="filterDistrict" item-title="name" item-value="value" return-object multiple label="District" chips closable-chips variant="underlined" density="compact" v-model="filterPros.DIST_NM"></v-autocomplete>
                </v-row>
                <v-row no-gutters dense >
                    <v-autocomplete :items="filterCounty" item-title="name" item-value="value" return-object multiple label="County" chips closable-chips variant="underlined" density="compact" v-model="filterPros.CNTY_NM"></v-autocomplete>
                </v-row>
                <v-row no-gutters dense >
                    <v-autocomplete :items="filterUser" item-title="value" item-value="value" return-object label="Users" multiple chips closable-chips variant="underlined" density="compact" v-model="filterPros.GIS_ANALYST"></v-autocomplete>
                </v-row>

                <v-expansion-panels flat variant="accordion">
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
                        <div style="float: right; margin: 10px; position: relative;" >
                            <v-btn @click="cancelFilter()" class="secondary-button" variant="plain">Cancel</v-btn>
                            <v-btn @click="setFilterNumber()" class="main-button-style" variant="outlined">Save</v-btn>
                        </div>
                        <div style="float: left; margin: 10px; position: relative;">
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
    import {filterMapActivityFeed} from './utility.js'
    import {appConstants} from '../common/constant.js'

    export default{
        name: "Filter",
        props:{filterPros: Object},
        emits: ['filter-set'],
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
                filterUser: appConstants.defaultUserValue,
                filterActivity: appConstants.activityList,
                numFilters: 0,
                defaultFilter: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "CREATE_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": appConstants.defaultUserValue, 
                         "filterTotal": 2},
                isDate: false,
                selectDate: null,
                currentYear: null,
            }
        },
        methods:{
            cancelFilter(){
                this.calcFilterDiff()
                this.$emit('filter-set', 'cancel')
                return
            },
            setFilterNumber(){
                this.calcFilterDiff()
                this.$emit('filter-set', this.filterPros)
                filterMapActivityFeed(this.filterPros)
                return
            },
            addNumFilter(){
                this.numFilters++
                return
            },  
            calcFilterDiff(){
                const ignoreField = ['CREATE_DT', 'filterTotal', 'loggedInUser']
                for(const [key,value] of Object.entries(this.filterPros)){
                    if(ignoreField.includes(key) || !value) continue
                    if(value.length){
                        console.log(value)
                        this.addNumFilter()
                    }
                }

                this.filterPros.filterTotal = this.numFilters
                this.numFilters = 0
                return
            },
            restoreDefault(){
                this.defaultFilter.loggedInUser = appConstants.defaultUserValue[0].value
                this.filterPros.CREATE_DT = this.defaultFilter.CREATE_DT
                this.filterPros.JOB_TYPE = this.defaultFilter.JOB_TYPE
                this.filterPros.EDIT_DT = this.defaultFilter.EDIT_DT
                this.filterPros.STAT = this.defaultFilter.STAT
                this.filterPros.ACTV = this.defaultFilter.ACTV
                this.filterPros.DIST_NM = this.defaultFilter.DIST_NM
                this.filterPros.CNTY_NM = this.defaultFilter.CNTY_NM
                this.filterPros.GIS_ANALYST = this.defaultFilter.GIS_ANALYST
                this.filterPros.filterTotal = this.defaultFilter.filterTotal
                
                filterMapActivityFeed(this.defaultFilter)
                this.$emit('filter-set', this.filterPros)
                return
            },
            selectDates(){
                if(this.selectDate.length > 2 ) return
                if(this.selectDate.length === 2){
                    this.selectDate.sort((a,b) => a - b)
                    this.filterPros.EDIT_DT = `${this.selectDate[0].toLocaleDateString('en-US')} - ${this.selectDate[1].toLocaleDateString('en-US')}`
                    this.isDate = false
                    return
                }
                this.filterPros.EDIT_DT = `${this.selectDate[0].toLocaleDateString('en-US')}`
                return
            },
            closeDateChip(){
                this.selectDate = null
                this.filterPros.EDIT_DT = null
                return
            }

        },
        watch:{
            currentYear:{
                handler: function(){
                    if(this.currentYear){
                        this.selectDate = []
                        this.filterPros.EDIT_DT = null
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
        left: calc(74px + 50vh);
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

</style>
