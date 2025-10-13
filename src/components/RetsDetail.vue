<template>
    <!-- details section -->
        <div id="detailsHeaderIcon">
            <div style="display: flex; flex-direction: row; gap: 5px; align-items: center;">
                <div>
                    <div @click="store.showRetsFlag = !store.showRetsFlag">
                        <v-icon v-if="!store.retsObj.attributes.flagColor.FLAG || !store.retsObj.attributes.flagColor.FLAG.length" size="20px" :id="`${store.retsObj.attributes.RETS_ID}Icon`" :icon="store.retsObj.attributes.flagColor.FLAG ? changeFlagIcon(store.retsObj.attributes.flagColor.FLAG) : 'mdi-flag-outline' " style="position: relative; left: 6px;"></v-icon>
                        <v-icon style="position: relative; padding: 0px !important; margin: 0px !important;" size="20px" v-for="i in store.retsObj.attributes.flagColor.FLAG " :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="i.color"></v-icon>
                    </div> 
                </div>
                <div>
                    <v-btn-toggle v-model="store.retsObj.attributes.PRIO" density="compact" @update:modelValue="updatePRIO">
                        <v-btn icon="mdi-exclamation" density="compact" style="color: #d9d9d9; opacity: 1; font-size: 15px;" selected-class="toggle-exclamation" variant="plain" active></v-btn>
                    </v-btn-toggle>   
                </div>
            </div>
        </div>
        <div style="height: 100%; width: 100%;">
            <div class="container-div">
                <div class="details-div">
                    <v-card class="details-page">
                        <v-btn-toggle selected-class="active-button" variant="plain" mandatory v-model="isBtnSet" id="retsDetailMeta" density="compact">
                            <v-btn flat class="retsMetaBtn" @click="isDetails = true; isMetadata = false" density="compact">Details</v-btn>
                            <v-btn flat class="retsMetaBtn" @click="isMetadata = true; isDetails = false" density="compact">Metadata</v-btn>
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
                    <div id="historyCmntError" v-if="retCmnt.isError">
                        <v-alert type="error" dense>
                            Error adding a comment. {{ retCmnt.err }}
                        </v-alert>
                    </div>
                    <div style="display: flex; flex-direction: column; height: calc(100% + 9px);">
                        <v-card class="flex" style="display: flex; flex-direction: column; position: relative; border-radius: 0%; gap: 0px; overflow-y: auto;">
                            <div style="max-height: 30px; display: flex; flex-direction: row;">
                                <v-card-title style="font-size: 15px; position: relative;" class="flex">
                                    <span style="position: relative; bottom: 10px !important;">History</span>
                                    <v-btn icon="mdi-arrow-expand" variant="plain" density="compact" @click="expandChatHistory()" style="font-size: .6rem; float: right; position: relative; left: 20px; bottom: 10px;"></v-btn>
                                </v-card-title>
                            </div>
                            <div style="flex: 5;">
                                <historyViewSmall/>
                            </div>
                            <div style="max-height: 200px; padding-top: 0px; padding-bottom: 4px;">
                                <div style="margin-left: 10px; margin-right: 10px; ">
                                    <v-text-field label="Type a message" density="compact" tile v-model="addHistoryChat" :error-messages= "initRules ? 'Write a note. Submit your thought to History!' : null" @update:modelValue="historyValue"></v-text-field>
                                </div>
                                
                                <div style="float: left; bottom: 0rem; position: relative;" class="flex">
                                    <v-btn prepend-icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px !important; text-transform: none;" @click="displayAttachments()">Add an attachment</v-btn>
                                </div>
                                <div style="float:right; bottom: 1.2rem; position: relative; width: 80px; left: 10px;" class="flex">
                                    <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 10px !important; left: 10px;" @click="clearMessage"></v-btn>
                                    <v-btn icon="mdi-check" variant="plain" density="compact" style="font-size: 10px !important;" @click="addHistoryNote('Small')"></v-btn>
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
                <div style="position: relative; min-height:40px; max-height:40px; padding-bottom: 120px; width: 100%; flex: auto; z-index: 9999;">
                    <div style="position: relative; float: left; font-size: 11px; display: flex; flex-wrap: wrap; top: 3px; left: 6px;">
                        <v-checkbox label="Asset Only Job" density="compact" class="checkbox-size" v-model="isAsset" @update:model-value="isAssetJob()"></v-checkbox>
                    </div>
                    <v-btn-toggle class="trigger-buttons" density="compact">
                        <v-btn @click="handlearchive()" variant="plain" size="small" class="secondary-button">Delete</v-btn>
                        <v-btn @click="cancelDetailsMetadata()" variant="plain" class="secondary-button" size="small" :disabled="store.isCancelBtnDisable">Cancel</v-btn>
                        <v-btn @click="sendToParent()" variant="outlined" class="main-button-style" size="small" :disabled="store.isSaveBtnDisable" :loading="store.isSaving">Save</v-btn>
                    </v-btn-toggle>
                </div>
            </div>
            <div id="commentDiv" v-if="editText">
                <div id="historyCmntErrorL" v-if="retCmntL.isError">
                    <v-alert type="error" dense>
                        Error adding a comment. {{ retCmntL.err }}
                    </v-alert>
                </div>
                <v-card style="position: relative; height: 100%; border-radius: 0%;" >
                    <v-card-title style="height: 75px;">History</v-card-title>
                    <div style="float: right; position: relative; bottom: 4.1rem;" >
                        <v-btn icon="mdi-close" variant="plain" density="compact" @click="editText = false" style="font-size: .9rem;"></v-btn>
                    </div>
                    <historyView/>
                    <div class="marginSetting" style="padding-top: 10px; position: relative; width: 98%; bottom: 0rem;">
                        <v-text-field label="Type a message" density="compact" tile v-model="addHistoryChat" style="margin-left: 0px; margin-right: 5px;" :error-messages= "initRules ? 'Write a note. Submit your thought to History!' : null" @update:modelValue="historyValue"></v-text-field>
                        <div style="float: left; bottom: 1rem; position: relative;">
                            <v-btn prepend-icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px !important; top: 0px; text-transform: none;" @click="displayAttachments()">Add an attachment</v-btn>
                        </div>
                        
                        <div style="float:right; bottom: 1.3rem; position: relative; left: 7px;">
                            <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 15px !important;" @click="clearMessage"></v-btn>
                            <v-btn icon="mdi-check" variant="plain" density="compact" style="font-size: 15px !important;" @click="addHistoryNote('Expand')"></v-btn>
                        </div>

                        <div style="position:relative; float: left; width:100%; min-height: 35px; max-height: 35px; overflow-y: auto; bottom: 10px;">
                            <v-chip style="margin: 2px;" v-for="(attach, index) in addAttach" color="#4472C4" closable density="compact" rounded="0" variant="flat" :text="attach.name" @click:close="removeAttachment(index)"></v-chip>
                        </div>
                
                        <div style="float: right;">
                            <v-btn variant="outlined" class="main-button-style" size="small" @click="saveNote('Expand')" :disabled="!this.addHistoryChat.length" style="position: relative; bottom: 0px !important;">Save & Close</v-btn>
                        </div>

                    </div>
                </v-card>
            </div>
        </div> 
        <Teleport to="body">
            <v-card v-if="isarchiveopen" id="archivepopup" height="130">
            <div style="height: 100%; margin: 10px;">
                <div style="padding: 0px; bottom: 8px;" class="banner-txt">
                    Delete RETS {{deletedRETSID}}
                    <hr/>
                </div>
                
                <v-card-subtitle class="popuptext">
                    Deleting this RETS will move it to the archive table.
                </v-card-subtitle>
                    
                <v-btn-toggle class="trigger-buttons" density="compact" style="position: relative; top: 20px; left: 11px;">
                    <v-btn variant="plain" size="small" class="secondary-button"  @click="handlearchive()">CANCEL</v-btn>
                    <v-btn class="main-button-style" variant="outlined" size="small" @click="deleteRets()">DELETE</v-btn>
                </v-btn-toggle>
            </div>
        </v-card>  
        </Teleport>
        

