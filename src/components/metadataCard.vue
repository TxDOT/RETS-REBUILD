<template>
    <div style="font-size: 0px !important; margin-right: 10px; margin-left: 10px;"> 
        <v-row >
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="Assigned To" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.ASSIGNED_TO"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="GIS Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.GIS_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="Asset Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.GRID_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="userRole" item-title="name" item-value="value" label="District Editor" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.DIST_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="districtMetadata" item-title="name" item-value="value" label="District" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.DIST_NM"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="countyMetadata" item-title="name" item-value="value" label="County" flat variant="underlined" density="compact" rounded="0" v-model="store.retsObj.attributes.CNTY_NM"></v-autocomplete>
        </v-row>

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
            }
        },
        mounted(){

        },
        methods:{
            returnUserName(){

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