<template>
    <!-- details section -->
    <detailsAlert v-if="isAlert" :alertsTextInfo="alertTextInfo"/>
    <div id="container-div">
        
        <v-card id="details-page">
            <div class="cardDiv"> 
                <v-btn-toggle selected-class="active-button" variant="plain" mandatory v-model="isBtnSet">
                    <v-btn flat class="secondary-button" @click="this.isDetails = true; this.isMetadata = false">Details</v-btn>
                    <v-btn flat class="secondary-button" @click="this.isMetadata = true; this.isDetails = false">Metadata</v-btn>
                </v-btn-toggle>
        
                <DetailsCard v-if="isDetails" :infoRets="retsInfo" :taskGem="sendGemTaskNum"/>
                <MetadataCard v-if="isMetadata" :infoRets="retsInfo"/>

            </div>
        </v-card>
        <div class="gem-search" >
            <v-icon icon="mdi-magnify" id="gem-search-icon"></v-icon>
            <input type="text" id="gem-id">
            <span id="show-gem-tasks" v-for="i in gemTask">
                <span class="gem-task" @click="addGemChip(i)">{{ i }}</span>
            </span>
        </div>
        <!-- history section -->
        <div >
            <v-card class="history-card">
                <v-card-title >History</v-card-title>
                <v-text-field class="search-history" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" density="compact" v-model="searchHistoryFilter"></v-text-field>
                <div class="cardDiv">
                    <v-row v-for="(note, i) in histNotes" :key="i" style="padding-bottom: 1rem;" :id="note.index">
                        <v-banner v-model="note[i]" id="history-notes" density="compact" :id="note.index">
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
        <div>
            <div style="position: relative; float: left; margin-left: 10px; font-size: 11px; display: flex; flex-wrap: wrap;">
                <v-checkbox label="Asset Only Job" density="compact"></v-checkbox>
            </div>
            <v-btn-toggle id="trigger-buttons" density="compact">
                    <v-btn @click="deleteRets" variant="plain" flat size="small">Delete</v-btn>
                    <v-btn @click="sendToParent" class="secondary-button" variant="plain" flat size="small">Cancel</v-btn>
                    <v-btn @click="sendToParent" variant="elevated" class="main-button-style" size="small">Save</v-btn>
            </v-btn-toggle>
        </div>
    </div>
    <v-container v-if="editText" style="" id="commentDiv">
        <v-textarea variant="filled" auto-grow v-model="editNotes" label="Make a Comment"></v-textarea>
            <div style="position: relative; float: right; left: 13px;">
                <v-btn variant="plain" @click="deleteNote" class="secondary-button">Delete</v-btn>
                <v-btn variant="plain" @click="closeNote" class="secondary-button">Cancel</v-btn>
                <v-btn variant="outlined" class="main-button-style" @click="saveNote">Save</v-btn>
            </div>
    </v-container>

</template>

<script>
    import editHistoryNotes from './EditHistoryNotes.vue'
    import DetailsCard from './detailsCard.vue'
    import MetadataCard from './metadataCard.vue'
    import {getGEMTasks, searchCards} from './utility.js'
    import detailsAlert from './detailsAlert.vue'

    export default{
        name: "RetsDetailPage",
        components: {editHistoryNotes, DetailsCard, MetadataCard, detailsAlert},
        props: {
            retsInfo: Object,
            taskGem: Number,
            alertInfo: Object,
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
                histNotes: [{notes: "please  make sure this gets done before the EOM", author: "cbardash", time: "10/29/2023",  USER_TAG: 0, index: 0}, 
                            {notes: "Priority field updated", author: "cbardash", time: "10/29/2023", USER_TAG: null, index: 1}],
                editText: false,
                editNotes: '',
                noteIndex: 0,
                gemTask: [],
                sendGemTaskNum: null,
                isAlert: false,
                alertTextInfo: {"text": "Note Saved", "color": "#70ad47"},
                searchHistoryFilter: ''
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
            deleteRets(){
                this.retsInfo.isDelete = true
                this.$emit('close-detail', this.retsInfo)
            },
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
                this.histNotes[this.noteIndex].author = this.retsInfo.logInUser
                this.histNotes[this.noteIndex].time = new Date().toLocaleDateString('en-US')
                this.editText = false
                this.alertTextInfo = {"text": "Note Saved", "color": "#70ad47", "toggle": true}
                this.isAlert = true
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
            },
            closeGEMTask(){
                document.querySelectorAll(".gem-search")[0].style.display = "none"
            }
        },
        watch:{
            searchHistoryFilter:{
                handler: function(){
                    if(this.searchHistoryFilter.length){
                        searchCards(this.histNotes, this.searchHistoryFilter, "index")
                        return
                    }

                },
                immediate:true
            }
        }
    }
</script>

<style scoped>
.cardDiv .v-btn-toggle{
    position: relative !important;
    bottom: 1rem !important;
}

div .cardDiv{
    position: relative; 
    top: 1rem;
}

#commentDiv{
    position: absolute; 
    bottom: 50%; 
    left: 70vh; 
    background-color:black
}

#details-page{
    position: relative;
    height: 434px !important;
    bottom: .5rem;
    border-radius: 0px;
    padding-bottom: 26.5rem; 
    font-size: 1px !important;
    margin-right: 10px;
    margin-left: 10px;
}
#container-div{
    position: relative;
    top: 8.2rem;
    height: 890vh;
    min-height: 0% !important;
    max-height: 87% !important;
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
    padding-top: .5rem;
    position: relative;
    float: right;
}

.v-btn{
    margin-right: 10px;
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
    height: 18rem; 
    bottom: 0.2rem; 
    border-radius: 0%; 
    overflow-y: auto;
    margin-right: 10px;
    margin-left: 10px;
}

.search-history{
    position:relative; 
    bottom: 8px; 
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