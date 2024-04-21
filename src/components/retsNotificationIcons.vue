<template>
    <div style="position:relative; float:right; font-size: 11px; bottom: 5px;">
        <v-tooltip text="Assigned to you" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-account-multiple-check" color="white" v-if="rets.attributes.mdiaccountmultiplecheck === true" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

        <v-tooltip text="MO/TxDOT Connect" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-account-group" color="white" v-if="rets.attributes.mdiaccountgroup === true" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

        <v-tooltip text="District Request" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-pencil-box-outline" color="white" v-if="rets.attributes.mdipencilboxoutline === true" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

        <v-tooltip text="Deadline set (with date)" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-alarm" :color="rd.attributes['mdialarm'].color" v-if="rets.attributes['mdialarm'].bool" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

        <v-tooltip text="Job Complete" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-check-decagram-outline" color="green" v-if="rets.attributes.mdicheckdecagramoutline === true" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

        <v-tooltip text="No activity for (# days)" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-timer-sand" color="" v-if="rets.attributes.mditimersand === true" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

        <v-tooltip text="Priority Job" location="top">
            <template v-slot:activator="{props}">
                <v-icon icon="mdi-exclamation" color="red" v-if="rets.attributes.mdiexclamation === true" class="cardPRIO" v-bind="props"></v-icon>
            </template>
        </v-tooltip>

    </div>
</template>

<script>
    export default{
        name: "RetsNotification",
        props:{
            rets: Object
        }
    }
</script>

<style scoped>

</style>