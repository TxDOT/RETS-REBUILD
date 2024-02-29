<template>
    <v-alert v-model="alert" border="start" :border-color="borderColor" id="detailsAlert">
        <p style="position: relative; display: flex; justify-content: left; padding-bottom: 0px;">{{ borderText }}</p>
    </v-alert>
</template>

<script>
    export default{
        name: "detailsAlert",
        props:{
            alertsTextInfo: Object,
        },
        data(){
            return{
                borderColor: "#70ad47",
                borderText: "Hello",
                alert: true
            }
        },
        mounted(){
            console.log(this.alertsTextInfo)

        },
        // methods:{
        //     test(){
        //         
        //     }
        // },
        watch:{
            alertsTextInfo:{
                handler: function(){
                    this.borderColor = this.alertsTextInfo.color
                    this.borderText = this.alertsTextInfo.text
                    this.alert = this.alertsTextInfo.toggle

                    setTimeout(()=>{
                        this.alert = false
                    },2000)
                },
                immediate: true
            }
        }
    }
</script>

<style scoped>
    #detailsAlert{
        position: absolute;
        top:6.2rem;
        z-index: 9999;
        border-radius: 0%;
        background-color: rgba(84,130,53);
        height: 44px;
        margin: 10px;
        width: 95.5%;
    }
</style>