<template>
    <!-- details section -->
    <div id="detailsHeaderDiv">
        <div id="detailsHeaderIcon">
            <v-btn density="compact" flat @click="changeColor(store.retsObj.attributes.RETS_ID);" id="flagBtnDetails">
                <template v-slot:prepend>
                    <v-icon size="25px" :id="`${store.retsObj.attributes.RETS_ID}Icon`" :color="store.retsObj.attributes.flagColor.FLAG" :icon="store.retsObj.attributes.flagColor.FLAG ? changeFlagIcon(store.retsObj.attributes.flagColor.FLAG) : 'mdi-flag-outline' " style="position: relative; bottom: 2px; left: 6px;"></v-icon>
                </template>
            </v-btn>
            <v-col class="details-color-picker" v-if="flagClickedId === store.retsObj.attributes.RETS_ID" v-click-outside="closeFlagDiv">
                <v-icon size="20px" v-for="i in 7" :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])" style="position: relative; right: 6px;"></v-icon>
            </v-col>
            <v-btn-toggle v-model="store.retsObj.attributes.PRIO" density="compact">
                <v-btn icon="mdi-exclamation" density="compact" style="color: #d9d9d9; opacity: 1;" selected-class="toggle-exclamation" variant="plain" active></v-btn>
            </v-btn-toggle>   
        </div>
    </div>

    <div id="container-div">
        <div id="details-page" >
            <v-btn-toggle selected-class="active-button" variant="plain" mandatory v-model="isBtnSet" id="retsDetailMeta">
                <v-btn flat class="retsMetaBtn" @click="this.isDetails = true; this.isMetadata = false" density="compact">Details</v-btn>
                <v-btn flat class="retsMetaBtn" @click="this.isMetadata = true; this.isDetails = false" density="compact">Metadata</v-btn>
            </v-btn-toggle>
        
            <DetailsCard v-if="isDetails" :infoRets="store.retsObj" :taskGem="sendGemTaskNum" @disable-save="disableSave"/>
            <MetadataCard v-if="isMetadata" :infoRets="store.retsObj"/>
        </div>
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
                <div style="float: right; font-size: 10px; position: relative; top: .5rem;" >
                    <v-btn icon="mdi-arrow-expand" variant="plain" density="compact" @click="expandChatHistory"></v-btn>
                </div>
                <v-card-title style="padding-bottom: 30px;">History</v-card-title>
                <historyView :sortA="toSortBottom"/>
            </v-card>
        </div>
    </div>
    <div id="commentDiv" v-if="editText">
        <v-card style="position: relative; height: 100%; border-radius: 0%; left: 20%; bottom: 5%;" >
            <v-card-title style="padding-bottom: 30px;">History</v-card-title>
            <div style="float: right; font-size: 10px; position: relative; bottom: 2.4rem;" >
                <v-btn icon="mdi-close" variant="plain" density="compact" @click="editText = false"></v-btn>
            </div>
            <historyView :sortB="toSortTop"/>
            <div class="marginSetting" style="padding-top: 10px; position: absolute; width: 98%; bottom: 2rem;">
                <v-text-field label="Type a message" density="compact" tile v-model="addHistoryChat" style="margin-left: 0px; margin-right: 5px;"></v-text-field>
                <div style="float: left; bottom: 1rem; position: relative;">
                    <v-btn prepend-icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px !important;" @click="displayAttachments()">Add an Attachment</v-btn>
                    
                </div>
                <div style="float:right; bottom: 1rem; position: relative; ">
                    <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 15px !important;" @click="clearMessage"></v-btn>
                    <v-btn icon="mdi-check" variant="plain" density="compact" style="font-size: 15px !important;" @click="addHistoryNote"></v-btn>
                </div>
            </div>
            <div style="position: absolute; width: 98%; bottom: 1rem;">
                <div style="position: relative; float: right; padding-top: .5rem; left: 20px;">
                    <!-- <v-btn variant="plain" @click="deleteNote" class="secondary-button">Delete</v-btn>
                    <v-btn variant="plain" @click="closeNote" class="secondary-button">Cancel</v-btn> -->
                    <v-btn variant="outlined" class="main-button" density="compact" @click="saveNote" style="margin-right: 15px;">Save & Close</v-btn>
                </div>
            </div>
        </v-card>

    </div>
    <div style="position: relative; top: 93px; padding-bottom: 0px;">
        <div style="position: relative; float: left; margin-left: 10px; font-size: 11px; display: flex; flex-wrap: wrap;">
            <v-checkbox label="Asset Only Job" density="compact" class="checkbox-size"></v-checkbox>
        </div>
        <v-btn-toggle id="trigger-buttons" density="compact">
            <v-btn @click="handlearchive" variant="plain" flat size="small" class="secondary-button">Delete</v-btn>
            <v-btn @click="cancelDetailsMetadata" class="secondary-button" variant="plain" flat size="small">Cancel</v-btn>
            <v-btn @click="sendToParent" variant="outlined" class="main-button-style" size="small" :disabled="store.isSaveBtnDisable">Save</v-btn>
        </v-btn-toggle>
    </div>
    <v-card id = "archivepopup" v-if="isarchiveopen" >
        <v-card-title id = "archiveheader" >
            Delete RETS {{deletedRETSID}}
            <hr id = "separator2" />
        </v-card-title>
            <v-card-subtitle id = "archivetext">
                Deleting this RETS will move it to the archive table.
            </v-card-subtitle>
        

        <v-btn-group id = "archivebuttons" density="compact">
                <v-btn class="secondary-button" @click="handlearchive">CANCEL</v-btn>
                <v-btn class="main-button-style" @click="deleteRets">DELETE</v-btn>
            </v-btn-group>
    
    </v-card>    

