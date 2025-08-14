<template>
    <!-- <v-alert max-width="550" v-model="store.isAlert" border="start" :border-color="store.alertTextInfo.color" class="detailsAlert" :color="store.alertTextInfo.color" closable variant="tonal" :type="store.alertTextInfo.type">
        <span >{{ store.alertTextInfo.text }}</span>
    </v-alert> -->
    <div>

         <v-alert v-for="value in store.alertObject"  :border-color="store.alertObject.color" :color="value.color" :type="value.type" closable variant="tonal" class="detailsAlert" border="start" max-width="550" width="527" >
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
                store
            }
        },
        methods: {
            async timeoutAlert(){
                setTimeout(() => {
                    if (store.alertObject.length && store.alertObject.at(0).text !== 'No Route has been detected' && store.alertObject.at(0).text !== 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.'){
                        store.alertObject.shift()
                    }
                    else{
                        store.alertObject.splice(1,1)
                    }
                  }, 10000);
                 return
                
            }

        },
        watch: {
            'store.alertTextInfo': {
                handler: function() { 
                    const existing = (store.alertObject).some(
                        (item) => item.text === 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.'
                    );
                    if (existing && store.alertTextInfo.text === 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.'){
                        return
                    }
                    store.alertObject.push({
                        'color' : store.alertTextInfo.color,
                        'type' : store.alertTextInfo.type,
                        'text' : store.alertTextInfo.text 
                    })
                    if (store.alertTextInfo.text != 'No Route has been detected' && store.alertTextInfo.text != 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.'){
                        this.timeoutAlert()
                    }
                  
                    return

                },
                immediate:true
            },
            'store.isSaveBtnDisable': {
                handler: function(){
                    // if (store.alertObject(0).text === 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.' && !store.isSaveBtnDisable){

                    // } 
                    if (store.isSaveBtnDisable){
                        for (let index = 0; index < store.alertObject.length; index++) {
                            if (store.alertObject.at(index).text === 'Route and/or DFO are not valid. Use the Move (icon) to move to a valid location.' || store.alertObject.at(index).text === 'No Route has been detected'){
                                store.alertObject.splice(index, 1)
                                
                            }
                        // continue
                        }
                    }
                    
                    return
                }
            },
            
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