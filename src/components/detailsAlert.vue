<template>
    <v-alert max-width="550" v-model="store.isAlert" border="start" :border-color="store.alertTextInfo.color" class="detailsAlert" :color="store.alertTextInfo.color" closable variant="tonal" :type="store.alertTextInfo.type">
        <span >{{ store.alertTextInfo.text }}</span>
    </v-alert>
    <!-- <div>

         <v-alert v-for="value in store.alertObject"  :border-color="store.alertObject.color" :color="value.color" :type="value.type" closable variant="tonal" class="detailsAlert" border="start" max-width="550" width="527" >
            <span style="position: relative; display: flex; justify-content: left; padding-bottom: 0px; font-size: 15px;">{{value.text}} </span>
        </v-alert>
    </div> -->

   
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
                    store.alertObject.shift()
                }, 10000);
            }

        },
        watch: {
            'store.alertTextInfo': {
                handler: function() { 
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
        justify-content: center;
        align-items: center;
        text-align: left;
        min-height: fit-content;
        margin-bottom: 10px;
    }

 
</style>