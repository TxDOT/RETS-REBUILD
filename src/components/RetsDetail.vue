<template>
    <!-- details section -->
    
        <div id="detailsHeaderIcon">
            <v-btn density="compact" flat @click="changeColor(store.retsObj.attributes.RETS_ID);" id="flagBtnDetails">
                <template v-slot:prepend>
                    <v-icon size="20px" :id="`${store.retsObj.attributes.RETS_ID}Icon`" :color="store.retsObj.attributes.flagColor.FLAG" :icon="store.retsObj.attributes.flagColor.FLAG ? changeFlagIcon(store.retsObj.attributes.flagColor.FLAG) : 'mdi-flag-outline' " style="position: absolute; bottom: 2px; left: 6px;"></v-icon>
                </template>
            </v-btn>
            <div class="details-color-picker" v-if="flagClickedId === store.retsObj.attributes.RETS_ID" v-click-outside="closeFlagDiv">
                <v-icon style="position: relative; padding: 0px !important; margin: 0px !important;" size="20px" v-for="i in 7" :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])"></v-icon>
            </div>
            <v-btn-toggle v-model="store.retsObj.attributes.PRIO" density="compact" @update:modelValue="updatePRIO" style="flex: auto;">
                <v-btn icon="mdi-exclamation" density="compact" style="color: #d9d9d9; opacity: 1; font-size: 15px; bottom: 1px;" selected-class="toggle-exclamation" variant="plain" active></v-btn>
            </v-btn-toggle>   
        </div>
        <div style="height: 100%; width: 100%; ">
        <div class="container-div">
            <div class="details-div">
                <v-card class="details-page">
                    <v-btn-toggle selected-class="active-button" variant="plain" mandatory v-model="isBtnSet" id="retsDetailMeta">
                        <v-btn flat class="retsMetaBtn" @click="this.isDetails = true; this.isMetadata = false" density="compact">Details</v-btn>
                        <v-btn flat class="retsMetaBtn" @click="this.isMetadata = true; this.isDetails = false" density="compact">Metadata</v-btn>
                    </v-btn-toggle>
                    <DetailsCard v-if="isDetails"/>
                    <MetadataCard v-if="isMetadata"/>
                </v-card>
                <div class="gem-search" >
                    <v-icon icon="mdi-magnify" id="gem-search-icon"></v-icon>
                    <input type="text" id="gem-id">
                    <span id="show-gem-tasks" v-for="i in gemTask">
                        <span class="gem-task" @click="addGemChip(i)">{{ i }}</span>
                    </span>
                </div>
            </div>

            <!-- history section -->
            <div class="history-div">
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <v-card class="flex" style="display: flex; flex-direction: column; position: relative; border-radius: 0%; gap: 0px;">
                        <div style="max-height: 30px; display: flex; flex-direction: row;">
                            <v-card-title style="font-size: 15px; position: relative; bottom: 8px;" class="flex">
                                <span style="position: relative;">History</span>
                                <v-btn icon="mdi-arrow-expand" variant="plain" density="compact" @click="expandChatHistory" style="font-size: .6rem; float: right; position: relative; left: 20px;"></v-btn>
                            </v-card-title>
                        </div>
                        <div class="flex">
                            <historyViewSmall/>
                        </div>
                        <div style="max-height: 200px; padding-top: 0px; padding-bottom: 4px;">
                            <div>
                                <v-text-field label="Type a message" density="compact" tile v-model="addHistoryChat" :error-messages= "initRules ? 'Write a note. Submit your thought to History!' : null" @update:modelValue="historyValue"></v-text-field>
                            </div>
                            
                            <div style="float: left; bottom: 0rem; position: relative;" class="flex">
                                <v-btn prepend-icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 9px !important;" @click="displayAttachments()">Add an Attachment</v-btn>
                            </div>
                            <div style="float:right; bottom: 1.2rem; position: relative; right: 0px" class="flex">
                                <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 15px !important;" @click="clearMessage"></v-btn>
                                <v-btn icon="mdi-check" variant="plain" density="compact" style="font-size: 15px !important;" @click="addHistoryNote('Small')"></v-btn>
                            </div>
                            <div class="flex" style="right: 20px; bottom: 0px; position: relative; display: flex; flex-direction: column; max-width: 400px; min-height: 10px; max-height: 30px; overflow-y: auto; overflow-x: hidden; "> 
                                <div style="flex: auto;">
                                    <v-chip v-for="(attach, index) in addAttach" color="#4472C4" closable density="compact" rounded="0" variant="flat" :text="attach.name" @click:close="removeAttachment(index)" style="margin: 1px; width: fit-content"></v-chip>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </div>
            </div>
            <div style="position: relative; max-height:40px; padding-bottom: 120px; left: 6px; width: 99%; flex: auto; z-index: 9999;">
                <div style="position: relative; float: left; margin-left: 10px; font-size: 11px; display: flex; flex-wrap: wrap; top: 3px;">
                    <v-checkbox label="Asset Only Job" density="compact" class="checkbox-size" v-model="isAsset" @update:model-value="isAssetJob"></v-checkbox>
                </div>
                <v-btn-toggle class="trigger-buttons" density="compact">
                    <v-btn @click="handlearchive" variant="plain" size="small" class="secondary-button">Delete</v-btn>
                    <!-- <v-btn @click="handlearchive" variant="plain" flat size="small" class="secondary-button">Delete</v-btn> -->
                    <v-btn @click="cancelDetailsMetadata" variant="plain" class="secondary-button" size="small" :disabled="store.isCancelBtnDisable">Cancel</v-btn>
                    <v-btn @click="sendToParent" variant="outlined" class="main-button-style" size="small" :disabled="store.isSaveBtnDisable" :loading="store.isSaving">Save</v-btn>
                </v-btn-toggle>
            </div>
        </div>

        <div id="commentDiv" v-if="editText">
            <v-card style="position: relative; height: 100%; border-radius: 0%;" >
                <v-card-title style="padding-bottom: 30px;">History</v-card-title>
                <div style="float: right; position: relative; bottom: 3.7rem;" >
                    <v-btn icon="mdi-close" variant="plain" density="compact" @click="editText = false" style="font-size: .9rem;"></v-btn>
                </div>
                <historyView/>
                <div class="marginSetting" style="padding-top: 10px; position: relative; width: 98%; bottom: 0rem;">
                    <v-text-field label="Type a message" density="compact" tile v-model="addHistoryChat" style="margin-left: 0px; margin-right: 5px;" :error-messages= "initRules ? 'Write a note. Submit your thought to History!' : null" @update:modelValue="historyValue"></v-text-field>
                    <div style="float: left; bottom: 1rem; position: relative;">
                        <v-btn prepend-icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px !important; top: 10px;" @click="displayAttachments()">Add an Attachment</v-btn>
                    </div>
                    
                    <div style="float:right; bottom: 1.3rem; position: relative; left: 7px;">
                        <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 15px !important;" @click="clearMessage"></v-btn>
                        <v-btn icon="mdi-check" variant="plain" density="compact" style="font-size: 15px !important;" @click="addHistoryNote('Expand')"></v-btn>
                    </div>

                    <div style="position:relative; float: left; width:100%; min-height: 35px; max-height: 35px; overflow-y: auto; bottom: 10px;">
                        <v-chip style="margin: 2px;" v-for="(attach, index) in addAttach" color="#4472C4" closable density="compact" rounded="0" variant="flat" :text="attach.name" @click:close="removeAttachment(index)"></v-chip>
                    </div>
    
            
                    <div style="float: right;">
                        <v-btn variant="outlined" class="main-button-style" size="small" @click="saveNote('Expand')" :disabled="!this.addHistoryChat.length">Save & Close</v-btn>
                    </div>
      
                </div>
            </v-card>
        </div>
        
        <v-card id="archivepopup" v-if="isarchiveopen" >
            <v-card-title class="popupheader" >
                Delete RETS {{deletedRETSID}}
            </v-card-title>
            <hr id="separator3" />
            <v-card-subtitle class="popuptext">
                Deleting this RETS will move it to the archive table.
            </v-card-subtitle>
                
            <v-btn-group class="buttonpositioning" density="compact">
                <v-btn class="secondary-button"  @click="handlearchive">CANCEL</v-btn>
                <v-btn class="main-button-style" @click="deleteRets">DELETE</v-btn>
            </v-btn-group>
        </v-card>  
    </div> 
    

