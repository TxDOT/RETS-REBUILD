<template>
    <!-- details section -->
    <v-container id="container-div" bg-surface-variant mb-6>
        <v-card id="details-page">
            <v-btn-toggle selected-class="active-button" style="right: 15px;">
                <v-btn flat class="secondary-button">Details</v-btn>
                <v-btn flat class="secondary-button">Metadata</v-btn>
            </v-btn-toggle>
         
                <v-row align="start" no-gutters style="height: 150px;">
                    <v-col>
                        <v-autocomplete :items="activityList" label="Activity" variant="underlined" density="compact" flat class="dropdwn-field"></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-text-field label="Number" variant="underlined" class="number-field"></v-text-field>
                    </v-col>
                </v-row>
          
        </v-card>
    </v-container>
    <v-divider></v-divider>
    <!-- history section -->
    <div>
        <v-card>

        </v-card>
    </div>
    <div>
        <v-btn-toggle id="trigger-buttons">
            <v-btn variant="plain" flat>Delete</v-btn>
            <v-btn class="secondary-button" variant="plain" flat>Cancel</v-btn>
            <v-btn @click="sendToParent" variant="elevated">Save</v-btn>
        </v-btn-toggle>
    </div>

</template>

<script>
    export default{
        name: "RetsDetailPage",
        props: {
            retsInfo: Object 
        },
        emits:['close-detail'],
        data(){
            return{
                activityList: ['CRI', 'GSC Review', 'HPMS Sample Review', 'Interstate Project', 'Minute Order', 
                               'OSOSRE', 'Proposed FC', 'Recover Minute Order', 'ROW Crowdsource', 'Sprint 1',
                               'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Toll', 'TxDOTConnect', 'Urban Area Interaction']
            }
        },
        mounted(){
            console.log(this.retsInfo)
        },
        methods:{
            sendToParent(){
                this.$emit('close-detail', false)
            }
        }
    }
</script>

<style scoped>
#details-page{
    height: 30% !important;
    width: 100% !important;
    bottom: 0rem;
    border-radius: 0px;
}
#container-div{
    position: relative;
    top: 10rem;
    height: 80%;
    padding: 8px;
}

.number-field{
    position: relative;
    padding-left: 5rem;
    width: 10rem;
    left: 3rem;
}

.dropdwn-field{
    position: relative;
    left: 19px;
}

#trigger-buttons{
    position: relative;
    top: 1rem;
    left: 10.5rem;
}

.v-btn{
    margin-right: 15px;
}
</style>