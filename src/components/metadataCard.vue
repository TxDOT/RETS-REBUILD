<template>
    <div style="font-size: 0px !important; margin-right: 10px; margin-left: 10px; display: flex; flex-direction: column; position: relative; height: 100%; bottom: 0px;"> 
        <v-row style="position: relative; bottom: 0px;">
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="Assigned To" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.ASSIGNED_TO" @update:modelValue="onDropDownChange(store.retsObj.attributes.ASSIGNED_TO)"></v-autocomplete>
        </v-row>
        <v-row style="position: relative; top: 2px;">
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="GIS Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.GIS_ANALYST" @update:modelValue="onDropDownChange()" :rules="[emptyRow.required]"></v-autocomplete>
        </v-row>
        <v-row style="position: relative; top: 4px;">
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="Asset Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.GRID_ANALYST" @update:modelValue="onDropDownChange(store.retsObj.attributes.GRID_ANALYST)" :rules="[emptyRow.required]"> </v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete multiple ref="dropdown" :items="['   ', ...userRole]" item-title="name" item-value="value" label="District Editor" flat variant="underlined" density="compact" rounded="0" :model-value="store.retsObj.attributes.DIST_ANALYST ? store.retsObj.attributes.DIST_ANALYST.split(' ') : null" @update:modelValue="value => { store.retsObj.attributes.DIST_ANALYST = value.join(' '); onDropDownChange(store.retsObj.attributes.DIST_ANALYST); }" :rules="[emptyRow.required]"></v-autocomplete>
        </v-row>
        <v-row style="position: relative; top: 8px;">
            <v-autocomplete :items="districtMetadata" item-title="name" item-value="value" label="District" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.DIST_NM" @update:modelValue="onDropDownChange(store.retsObj.attributes.DIST_NM)" :rules="[emptyRow.required]"></v-autocomplete>
        </v-row>
        <v-row style="position: relative; top: 10px;">
            <v-autocomplete :items="countyMetadata" item-title="name" item-value="value" label="County" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.CNTY_NM" @update:modelValue="onDropDownChange(store.retsObj.attributes.CNTY_NM)" :rules="[emptyRow.required]"></v-autocomplete>
        </v-row>
        <div style="position: relative; top: 12px; margin-left: 6px;">
            <v-text-field variant="plain" disabled density="compact">Created {{ createDate }} by {{createName}}</v-text-field>
        </div>
    </div>
</template>

<script>

import {appConstants} from '../common/constant.js'
    import {store} from './store.js'
    export default{
        name: "MetadataCard",
        data(){
            return{
                districtMetadata: appConstants.districtDomainValues,
                countyMetadata: appConstants.countyDomainValues,
                userRole: appConstants.userRoles,
                store,
                emptyRow:{
                    required: value => !!value || "Empty value is not allowed",
                },
                createName: "",
                createDate: "",
            }
        },
        mounted(){
            this.createName = store.retsObj.attributes.CREATE_NM
            this.createDate = store.retsObj.attributes.CREATE_DT.split(",")[0]
        },
        methods:{
            onDropDownChange(){
                console.log(store.retsObj.attributes.DIST_ANALYST)
                const metadataFieldPass = this.checkMetadatFields()

                // for (var item in store.retsObj.attributes.DIST_ANALYST){
                //     if (store.retsObj.attributes.DIST_ANALYST[item] === null){
                //         //store.retsObj.attributes.DIST_ANALYST = null
                //         this.$refs.dropdown.reset()
                //         this.$refs.dropdown.blur()

                //     }
                    
                // }
                if (store.retsObj.attributes.DIST_ANALYST.includes('   ')){
                    console.log("cjecl")
                    this.$refs.dropdown.reset()
                    this.$refs.dropdown.blur()
                }
                store.isSaveBtnDisable = metadataFieldPass
                return 
            },
            isEmptyRow(a){
                store.isSaveBtnDisable = true
              
                return "Empty value is not allowed"
            },
            checkMetadatFields(){
                const fieldsToCheck = [
                    store.retsObj.attributes.GIS_ANALYST, store.retsObj.attributes.GRID_ANALYST, 
                    store.retsObj.attributes.DIST_ANALYST, store.retsObj.attributes.DIST_NM, 
                    store.retsObj.attributes.CNTY_NM
                ]

                if(!store.retsObj.attributes.NO_RTE){
                   const pushItemsToCheckArr = [store.retsObj.attributes.DFO, store.retsObj.attributes.RTE_NM, store.retsObj.attributes.STAT, store.retsObj.attributes.DESC_]
                   fieldsToCheck.push(...pushItemsToCheckArr)
                }
                const isLength = fieldsToCheck.some((x) => !x)
                return isLength
            }

        }
    }
</script>

<style scoped>
.v-row{
    position: relative;
    margin: 0% !important;
    padding-right: 0% !important;
    padding: 0px !important; 
    margin-right: 5px !important;
    margin-left: 5px !important; 
}

.v-autocomplete{
    background-color: rgba(0,0,0,0) !important;
}
</style>