</template>

<script>
    import editHistoryNotes from './EditHistoryNotes.vue'
    import DetailsCard from './detailsCard.vue'
    import MetadataCard from './metadataCard.vue'
    import { appConstants } from '../common/constant.js'
    import {getGEMTasks, searchCards, removeHighlight, removeRelatedRetsFromMap, deleteRetsGraphic, clearGraphicsLayer, removeOutline} from './utility.js'
    import detailsAlert from './detailsAlert.vue'
    import {updateRETSPT, deleteRETSPT} from './crud.js'
    import {store} from './store.js'
    import historyView from './historyRow.vue'

    export default{
        name: "RetsDetailPage",
        components: {editHistoryNotes, DetailsCard, MetadataCard, detailsAlert, historyView},
        props: {
            taskGem: Number,
            alertInfo: Object,
            historyString: String,
        },
        emits:['close-detail'],
        data(){
            return{
                deletedRETSID: null,
                isarchiveopen: false,
                isDetails: true,
                isMetadata: false,
                activityList: ['CRI', 'GSC Review', 'HPMS Sample Review', 'Interstate Project', 'Minute Order', 
                               'OSOSRE', 'Proposed FC', 'Recover Minute Order', 'ROW Crowdsource', 'Sprint 1',
                               'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Toll', 'TxDOTConnect', 'Urban Area Interaction'],
                isBtnSet: 0,
                relatedRets: ["Not Started", "On Hold", "Completed"],
                histNotes: [],
                editText: false,
                editNotes: '',
                noteIndex: 0,
                gemTask: [],
                sendGemTaskNum: null,
                searchHistoryFilter: '',
                saveDisable: false,
                flagClickedId: "",
                flagColor: "",
                swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#008000', '#4472C4', '#B75CFF', '#FFFFFF'],
                isHistNotesEmpty: false,
                store,
                noHistResp: "No History for this RETS",
                addHistoryChat: "",
                sendHistory: "",
                hasAttachment: false,
                toSortTop: "ASC",
                toSortBottom: "DESC",
                retsInfo: []
            }
        },
        mounted(){
            const gem = document.getElementById('gem-id')
            gem.addEventListener("keyup", (event) =>{
                if(event.target.value.length > 1){
                    this.proccessGEMTasks()
                    return
                }
            })
            this.getHistoryStore
            console.log(store.retsObj)
            store.retsObj = store.retsObj
            
            store.getHistoryChatRet()
        },
        methods:{
            handlearchive(){
                this.isarchiveopen =! this.isarchiveopen
                this.deletedRETSID = store.retsObj.attributes.OBJECTID         
            },
            returnDateFormat(e){
                //10/29/2023 09:11am
                const date = new Date(e)
                return `${date.toLocaleString('en-US')}`
            },
            returnUserName(n){
                if(!n) {
                    return "I have no name"
                }
                const usernameRow = appConstants.userRoles.find(name => name.USERNAME === n)
                return usernameRow.name
            },
            closeFlagDiv(){
                this.flagClickedId = ""
            },
            changeFlagIcon(color){
                if(color === '#FFFFFF'){
                    return 'mdi-flag-outline'
                }
                return 'mdi-flag'
            },
            assignColorToFlag(clr){
                document.getElementById(`${this.flagClickedId}Icon`).style.color = clr
                store.retsObj.attributes.flagColor.FLAG = clr
                console.log(store.retsObj.attributes)
                this.isColorPicked = false;
                this.closeFlagDiv()
            },
            changeColor(id){
                this.flagClickedId = ""
                this.flagClickedId = id
                this.isColorPicked = true;
            },
            disableSave(bool){
                if(store.isDisableValidations){
                    this.saveDisable = false
                    return
                }
                this.saveDisable = bool
            },
            deleteRets(){
                clearGraphicsLayer()
                store.retsObj.attributes.isDelete = true
                deleteRETSPT(store.retsObj)
                removeRelatedRetsFromMap(store.retsObj.attributes.OBJECTID)
                store.deleteRetsID()
                store.isDetailsPage = false
                store.activityBanner = "Activity Feed"
                deleteRetsGraphic()

                
            },
            async sendToParent(){
                clearGraphicsLayer()
                // this.retsInfo.ASSIGNED_TO = this.retsInfo.ASSIGNED_TO.value
                store.retsObj.attributes.PRIO = store.retsObj.attributes.PRIO ?? 1
                console.log(store.retsObj.attributes.PRIO)
                await updateRETSPT(store.retsObj)
                store.isDetailsPage = false
                store.activityBanner = "Activity Feed"
                deleteRetsGraphic()
                store.updateRetsID()
            },
            cancelDetailsMetadata(){
                clearGraphicsLayer()
                removeHighlight("a", true)
                store.preserveHighlightCards()
                store.isDetailsPage = false
                store.activityBanner = "Activity Feed"
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
                // this.histNotes[this.noteIndex].notes = this.editNotes
                // this.histNotes[this.noteIndex].author = this.retsInfo.logInUser
                // this.histNotes[this.noteIndex].time = new Date().toLocaleDateString('en-US')
                this.editText = false
                store.alertTextInfo = {"text": "Chat Saved", "color": "#70ad47", "type":"success", "toggle": true}
                store.isAlert = true
                setTimeout(()=>{
                    store.isAlert = false
                },2000)
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
            },
            expandChatHistory(){
                this.editText = true
                this.sendHistory = ""
            },
            addHistoryNote(){
                if(!this.addHistoryChat.length) return
                store.addNote(this.addHistoryChat)
                this.clearMessage()
                return
            },
            clearMessage(){
                this.addHistoryChat = ""
            },

            displayAttachments(){
                const input = document.createElement('input')
                input.type = "file"
                input.name = "attachment"
                input.click()

                input.addEventListener("change", (event)=>{
                    let attach = true
                    store.addNote("", attach, event.target.files)
                })

                input.remove()
            },
            removeRetsGraphics(){
                removeretsgraphic();
            },

        },
        watch:{

        },
        computed:{
            getHistoryStore:{
                get(){
                    if(!store.history.length){
                        this.noHistResp = 'Error Retrieving History'
                        this.isHistNotesEmpty = true
                        return
                    }
                    const unpackHistory = JSON.parse(store.history)
 
                    const getRelatedHist = unpackHistory.filter(hist => hist.RETS_ID === store.retsObj.attributes.RETS_ID)//4430)
                    if(!getRelatedHist.length){
                        this.isHistNotesEmpty = true
                        return
                    }
                    this.histNotes = getRelatedHist
                    this.isHistNotesEmpty = false
                    return
                }
            }
        }
    }