</template>

<script>
    import { appConstants } from '../common/constant.js'
    import {getGEMTasks, removeHighlight, removeRelatedRetsFromMap, deleteRetsGraphic, clearGraphicsLayer, isRoadExist, cancelSketchPt, retsLayerView, updateRetsObj, openDetails, outlineFeedCards, highlightRETSPoint} from './utility.js'

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
                initRules: false,
                retCmnt: {err: null},
                retCmntL: {}
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
            return
        },
        methods:{
            dataMetadataCheck(){
                store.checkDetailsForComplete()
                return
            },
            historyValue(){
                this.initRules = false
                return
            },
            updatePRIO(){
                this.dataMetadataCheck()
                return
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
                this.dataMetadataCheck()
                return
            },
            changeColor(id){
                this.flagClickedId = id
                this.isColorPicked = true;
                return
            },
            disableSave(bool){
                if(store.isDisableValidations){
                    this.saveDisable = false
                    return
                }
                this.saveDisable = bool
                return
            },
            async returnToFeed(){
                if(store.cancelEvent){
                    store.cancelEvent.remove()
                    cancelSketchPt()
                }
                
                store.isAlert = false
                clearGraphicsLayer()
                store.isDetailsPage = false
                store.isCancelBtnDisable = false
                store.activityBanner = "Activity Feed"
                window.document.title = 'RETS Application'
                store.isMoveRetsPt = false
                store.isCard = true
                store.historyChat.length = 0
                store.isSaveBtnDisable = true
                
                if (store.isSelectEnabled === false){
                    // if (store.roadHighlightObj.size === 0){
                    removeHighlight(store.retsObj)
                    store.roadHighlightObj.clear()
                    if(!store.isSearch){
                        console.log("hekllo")
                        // if (store.CREATE_DT){
                            await store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", `${store.CREATE_DT.filter} ${store.CREATE_DT.sortType}, PRIO`)

                        // }
                        // else{
                        //     await store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")

                        // }
                        store.updateRetsSearch = store.roadObj.sort((a,b) => new Date(b.EDIT_DT) - new Date(a.EDIT_DT))
                        return
                    }

                    // store.updateRetsSearch

                    
                    // }
                    
                    // if (store.roadHighlightObj.size === 1){
                    //     highlightRETSPoint(store.retsObj)
                    //     store.roadHighlightObj.clear()
                    //     store.roadHighlightObj.add(store.retsObj)

                    // }
                    
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
                store.toggleFeed = 1
                return
            },

            async sendToParent(){
                if ((store.isAlert && store.alertTextInfo.type == "error") || (!store.retsObj.attributes.DESC_)){
                    return
                }
                const roadExist = await isRoadExist()
                if(roadExist && !store.retsObj.attributes.NO_RTE){
                    store.closeIsRoadExist = true
                    return
                }
                // store.retsObj.attributes.mdialarm = store.isDeadline(store.retsObj.attributes.DEADLINE)
                store.isEmptyRow = false
                store.isSaving = true
                store.retsObj.attributes.ACTV = !store.retsObj.attributes.ACTV ? null : store.retsObj.attributes.ACTV.value ?? store.retsObj.attributes.ACTV
                store.retsObj.attributes.PRIO = store.retsObj.attributes.PRIO ?? 1
                store.retsObj.attributes.JOB_TYPE = this.isAsset === true ? 2 : 1
                await updateRETSPT(store.retsObj)
                
                await this.returnToFeed()

                store.isShowSelected = false
                deleteRetsGraphic()
                retsLayerView.layer.definitionExpression = store.savedFilter
                store.isSaveBtnDisable = true
                

                // await this.sendNotification(userSettings)
                store.isNewRets = false
                // if (store.autozoomextent){
                //     queryExtent()
                // }
                return
            },
            async sendNotification(userSettings){
                if (userSettings === null || !userSettings.notifications){
                    return
                }
                const {notifications} = userSettings

                if (notifications[0].value === true && store.isNewRets){
                    store.isNewRets = false
                    await this.notificationTrigger()
                }
            },
            async notificationTrigger(){

                let distNm
                appConstants.districtDomainValues.forEach((element) => {
                    if (element.value === store.retsObj.attributes.DIST_NM){
                        distNm = element.name.toUpperCase()
                    }
                }

                   
                    
                )
                let url = `https://gis-batch-dnd.txdot.gov/fmejobsubmitter/TPP-MB/RETS_NOTIFY_created.fmw?RETS_NUM=${store.retsObj.attributes.RETS_ID}&DISTRICT=${distNm}&DESC=${store.retsObj.attributes.DESC_}&CREATED_BY=${store.retsObj.attributes.CREATE_NM}&CREATE_DT=${store.retsObj.attributes.CREATE_DT}&opt_showresult=false&opt_servicemode=sync&token=696074193c2f5daeb783bc5c8c164ee8c5ceff36`
                const response = await fetch(url)
                if (response.ok){

                }
                else{
                    console.error(response)
                }
                            
    
            },
            async cancelDetailsMetadata(){
                if(!store.isSaveBtnDisable){
                    store.clickStatus = false
                    store.cancelpopup = true
                    return
                }
                
                if (store.archiveRetsDataString){
                    const archiveRets = JSON.parse(store.archiveRetsDataString)
                    this.replaceArchiveContent(archiveRets)

                }
                
                retsLayerView.layer.definitionExpression = store.savedFilter
                store.toggleFeed = 1
                store.cancelpopup = false
                window.document.title = `RETS Application`
                store.activityBanner = "Activity Feed"
                return
            },
            async disgardEdits(){
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
                await this.returnToFeed()
                retsLayerView.layer.definitionExpression = store.savedFilter
                store.isCard = true
                store.toggleFeed = 1
                store.cancelpopup = false
                outlineFeedCards(store.roadHighlightObj)
                return
            },
            async replaceArchiveContent(old){
                //delete flags
                // console.log(old)
                old.attributes.flagColor.FLAG = store.flagsChecked
                console.log(old.attributes.flagColor)
                console.log(store.flagsChecked)
                const filter = !store.isShowSelected ? store.updateRetsSearch : [...store.roadHighlightObj]
                // const currDate = filter?.find(x => x.attributes.RETS_ID === old.attributes.RETS_ID)?.attributes?.EDIT_DT ?? await this.returnToFeed()
                const rd = filter.findIndex(x => x.attributes.OBJECTID === store.retsObj.attributes.OBJECTID)
                // if(currDate !== old.attributes.EDIT_DT){
                //     old.attributes.EDIT_DT === currDate
                // }
                filter.splice(rd, 1, old)
                !store.isShowSelected ? filter.splice(rd, 1, old) : store.roadHighlightObj = new Set(filter)
                return
            },
            openNote(note, index){
                this.editText = true
                this.editNotes = note
                this.noteIndex = index
                return
            },
            closeNote(){
                this.editText = false
                return
            },
            saveNote(size){
                this.addHistoryNote(size)
                this.editText = false
                store.alertTextInfo = {"text": "Chat Saved", "color": "#70ad47", "type":"success", "toggle": true}
                store.isAlert = true
                setTimeout(()=>{
                    store.isAlert = false
                },2000)
                return
            },
            deleteNote(){
                this.histNotes.splice(this.noteIndex, 1)
                this.editText = false
                return
            },
            proccessGEMTasks(){
                const returnGEMTasks = getGEMTasks()
                //returns array
                this.gemTask = []
                returnGEMTasks.forEach(gem => this.gemTask.push(gem))
                return
            },
            addGemChip(gemId){
                store.taskGem.push(gemId)
                return
            },
            isAssetJob(){
                this.dataMetadataCheck()
                return
            },
            closeGEMTask(){
                document.querySelectorAll(".gem-search")[0].style.display = "none"
                return
            },
            expandChatHistory(){
                this.editText = true
                this.sendHistory = ""
                return
            },
            async addHistoryNote(size){
                try{
                    
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
                }
                catch(err){
                    if(size === 'Expand'){
                        this.retCmntL.isError = true
                        this.retCmntL.err = "Unable to complete operation."
                    }
                    else{
                        this.retCmnt.isError = true
                        this.retCmnt.err = "Unable to complete operation."
                    }

                    setTimeout(()=>{
                        this.retCmntL.isError = this.retCmnt.isError = false
                    },3500)
                }

            },
            clearMessage(){
                this.addHistoryChat = ""
                return
            },

            displayAttachments(oid){
                const input = document.createElement('input')
                input.type = "file"
                input.name = "attachment"
                input.click()

                input.addEventListener("change", (event)=>{
                    this.addAttach.push({name: [...event.target.files].at(-1).name})
                    
                    store.attachment = [...event.target.files]
                    //addAttaevent.target.fileschments(oid, attach, event.target.files)
                })

                input.remove()
                return
            },
            removeRetsGraphics(){
                removeretsgraphic();
                return
            },
            handlearchive(){
                this.isarchiveopen = !this.isarchiveopen
                this.deletedRETSID = store.retsObj.attributes.OBJECTID
                return
            },


        },
        watch:{
            'store.showRetsFlag': {
                handler: function(n,o){
                    this.showRetsFlag = n
                },
                immediate: true
            }
        }
    }
