<template>
    <div id="details-page" style="padding-bottom: 26.5rem; font-size: 1px !important;"> 
        <v-row>
            <v-autocomplete label="Assigned To" flat variant="underlined" density="compact" rounded="0" v-model="infoRets.GIS_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete label="GIS Editor" flat variant="underlined" density="compact" rounded="0" v-model="infoRets.GIS_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete label="Asset Editor" flat variant="underlined" density="compact" rounded="0" v-model="infoRets.GRID_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete label="District Editor" flat variant="underlined" density="compact" rounded="0" v-model="infoRets.DIST_ANALYST"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="districtMetadata" item-title="name" item-value="value" return-object label="District" flat variant="underlined" density="compact" rounded="0" v-model="infoRets.DIST_NM"></v-autocomplete>
        </v-row>
        <v-row>
            <v-autocomplete :items="countyMetadata" item-title="name" item-value="value" label="County" flat variant="underlined" density="compact" rounded="0" v-model="infoRets.CNTY_NM"></v-autocomplete>
        </v-row>
    </div>
</template>

<script>
 
    import {appConstants} from '../common/constant.js'

    export default{
        name: "MetadataCard",
        props: {
            infoRets: Object
        },
        data(){
            return{
                districtMetadata: appConstants.districtDomainValues,
                countyMetadata: appConstants.countyDomainValues
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
}

.checkbox-size{
    font-size: 10px !important;
}
.v-btn{
    margin-right: 15px;
}

.v-autocomplete{
    background-color: rgba(0,0,0,0) !important;
}
</style>