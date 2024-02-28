<template>
    <div>
        <v-card id="filterFeed" >
            <div class="cardDiv regain">
                <v-card-title style="position: relative; bottom:.5rem;">Filter Activity Feed</v-card-title>
                <v-row no-gutters >
                    <v-select :items="filterSort" item-title="title" style="position: relative;" density="compact" label="Sort" variant="underlined" v-model="filterPros.CREATE_DT"></v-select>
                </v-row>
              
                <v-row no-gutters dense >
                    <v-select :items="filterJobType" multiple chips closable-chips density="compact" label="Job Type" variant="underlined" v-model="filterPros.JB_TYPE">
                    </v-select>
                </v-row>
            
                <v-row no-gutters dense >
                    <v-select label="Date" chips closable-chips variant="underlined" density="compact" v-model="filterPros.EDIT_DT" ></v-select>
                </v-row>
                
                <v-row no-gutters dense>
                        <v-select :items="filterStatus" item-title="name" item-value="value" label="Status" return-object chips closable-chips multiple variant="underlined" density="compact" v-model="filterPros.STAT">
                        </v-select>
                </v-row>
       
                <v-row no-gutters dense >
                    <v-select :items="filterActivity" label="Activity" chips closable-chips variant="underlined" density="compact" v-model="filterPros.ACTV"></v-select>
                </v-row>

                <v-row no-gutters dense > 
                    <v-select :items="filterDistrict" item-title="name" item-value="value" return-object multiple label="District" chips closable-chips variant="underlined" density="compact" v-model="filterPros.DIST_NM"></v-select>
                </v-row>
                <v-row no-gutters dense >
                    <v-select :items="filterCounty" item-title="name" item-value="value" return-object multiple label="County" chips closable-chips variant="underlined" density="compact" v-model="filterPros.CNTY_NM"></v-select>
                </v-row>
                <v-row no-gutters dense >
                    <v-select :items="filterUser" item-title="value" item-value="value" return-object label="Users" multiple chips closable-chips variant="underlined" density="compact" v-model="filterPros.GIS_ANALYST"></v-select>
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
                             {title: "Date: Newest to Oldest", sortType: "asc"}, 
                             {title: "Date: Oldest to Newest", sortType: "desc"},
                             {title: "Status: Ascending", sortType: "asc"}, 
                             {title: "Status: Descending", sortType: "desc"}
                            ],
                filterJobType: ["Roadway Edit and Asset Update", "Asset Only", "Basemap"],
                filterStatus: appConstants.statDomainValues,
                filterActivity: ["Stuff 1", "Stuff 2"],
                filterDistrict: appConstants.districtDomainValues,
                filterCounty: appConstants.countyDomainValues,
                filterUser: appConstants.defaultUserValue,
                numFilters: 0,
                defaultUser: '',
                defaultStatus: ["Not Started", "In Progress", "Not Ready", "On Hold"],
                defaultSort: "Date: Newest to Oldest",
                defaultFilter: {"CREATE_DT": "Date: Newest to Oldest", "JB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": appConstants.defaultUserValue, 
                         "filterTotal": 3}
            }
        },
        mounted(){
            console.log(appConstants.statDomainValues)
        },
        methods:{
            cancelFilter(){
                this.calcFilterDiff()
                this.$emit('filter-set', this.filterPros)
            },
            setFilterNumber(){
                this.calcFilterDiff()
                this.$emit('filter-set', this.filterPros)
                filterMapActivityFeed(this.filterPros)
            },
            addNumFilter(){
                this.numFilters++
            },  
            calcFilterDiff(){
                const filterValues = Object.values(this.filterPros).filter(x => x)
                console.log(this.filterPros)
                filterValues.forEach((x) => {
                    if(x.length){
                        this.addNumFilter()
                    }
                })
                this.filterPros.filterTotal = this.numFilters
            },
            restoreDefault(){
                this.defaultUser = this.filterPros.loggedInUser
                console.log(this.defaultUser)
                filterMapActivityFeed(this.defaultFilter)
                this.$emit('filter-set', this.defaultFilter)
            },

        },

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
        position: relative;
        min-height: 44vh;
        max-height: 90vh;
        overflow-y: auto;
    }

    .v-row{
        /* margin-bottom: 0% !important;
        margin-top: 0% !important;
        padding-bottom: 0% !important;
        bottom: 1rem !important;
        position: relative;
        height: 44px !important; */
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
