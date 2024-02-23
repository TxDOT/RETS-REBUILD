<template>
    <div>
        <v-card id="filterFeed" >
            <div class="cardDiv">
                <v-card-title style="position: relative; bottom:.5rem;">Filter Activity Feed</v-card-title>
                <v-row no-gutters>
                    <v-select :items="filterSort" item-title="title" style="position: relative;" density="compact" label="Sort" variant="underlined" v-model="sort" @update:modelValue="addNumFilter"></v-select>
                </v-row>
                <v-row no-gutters dense >
                    <v-select :items="filterJobType" item-title="title" density="compact" label="Job Type" variant="underlined" v-model="jobType" @update:modelValue="addNumFilter">
                        <template v-slot:chip="{item}">
                            <v-chip closable @click:close="subNumFilter(e)">{{ item.title }}</v-chip>
                        </template>
                    </v-select>
                </v-row>
                <v-row no-gutters dense >
                    <v-select label="Date" chips closable-chips variant="underlined" density="compact" v-model="date"></v-select>
                </v-row>
                <v-row no-gutters dense>
                    <v-select :items="filterStatus" label="Status" chips closable-chips variant="underlined" density="compact" v-model="status"></v-select>
                </v-row>
                <v-row no-gutters dense>
                    <v-select :items="filterActivity" label="Activity" chips closable-chips variant="underlined" density="compact" v-model="activity"></v-select>
                </v-row>
                <v-row no-gutters dense> 
                    <v-select label="District" chips closable-chips variant="underlined" density="compact" v-model="district"></v-select>
                </v-row>
                <v-row no-gutters dense>
                    <v-select label="County" chips closable-chips variant="underlined" density="compact" v-model="county"></v-select>
                </v-row>
                <v-row no-gutters dense>
                    <v-select label="Users" chips closable-chips variant="underlined" density="compact" v-model="users"></v-select>
                </v-row>

                <v-expansion-panels flat variant="Accordion">
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
                            <v-btn @click="setFilterNumber()" class="secondary-button" variant="plain">Cancel</v-btn>
                            <v-btn @click="setFilterNumber()" class="main-button-style" variant="outlined">Save</v-btn>
                        </div>
                    </div>

      

          

        </v-card>
    </div>
</template>

<script>
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
                filterStatus: ["Not Started", "In Progress", "Complete", "Not Ready", "On Hold"],
                filterActivity: ["Stuff 1", "Stuff 2"],
                numFilters: 0,
                sort: null,
                jobType: null
            }
        },
        mounted(){
            if(!this.filterPros) return

            console.log(this.filterPros)
            this.sort = this.filterPros.sort ?? null
            this.jobType = this.filterPros.jobType ?? null
            this.numFilters = this.filterPros.filterTotal ?? 0
        },
        methods:{
            setFilterNumber(){
                const filterObj = {"sort": this.sort, "jobType": this.jobType, "filterTotal": this.numFilters}
                this.$emit('filter-set', filterObj)
            },
            addNumFilter(e){
                this.numFilters++
                console.log(e)
                console.log(this.numFilters)
            },  
            subNumFilter(){
                this.numFilters--
                console.log(this.numFilters)
                console.log('clicked')
            }
        }
    }
</script>

<style scoped>
    #filterFeed{
        top: 57px;
        width: 18%;
        left: calc(74px + 50vh);
        display: flex;
        flex-direction: column;
        border-radius: 0%;
        position: absolute;
        min-height: 42vh;
        max-height: 80vh;
        overflow-y: auto;
    }

    .v-row{
        margin-bottom: 0% !important;
        margin-top: 0% !important;
        padding: 0% !important;
        bottom: 1rem !important;
        flex: none;
        position: relative;
        height: 44px !important;
    }

    .v-btn + .v-btn {
        margin-left: 10px;
    }
</style>
