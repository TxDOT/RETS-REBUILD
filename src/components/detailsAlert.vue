<template>
    <!-- <v-alert max-width="550" v-model="store.isAlert" border="start" :border-color="store.alertTextInfo.color" class="detailsAlert" :color="store.alertTextInfo.color" closable variant="tonal" :type="store.alertTextInfo.type">
        <span >{{ store.alertTextInfo.text }}</span>
    </v-alert> -->
    <div style="overflow-y: auto; height: auto; max-height: 100vh;">
         <v-alert v-for="value in store.alertObject" :border-color="store.alertObject.color" :color="value.color" :type="value.type" closable variant="tonal" class="detailsAlert" border="start" max-width="550" width="527">
            <span id="alerttext">{{value.text}} </span>
        </v-alert>
    </div>

   
</template>

<script>
import {store} from './store'
    export default{
        name: "detailsAlert",
        data(){
            return{
                store,
                isHandling: false
            }
        },
        mounted(){
            this.timeoutAlert()
        },
        updated(){
               this.timeoutAlert()
        },
        methods: {
           async timeoutAlert(){  
                if (this.isHandling){
                    return
                } 
                this.isHandling = true;

                for (let i = 0; i < store.alertObject.length; i++) {
                    const item = store.alertObject[i];
                    if (item.type === "success" || store.alertTextInfo.text === 'Rets not found try again.') {
                        await this.delay(3000);
                        store.alertObject.splice(i, 1)
                        i--
                    }
                    
                }
                        
                this.isHandling = false;

               
                return
            },
            async delay(milseconds){
                return new Promise(resolve => {setTimeout(() => { resolve('') }, milseconds)})
            }

        },
        watch: {
            'store.alertTextInfo': {
                handler: function(n) {
                    // const existing = (store.alertObject).some(
                    //     (item) => item.text === 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.'
                    // );
                    // if (existing && store.alertTextInfo.text === 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.'){
                    //     return
                    // }
                    // console.log(n)
                    if (!store.alertObject.some(item => item.text === store.alertTextInfo.text) || store.alertTextInfo.text === 'Rets not found try again.'){
                        store.alertObject.push(n)

                    }

   
                          
                    return

                },
                immediate:true
            },
            'store.isDetailsPage': {

                handler: function(){
                    if (!store.isDetailsPage){

                        store.alertObject.forEach((val, index) => {
                            if (val.type != "success"){
                                store.alertObject.splice(index, 1)
                            }
                        })
                    }
                   
                    
                    return
                },
                immediate:true

            }
            
            
        }


    }
</script>

<style scoped>
    .detailsAlert{
        display: flex;
        justify-content: left;
        align-items: center;
        text-align: left;
        min-height: fit-content;
        margin-bottom: 10px;
    }

    .detailsAlert :deep(.v-alert__underlay){
        opacity: .4 !important;
        
    }

    .detailsAlert :deep(.v-alert__close){
        position: absolute;
        right:15px;
    }

    .detailsAlert :deep(.v-alert__content){
        width: 85%;
    }

    #alerttext{
        position: relative; 
        font-size: 15px;
        opacity: 1;
        text-shadow: black 1px 1px 1px ;
        font-weight: bolder;
    }
</style>