</template>

<script>
    import { appConstants } from '../common/constant.js'
    import {getGEMTasks, removeHighlight, removeRelatedRetsFromMap, deleteRetsGraphic, clearGraphicsLayer, isRoadExist, cancelSketchPt, retsLayerView, updateRetsObj, openDetails, outlineFeedCards, removeOutline, highlightRETSPoint} from './utility.js'

    import {updateRETSPT, deleteRETSPT} from './crud.js'
    import {store} from './store.js'

    import { defineAsyncComponent } from 'vue'
    export default{
        name: "RetsDetailPage",
        components: {DetailsCard: defineAsyncComponent(()=> import('./detailsCard.vue')),
                     MetadataCard: defineAsyncComponent(()=> import('./metadataCard.vue')), 
                     detailsAlert: defineAsyncComponent(()=> import('./detailsAlert.vue')), 
                     historyView: defineAsyncComponent(()=> import('./historyRow.vue')),
                     historyViewSmall: defineAsyncComponent(()=> import('./historyRowSmall.vue'))
                    },
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
                archiveRets: [],
                addAttach: [],
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
                retsInfo: [],
                isAsset: false,
                histNoteRequired: {
                    required: value => !!value || "Write a note. Submit your thought to History!"
                },
                initRules: false
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
            //this.getHistoryStore
            this.isAsset = store.retsObj.attributes.JOB_TYPE === 2 ?  true : false
        },
        methods:{
            historyValue(){
                this.initRules = false
            },
            updatePRIO(){
                store.checkDetailsForComplete()
            },
            removeAttachment(index){
                store.attachment.splice(index, 1)
                this.addAttach.splice(index, 1)
                return
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
                this.isColorPicked = false;
                this.closeFlagDiv()
                store.checkDetailsForComplete()
                return
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
            returnToFeed(){
                store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
                if(store.cancelEvent){
                    store.cancelEvent.remove()
                    cancelSketchPt()
                }
                store.isAlert = false
                clearGraphicsLayer()
                store.isDetailsPage = false
                store.isCancelBtnDisable = false
                store.activityBanner = "Activity Feed"
                store.isMoveRetsPt = false
                store.isCard = true
                store.historyChat.length = 0
                store.isSaveBtnDisable = true
                //store.roadHighlightObj.clear()
                if (store.roadHighlightObj.size <= 1 && store.isSelectEnabled === false){
                    if (store.roadHighlightObj.size === 0){
                        removeHighlight(store.retsObj)
                        store.roadHighlightObj.clear()

                    }
                    
                    //const b = store.roadObj.find(rd => rd.attributes.OBJECTID === store.retsObj.attributes.OBJECTID)
                    //store.roadHighlightObj.delete(b)

                    //store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
                    if (store.roadHighlightObj.size === 1){
                        //removeHighlight(store.retsObj)
                        //store.roadHighlightObj.clear()
                        highlightRETSPoint(store.retsObj)
                        store.roadHighlightObj.clear()
                        store.roadHighlightObj.add(store.retsObj)

                    }
                    store.updateRetsSearch = store.roadObj.sort((a,b) => new Date(b.EDIT_DT) - new Date(a.EDIT_DT))

                    return
                }
                return
            },

            async deleteRets(){
                store.retsObj.attributes.isDelete = true
                await deleteRETSPT(store.retsObj)
                removeRelatedRetsFromMap(store.retsObj.attributes.OBJECTID)
                store.deleteRetsID()
                deleteRetsGraphic()
                this.returnToFeed()
                return
            },

            async sendToParent(){
                const roadExist = await isRoadExist()
                if(roadExist && !store.retsObj.attributes.NO_RTE){
                    store.closeIsRoadExist = true
                    return
                }

                store.isSaving = true
                store.retsObj.attributes.ACTV = !store.retsObj.attributes.ACTV ? null : store.retsObj.attributes.ACTV.value ?? store.retsObj.attributes.ACTV
                store.retsObj.attributes.PRIO = store.retsObj.attributes.PRIO ?? 1
                store.retsObj.attributes.JOB_TYPE = this.isAsset === true ? 2 : 1
                
                await updateRETSPT(store.retsObj)
                
                store.updateRetsSearch = store.roadObj.sort((a,b) => new Date(b.EDIT_DT) - new Date(a.EDIT_DT))
                this.returnToFeed()
                store.isShowSelected = false
                deleteRetsGraphic()
                retsLayerView.layer.definitionExpression = store.savedFilter
                store.isSaveBtnDisable = true
                //store.updateRetsID()
                //retsLayerView.layer.definitionExpression = appConstants['defaultQuery'](store.loggedInUser)
                return
            },
            cancelDetailsMetadata(){
                if(!store.isSaveBtnDisable){
                    store.clickStatus = false
                    store.cancelpopup = true
                    return
                }
                //store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
                const archiveRets = JSON.parse(store.archiveRetsDataString)
                this.replaceArchiveContent(archiveRets)
                this.returnToFeed()
                retsLayerView.layer.definitionExpression = store.savedFilter
                store.toggleFeed = 1
                store.cancelpopup = false
                setTimeout(() => {
                    outlineFeedCards(store.roadHighlightObj)
                }, 1000);

                //store.preserveHighlightCards()
                // retsLayerView.layer.definitionExpression = appConstants['defaultQuery'](store.loggedInUser)
                return
            },
            disgardEdits(){
                if(store.clickStatus){
                    const archiveRets = JSON.parse(store.archiveRetsDataString)
                    let findItem = store.roadObj.find((ret) => ret.attributes.OBJECTID === archiveRets.attributes.RETS_ID)
                    updateRetsObj(findItem, archiveRets)
                    store.roadHighlightObj.forEach(entry => {
                        if (store.retsObj.attributes.RETS_ID != entry.attributes.RETS_ID){
                            openDetails(store.roadObj.find(rd => rd.attributes.OBJECTID === entry.attributes.RETS_ID))
                            removeHighlight("a", true)
                            highlightRETSPoint(entry.attributes)
                            outlineFeedCards(store.roadHighlightObj)
                        }
                        });                                           
                    store.clickStatus = false
                    store.cancelpopup = false
                    store.isSaveBtnDisable = true
                    return
                }
                const archiveRets = JSON.parse(store.archiveRetsDataString)
                this.replaceArchiveContent(archiveRets)
                this.returnToFeed()
                retsLayerView.layer.definitionExpression = store.savedFilter
                store.isCard = true
                store.toggleFeed = 1
                store.cancelpopup = false
                outlineFeedCards(store.roadHighlightObj)
                return
            },
            replaceArchiveContent(old){
                const filter = !store.isShowSelected ? store.updateRetsSearch : [...store.roadHighlightObj]
                const currDate = filter?.find(x => x.attributes.RETS_ID === old.attributes.RETS_ID)?.attributes?.EDIT_DT ?? this.returnToFeed()
                const rd = filter.findIndex(x => x.attributes.OBJECTID === store.retsObj.attributes.OBJECTID)
                if(currDate !== old.attributes.EDIT_DT){
                    old.attributes.EDIT_DT === currDate
                }
                filter.splice(rd, 1, old)
                !store.isShowSelected ? filter.splice(rd, 1, old) : store.roadHighlightObj = new Set(filter)
                return
            },
            openNote(note, index){
                this.editText = true
                this.editNotes = note
                this.noteIndex = index
            },
            closeNote(){
                this.editText = false
            },
            saveNote(size){
                this.addHistoryNote(size)
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
            isAssetJob(){
                store.checkDetailsForComplete()
            },
            closeGEMTask(){
                document.querySelectorAll(".gem-search")[0].style.display = "none"
            },
            expandChatHistory(){
                this.editText = true
                this.sendHistory = ""
            },
            async addHistoryNote(size){
                if(!this.addHistoryChat.length){
                    this.initRules = true
                    return
                }
                const attach = store.attachment.length ? true : false 
                await store.addNote(this.addHistoryChat, attach, store.attachment, true)
                this.clearMessage()
                this.addAttach.length = 0
                document.getElementById(`${store.addNoteOid}${size}`).scrollIntoView({block: "end", inline: "nearest"})
                return
            },
            clearMessage(){
                this.addHistoryChat = ""
            },

            displayAttachments(oid){
                const input = document.createElement('input')
                input.type = "file"
                input.name = "attachment"
                input.click()

                input.addEventListener("change", (event)=>{
                    this.addAttach.push({name: [...event.target.files].at(-1).name})
                    store.attachment = event.target.files
                    //addAttaevent.target.fileschments(oid, attach, event.target.files)
                })

                input.remove()
            },
            removeRetsGraphics(){
                removeretsgraphic();
            },
            handlearchive(){
                this.isarchiveopen = !this.isarchiveopen
                this.deletedRETSID = store.retsObj.attributes.OBJECTID       
            },


        },
    }
</script>

<style scoped>
.flex{
    flex: auto;
}

#archivepopup{
    position: fixed;
    border-radius: 5px;
    width: 25rem;
    height:20%; 
    border-radius: 0;
    left: 567px;
    right:0;
    top:0;
    bottom: 0;
    margin: auto;

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
    padding-top: 1px;
}



