<template>
    <v-card class="roadExist" v-if="store.closeIsRoadExist">
        <div style="position: relative; width: 100%;">
            <v-card-title style="float: left; position: relative;">Road Does Not Exist</v-card-title>
        </div>
        <hr class="popup-title-border" style="width: 95%; bottom: 5px;"></hr>
        <v-card-text>Howdy! The route field contains a route that does not exist. If this is intentional,
                     select "Check for new or proposed route".
        </v-card-text>
        <hr class="popup-title-border" style="width: 95%; bottom: 0px;"></hr>
        <div style="position: relative; width: 100%; padding-top: 10px;">
            <v-btn @click="closeCard" style="position: relative; float: right;" class="main-button-style">close</v-btn>
        </div>
        
    </v-card>
</template>

<script>
    import {store} from './store.js'
    export default{
        name: "IsRoadExist",
        data(){
            return{
                road: "",
                store
            }
        },
        methods:{
            closeCard(){
                store.closeIsRoadExist = false
            }
        }
    }
</script>

<style scoped>
    .roadExist{
        width: 25%;
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        left: 50%;
        top: 40%;
        padding-bottom: 10px;
        border-radius: 0%;
    }
</style>