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
                    // console.log(store.alertObject[0].text)
                    // if (store.alertObject[0].text === 'No Route has been detected'){
                    //     return
                    // }
                    store.alertObject.shift()
                }, 10000);

                // setTimeout(() => {
                //    store.alertObject.forEach(element => {
                //     console.log(element.)
                //    });
                // }, 10000);
                // setTimeout(() => {
                   
                    
                
                // }, 5000);
                
            }

        },
        watch: {
            'store.alertTextInfo': {
                handler: function() { 
                    if (store.alertTextInfo.text  ==='No Route has been detected'){
                        console.log("error")
                        return
                    }
                    store.alertObject.push({
                        'color' : store.alertTextInfo.color,
                        'type' : store.alertTextInfo.type,
                        'text' : store.alertTextInfo.text 
                    })
                    this.timeoutAlert()
                    return

                },
                immediate:true
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
        opacity: .3 !important;
        
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
        text-shadow: rgb(73, 70, 70) 0px -1px 0px ;
        font-weight: bolder;
    }
</style>