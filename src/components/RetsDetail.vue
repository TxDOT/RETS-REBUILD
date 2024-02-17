<template>
    <!-- details section -->
    <div id="container-div">
        <v-card id="details-page" style="padding-bottom: 26.5rem; font-size: 1px !important;">
            <div class="cardDiv" style="position: relative; top: 1rem;"> 
                <v-btn-toggle selected-class="active-button" variant="plain" mandatory v-model="isBtnSet">
                    <v-btn flat class="secondary-button" @click="this.isDetails = true; this.isMetadata = false">Details</v-btn>
                    <v-btn flat class="secondary-button" @click="this.isMetadata = true; this.isDetails = false">Metadata</v-btn>
                </v-btn-toggle>
        
                <DetailsCard v-if="isDetails" :infoRets="retsInfo" :taskGem="sendGemTaskNum"/>
                <MetadataCard v-if="isMetadata" :infoRets="retsInfo"/>

            </div>
        </v-card>
        <div class="gem-search">
            <v-icon icon="mdi-magnify" id="gem-search-icon"></v-icon>
            <input type="text" id="gem-id">
            <span id="show-gem-tasks" v-for="i in gemTask">
                <span class="gem-task" @click="addGemChip(i)">{{ i }}</span>
            </span>
        </div>
        <v-divider></v-divider>
        <!-- history section -->
        <div>

            <v-card class="history-card">
                <v-card-title >History</v-card-title>
                <v-text-field class="search-history" label="Search..." rounded="0" prepend-inner-icon="mdi-magnify" density="compact"></v-text-field>
                <div class="cardDiv">
                    <v-row v-for="(note, i) in histNotes" :key="i" style="padding-bottom: 1rem;">
                        <v-banner v-model="note[i]" id="history-notes" density="compact">
                            <v-banner-text>
                                {{ note.notes }} <span style="font-size: 10px; color: grey;">{{ note.author }} {{ note.time }}</span>
                            </v-banner-text>

                            <template v-slot:actions v-if="note.USER_TAG === 0">
                                <v-btn icon="mdi-pencil" style="bottom: 15px;" @click="openNote(note.notes, i)"></v-btn>
                            </template>
                        </v-banner>
                    </v-row>
                </div>
            </v-card>
        </div>
        <div id="trigger-buttons">
            <v-btn-toggle>
                <v-btn variant="plain" flat>Delete</v-btn>
                <v-btn class="secondary-button" variant="plain" flat>Cancel</v-btn>
                <v-btn @click="sendToParent" variant="elevated">Save</v-btn>
            </v-btn-toggle>
        </div>
    </div>
    <v-container v-if="editText" style="position: absolute; bottom: 50%; left: 70vh; background-color:black">
        <v-textarea variant="filled" lable="label" auto-grow v-model="editNotes" label="Make a Comment"></v-textarea>
        <!-- <v-btn-toggle style="position:relative; float:right; left: 12px;"> -->
            <v-btn variant="plain" @click="deleteNote">Delete</v-btn>
            <v-btn variant="plain" @click="closeNote">Cancel</v-btn>
            <v-btn variant="outlined" class="main-button-style" @click="saveNote">Save</v-btn>
        <!-- </v-btn-toggle> -->

    </v-container>

</template>