#archivetext{
    position: absolute;
    top: 25%;
    left: 2%;
}

#archivebuttons{
    position: absolute;
    bottom: 14px;
    width: 20rem;
    right: 8px;
    justify-content: end;
}

#flagBtnDetails{
    position: relative;
    flex: auto;
    float: right;
    padding: 14px !important;
    margin: 0px !important;
    min-width: 15px !important;
}

#commentDiv{
    position: relative;
    bottom: 100%; 
    left: 70vh; 
    width: 50rem;
    padding:0%;
    margin:0%;
    height: 31rem;
}

.details-div{
    position: relative;
    top: 2px;
    min-height: 300px !important;
    width: 100%;
}
.details-page{
    position: relative;
    color: black;
    height: 100%;
    border-radius: 0%;
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
.container-div{
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    bottom: 78px !important;
    background-color: #4472C4;
    gap: 4px;
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
.history-div{
    position: relative;
    height: 230px;
    margin-bottom: 0px;
    flex: auto;
}
.history-card{
    top: 0rem; 
    border-radius: 0%; 
    margin-right: 0px;
    margin-left: 0px;
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
    width: 30%;
    position: relative;
    height: 27px;
    bottom: 15px;
    left: 10px;
    float: right;
}
#detailsHeaderIcon{
    display: flex;
    flex-direction: row;
    position: relative;
    bottom: 64px;
    left: 22rem;
    width: 20%;
}

.details-color-picker{
    position: absolute;
    top: 30px;
    height: fit-content;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    margin: 0px;
    left: 5px;
    width: fit-content;
    background-color: black;
}

.toggleExclamation{
    color: red;
}

#retsDetailMeta{
    position: relative;
    top: 0px; 
    padding-left: 0px;
    margin-bottom: 0px;
    text-transform: capitalize !important;
    height: 30px;
    color: white;
    width: 100%;
    opacity: 1 !important
}
.toggle-exclamation{
    color: red !important;
}

.retsMetaBtn{
    text-transform: capitalize !important;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.0125em;
    opacity: 1 !important;
    padding: 0px;
    margin-right: 0px;
}

.popuptext{
    position: absolute;
    left: 10px;
}
.popupheader{
    position: relative;
    left: 10px;
}



.buttonpositioning{
    position: absolute;
    bottom: 14px;
    width: 20rem;
    right: 8px;
    justify-content: end;
}
</style>