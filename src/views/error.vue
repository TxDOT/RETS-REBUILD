<template>
    <div class="flex">
        <div class="flex-row">
            <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnh4M3U0bmZlY3FiaHZ3YmcybmN0Y3I5djEwbXM3bWYzOGk1cXloayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CFoC5Mj6I9kC4/giphy.gif"/>
        </div>
        <div class="flex-row">
            <h1>Ooops there was an issue accessing the RETS application. Contact system admin.</h1>
        </div>
        <div class="flex-row">
            <v-btn @click="goBack()">Back to Login Page</v-btn>
        </div>

    </div>

</template>

<script>

    export default{
        name: "ErrorPage",
        methods:{
            goBack(){
                window.sessionStorage.removeItem("esriJSAPIOAuth")
                location.reload()
            }
        }
    }
</script>

<style scoped>
    .flex{
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-content: center;
    }
    .flex-row{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>