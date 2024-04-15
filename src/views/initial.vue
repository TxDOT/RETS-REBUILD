<template>
    <div id="initialLoad">
        <v-progress-circular
        :size="70"
        :width="7"
        color="#4472C4"
        indeterminate
        ></v-progress-circular>
    </div>

</template>

<script>

export default{
    name: "Initial"
}
</script>

<style scoped>
    #initialLoad{
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        position: relative;
    }
</style>