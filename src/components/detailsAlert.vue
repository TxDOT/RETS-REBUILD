<template>
    <v-alert max-width="550" v-model="store.isAlert" border="start" :border-color="store.alertTextInfo.color" class="detailsAlert" :color="store.alertTextInfo.color" closable variant="tonal" :type="store.alertTextInfo.type">
        <span style="position: relative; display: flex; justify-content: left; padding-bottom: 0px; font-size: 15px;">{{ store.alertTextInfo.text }}</span>
    </v-alert>
</template>

<script>
    import {store} from './store'
    export default{
        name: "detailsAlert",
        data(){
            return{
                store
            }
        },


    }
</script>

<style scoped>
    .detailsAlert{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: left;
        min-height: fit-content;
        right: 50vh;
    }

    .detailsAlert :deep(.v-alert__underlay){
        opacity: .3 !important;
        
    }

    .detailsAlert :deep(.v-alert__content){
        opacity: 1;
        text-shadow: black .5px .5px .5px ;
    }
</style>