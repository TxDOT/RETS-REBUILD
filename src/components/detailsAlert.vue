<template>
    <v-alert v-model="alert" border="start" :border-color="borderColor" :text="borderText" closable id="detailsAlert"></v-alert>
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
                },
                immediate: true
            }
        }
    }
</script>

<style scoped>
    #detailsAlert{
        position: absolute;
        top:6rem;
        z-index: 9999;
        width: 100%;
        border-radius: 0%;
        background-color: rgba(84,130,53);
        height: 59px;
    }
</style>