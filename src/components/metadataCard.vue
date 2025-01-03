<template>
    <div style="display: flex; flex-direction: column; position: relative; height: 90%; gap: 0px; padding-left: 10px; padding-right: 10px;"> 
        <div class="item">
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="Assigned To" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.ASSIGNED_TO" @update:modelValue="onDropDownChange(store.retsObj.attributes.ASSIGNED_TO)"></v-autocomplete>
        </div>
        <div class="item">
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="GIS Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.GIS_ANALYST" @update:modelValue="onDropDownChange()" :rules="[emptyRow.required]"></v-autocomplete>
        </div>
        <div class="item">
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="Asset Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.GRID_ANALYST" @update:modelValue="onDropDownChange(store.retsObj.attributes.GRID_ANALYST)" :rules="[emptyRow.required]"> </v-autocomplete>
        </div>
        <div class="item">
            <v-autocomplete multiple ref="dropdown" :items="['Clear All', ...userRole]" item-title="name" item-value="value" label="District Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.DIST_ANALYST" @update:modelValue="onDropDownChange(store.retsObj.attributes.DIST_ANALYST);" :rules="[emptyRow.required]">
                <template v-slot:selection="{ item, index }">
                    <span v-if="index < 3">{{ item.title }}
                        <span v-if="(store.retsObj.attributes.DIST_ANALYST.length - 1) !== index">,</span>
                    </span>

                    <span v-if="index === 3"> +{{ store.retsObj.attributes.DIST_ANALYST.length }}</span>
                </template>
            </v-autocomplete>
        </div>
        <div class="item">
            <v-autocomplete :items="districtMetadata" item-title="name" item-value="value" label="District" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.DIST_NM" @update:modelValue="onDropDownChange(store.retsObj.attributes.DIST_NM)" :rules="[emptyRow.required]"></v-autocomplete>
        </div>
        <div class="item">
            <v-autocomplete :items="countyMetadata" item-title="name" item-value="value" label="County" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.CNTY_NM" @update:modelValue="onDropDownChange(store.retsObj.attributes.CNTY_NM)" :rules="[emptyRow.required]"></v-autocomplete>
        </div>
        <div class="item">
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
            store.retsObj.attributes.DIST_ANALYST = typeof store.retsObj.attributes.DIST_ANALYST === "string" ? store.retsObj.attributes.DIST_ANALYST.split(",") : store.retsObj.attributes.DIST_ANALYST
            store.retsObj.attributes.GRID_ANALYST = store.retsObj.attributes.GRID_ANALYST.toUpperCase()
            store.isEmptyRow = this.emptyRow.required
        },
        methods:{
            onDropDownChange(){
                const metadataFieldPass = this.checkMetadatFields()
                if (store.retsObj.attributes.DIST_ANALYST.includes('Clear All')){
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
                    store.retsObj.attributes.DIST_ANALYST.length || null, store.retsObj.attributes.DIST_NM, 
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
.v-autocomplete{
    background-color: rgba(0,0,0,0) !important;
}
:deep(.v-input__details){
    min-height: 1px !important;
}
:deep(.v-messages){
    min-height: 1px !important;
}
.districtEditors{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.texter:last-of-type::after{
    content: "a" !important;
}
</style>