</script>

<style scoped>
#archivepopup{
    position: absolute;
        border-radius: 5px;
        left: 200%;
        width: 25rem;
        top:40%;
        height:25%; 
        border-radius: 0;
    }
    #archiveheader{
        position: absolute;
        top: 2%;
        left: 2%;
        font-size: 18px;
        
    }
    #separator2{
        border: 0;
        border-bottom: 1px solid ;
        margin: 0 auto;
        width: 22.5rem;
    }
    #archivetext{
        position: absolute;
        top: 30%;
        left: 2%;
    }
    #archivebuttons{
        position: absolute;
        bottom: 10px;
        width: 25rem;
        justify-content: end;
        padding-right: 5px;
        padding-bottom: 5px;

    }
#flagBtnDetails{
    padding: 1px !important;
    margin: 15px !important;
    min-width: 15px !important;

}
.cardDiv .v-btn-toggle{
    position: relative !important;
    bottom: 1rem !important;
}

div .cardDiv{
    position: relative; 
    top: 1rem;
}

#commentDiv{
    position: inherit;
    bottom: 20%; 
    left: 55vh; 
    width: 50rem;
    padding:0%;
    margin:0%;
    height: 31rem;
}

#details-page{
    display:flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px; 
    margin-bottom: 10px; 
    background-color: #212121;
    /* position: relative;
    height: 434px !important;
    bottom: .5rem;
    border-radius: 0px;
    padding-bottom: 26.5rem; 
    font-size: 1px !important;
    margin-right: 10px;
    margin-left: 10px;
    overflow-y: auto; */
}
#container-div{
    position: relative;
    top: 5.2rem;
    min-height: 0% !important;
    max-height: calc(100% - 14rem) !important;
    overflow-x: hidden;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    padding-bottom: 50px !important;
    width:100%;
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
    margin-right: 10px;
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
    height: 100%; 
    bottom: 0.2rem; 
    border-radius: 0%; 
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
#detailsHeaderDiv{
    width: 40%;
    position: relative;
    height: 54px;
    top: 40px;
    float: right;
}
#detailsHeaderIcon{
    position: relative;
    float: right;
    bottom: 0.5rem;
}

.details-color-picker{
    position: absolute; 
    display: flex; 
    flex-direction: column; 
    z-index: 9999; 
    width: 30px; 
    float: right;
    margin-left: .8rem;
    background-color: black;
    top: 52px;
}

.toggleExclamation{
    color: red;
}

#retsDetailMeta{
    padding-left: 15px;
    text-transform: capitalize !important;
    height: 40px;
    color: white;
    opacity: 1 !important
}
.toggle-exclamation{
    color: red !important;
}

.retsMetaBtn{
    text-transform: capitalize !important;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 0.0125em;
    opacity: 1 !important
}
</style>