<script>
    import editHistoryNotes from './EditHistoryNotes.vue'
    import DetailsCard from './detailsCard.vue'
    import MetadataCard from './metadataCard.vue'
    import {getGEMTasks} from './utility.js'
    export default{
        name: "RetsDetailPage",
        components: {editHistoryNotes, DetailsCard, MetadataCard},
        props: {
            retsInfo: Object,
            taskGem: Number 
        },
        emits:['close-detail'],
        data(){
            return{
                isDetails: true,
                isMetadata: false,
                activityList: ['CRI', 'GSC Review', 'HPMS Sample Review', 'Interstate Project', 'Minute Order', 
                               'OSOSRE', 'Proposed FC', 'Recover Minute Order', 'ROW Crowdsource', 'Sprint 1',
                               'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Toll', 'TxDOTConnect', 'Urban Area Interaction'],
                isBtnSet: 0,
                relatedRets: ["Not Started", "On Hold", "Completed"],
                histNotes: [{notes: "please  make sure this gets done before the EOM", author: "cbardash", time: "10/29/2023",  USER_TAG: 0}, 
                            {notes: "Priority field updated", author: "cbardash", time: "10/29/2023", USER_TAG: null}],
                editText: false,
                editNotes: '',
                noteIndex: 0,
                gemTask: [],
                sendGemTaskNum: null
            }
        },
        mounted(){
            console.log(this.retsInfo)
            const gem = document.getElementById('gem-id')
            gem.addEventListener("keyup", (event) =>{
                if(event.target.value.length > 1){
                    this.proccessGEMTasks()
                    return
                }
            })
        },
        methods:{
            sendToParent(){
                this.$emit('close-detail', false)
            },
            openNote(note, index){
                this.editText = true
                this.editNotes = note
                this.noteIndex = index
            },
            closeNote(){
                this.editText = false
            },
            saveNote(){
                this.histNotes[this.noteIndex].notes = this.editNotes
                this.editText = false
            },
            deleteNote(){
                this.histNotes.splice(this.noteIndex, 1)
                this.editText = false
            },
            proccessGEMTasks(){
                const returnGEMTasks = getGEMTasks()
                //returns array
                this.gemTask = []
                returnGEMTasks.forEach(gem => this.gemTask.push(gem))
            },
            addGemChip(gemId){
                this.sendGemTaskNum = gemId
            }
        }
    }
</script>

<style scoped>
.cardDiv .v-btn-toggle{
    position: relative !important;
    bottom: 1rem !important;
}
#details-page{
    position: relative;
    height: 400px !important;
    width: 100% !important;
    bottom: 1rem;
    border-radius: 0px;
}
#container-div{
    position: relative;
    top: 8.2rem;
    height: 890vh;
    min-height: 0% !important;
    max-height: 90% !important;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    padding-bottom: 50px !important;
}

.number-field{
    position: relative;
    padding-left: 4rem;
    width: 16vh;
    left: 24%;
    font-size: 20vh;
}

.number-field-icon{
    font-size: 18px;
    top: .2rem
}

.dropdwn-field{
    position: relative;
    left: 19px;
    padding: 0% !important;
}

#trigger-buttons{
    position: relative;
    /* top: 1vh; */
    left: 14px;
    padding-bottom: 1rem;
    width: 100%;
    justify-content: right;
    display: flex;
    flex-direction: row;
}

.v-btn{
    margin-right: 15px;
}

.new-proposed-route{
    font-size: 10px !important;
    position: relative;
    bottom: 58px;
}
.v-row{
    margin: 0% !important;
    padding-right: 0% !important;
}

.checkbox-size{
    font-size: 10px !important;
}

#zoom-to-select-rets{
    position: relative;
    left: 1px;
    padding: 0px;
    margin: 0px;
}

#history-notes{
    border-left: 3px solid #4472C4 !important;
    position: relative;
    bottom: 2rem !important;
    border-radius: 0%;
    width: 100%;
    margin: 0%;
    padding: 1%;
    padding-left: 1rem;
}

.text-field{
    line-height: 5px !important;

}

.history-card{
    position:relative; 
    height: 16.5rem; 
    bottom: 0.5rem; 
    border-radius: 0%; 
    overflow-y: auto;
}

.search-history{
    position:relative; 
    bottom: 13px; 
    margin-left: 10px; 
    margin-right: 10px;
}
#edit-comment{
    position: absolute;
    bottom: 55vh;
    left: 60vh;
}
#gem-id{
    position: relative;
    left: 8px;
    padding: 7px;
    height: 15px;
    width: 80%;
    border-bottom: 1px solid white;
    outline: 0;
    font-size: 12px;
    text-align: center;
}

#gem-id:focus{
    outline: none;
}

#gem-search-icon{
    top: 0.2rem;
    margin-left: 5px;
    position: absolute;
    font-size: 18px;
}


</style>