</script>

<style scoped>
#archivepopup{
    position: absolute;
    border-radius: 5px;
    width: 25rem;
    border-radius: 0;
    margin: auto;
    left:0;
    right: 0;
    top: 0;
    bottom: 0;
    padding-bottom: 20px;
}

.flex{
    flex: auto;
}

#flagBtnDetails{
    position: relative;
    top: 0px !important;
    margin: 0px !important;
    margin-right: 0px !important;
    max-width: 0px !important;
    min-width: 0px !important;
    height: 100%;
}

#commentDiv{
    position: absolute;
    top: calc(100% + -91vh); 
    left: calc(100% + 7vw); 
    width: 50rem;
    padding:0%;
    margin:0%;
    height: 31.5rem;
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
    gap: 4px;
    overflow-y: auto;
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
    margin-right: 10px;
    left: 520px;
}

.v-btn{
    margin-right: 10px;
}

.v-btn:hover{
    background-color: rgba(84,84,84,.3)
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
    border-left: 5px solid #4472C4 !important;
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
    padding-bottom: 10px;
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
    width: 44%;
    padding-right: 0px;
    left: 250px;
    justify-content: end;
}

.details-color-picker{
    position: relative;
    display: flex;
    flex-direction: row;
    border: 2px solid red;
}

.toggleExclamation{
    color: red;
}

#retsDetailMeta{
    position: relative;
    top: 0px; 
    padding-left: 0px;
    margin-bottom: 3px;
    text-transform: capitalize !important;
    height: 23px;
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
    position: relative;
    left: 0px;
    padding: 0px;
    padding-top: 0px;
}

.buttonpositioning{
    position: absolute;
    bottom: 14px;
    width: 20rem;
    right: 8px;
    justify-content: end;
}

#historyCmntError{
    position: absolute; 
    z-index: 9999; 
    width: 100%; 
    font-size: 13px;
}

#historyCmntErrorL{
    position: absolute; 
    z-index: 9999; 
    width: 100%; 
    font-size: 13px;
}
.marginSetting :deep(.v-messages__message){
    /* margin-top: 20px; */
    height: 40px;


}

.marginSetting :deep(.v-messages){
    /* border: 1px solid pink; */
        /* margin-top: 20px; */

}










</style>