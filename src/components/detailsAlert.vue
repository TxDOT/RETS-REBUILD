<template>
    <v-alert v-model="store.isAlert" border="start" :border-color="store.alertTextInfo.color" id="detailsAlert" :color="store.alertTextInfo.color" closable variant="tonal" :type="store.alertTextInfo.type">
        <p style="position: relative; display: flex; justify-content: left; padding-bottom: 0px; font-size: 15px;">{{ store.alertTextInfo.text }}</p>
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
        // methods:{
        //     test(){
        //         
        //     }
        // },

    }
</script>

<style scoped>
    #detailsAlert{
        position: absolute;
        top:6.2rem;
        z-index: 9999;
        opacity: 1 !important;
        height: 44px;
        margin: 10px;
        width: 95.5%;
        
    }
</style>