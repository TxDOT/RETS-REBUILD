
<template>
    <hr class="popup-title-border"></hr>
    <div style="margin-right: 10px; margin-left: 10px; width: 100%; height: 250px;">
        <div id="search">
            <v-text-field class="search-history" placeholder="Search..." flat rounded="0" prepend-inner-icon="mdi-magnify" density="compact" v-model="searchHistoryFilter" variant="solo-filled" elevation="0" >
                <template v-slot:append-inner>
                    <v-icon icon="mdi-close" @click="clearContent" v-if="searchHistoryFilter.length"></v-icon>
                </template>
            </v-text-field>
        </div>
        <div style="position: relative; bottom: 2rem;">
            <v-btn variant="plain" density="compact" style="left: 30px; font-size: 8px; float: right; position: relative; top:15px; margin:0%; padding: 0%; padding:0px 0px 0px 10px; margin-bottom: 0px" @click="queryAttachments" :disabled="store.numAttachments === 0" v-model="isAttachedActive" :active="isAttachedActive" active-class="active-button">
                <template v-slot:prepend>
                    <v-icon icon="mdi-filter"></v-icon>
                </template>
                Has attachments
            </v-btn>
            <div class="filter-notification-bubble" v-if="store.numAttachments > 0">
                <p style="font-size: 11px; position: relative; left: 27%; bottom: 1px;"><b> {{ store.numAttachments }}</b></p>
            </div>
        </div>
        <div v-if="isHistNotesEmpty">
            <v-text-field disabled variant="plain">No History for this RETS</v-text-field>
        </div>
        <div id="displayHistory" v-if="!this.isHistNotesEmpty">
            <div v-for="(note, i) in histNotes" :key="note.OBJECTID" track-by="OBJECTID">
                <v-banner :id="`${note.OBJECTID}Small`" v-model="note[i]" density="compact" style="padding: 0px; padding-left: 5px; border-left: 3px solid #4472C4 !important;">
                    <v-banner-text class="mx-auto">
                        <div>
                            <div>
                                <span v-if="note.PARENT_ID" style="margin:0% !important;">
                                    <p id="replyingToCmnt">Replying to "{{store.historyChat.find(x => x.OBJECTID === note.PARENT_ID)?.CMNT ?? "Referenced Note has been deleted"}}"</p>
                                </span>
                            </div>
                          
                            <v-textarea class="history-note mx-2" rows="1" auto-grow density="compact" variant="plain" :disabled="note.OBJECTID !== updateOID" v-model="note.CMNT" placeholder="Enter Comment" autofocus></v-textarea>
                    
                                    
                            <div style="position: relative; bottom: 1px;">
                                <span style="font-size: 10px; color: grey; padding-left: 2px;">{{ returnUserName(note.CMNT_NM) }} {{ returnDateFormat(note.CREATE_DT) }} <b v-if="note.CREATE_DT !== note.EDIT_DT && note.SYS_GEN === 0" class="main-color">{{ `Edited ${returnDateFormat(note.EDIT_DT)}` }}</b></span>
                            </div>
                            <div style="position: relative; bottom: 0px;" v-if="note.attachments">
                                <span v-for="attach in note.attachments" style="padding-right: 3px;">
                                    <v-chip :text="attach.name" color="#4472C4" class="" :closable="editContent && updateOID === note.OBJECTID ? true: false" density="compact" rounded="0" variant="flat" @click="openAttachement(attach.url)" @click:close="deleteAttach(note.OBJECTID, attach.name)"></v-chip>
                                </span>
                            </div>
                        </div>
                    </v-banner-text>

                    <div v-if="note.SYS_GEN === 0" style="width: 16%; position: relative; right: 50px;">
                        <div style="position: relative; float: right; bottom: 5px; right: 15px;" v-if="note.SYS_GEN === 0">
                            <v-btn variant="plain" density="compact" icon="mdi-pencil-outline" style="font-size: 13px; bottom: 15px;" @click="openNote(note.CMNT, note.OBJECTID)" :disabled="note.CMNT_NM !== loggedInUserName"></v-btn>
                            <v-btn variant="plain" density="compact" icon="mdi-reply" style="font-size: 13px; bottom: 15px;" @click="replyNote(note)"></v-btn>
                        </div>
                    </div>
                </v-banner>
                    <span v-if="updateOID === note.OBJECTID && note.SYS_GEN === 0" :id="note.OBJECTID">
                        <div style="position: relative; float: right; top: 15px; margin: 0% !important; padding: 0% !important; padding-right: 5px;">                           
                            <v-btn icon="mdi-delete" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="deleteNote(note.CMNT, note.OBJECTID)"></v-btn>
                            <v-btn icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="attachToNote(note.CMNT, note.OBJECTID)"></v-btn>
                            <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="closeNotes(note.CMNT, note)"></v-btn>
                            <v-btn icon="mdi-check"  variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="updateNote(note.CMNT, note.OBJECTID)"></v-btn>
                        </div>
                    </span>
                </div>


                <div v-if="noSearch">
                    <v-text-field disabled variant="plain">No Search Results</v-text-field>
                </div>
        </div>
    </div>
</template>

<script>
    import {store} from './store.js'
    import {addAttachments, deleteAttachment} from './utility.js'
    import { appConstants } from '../common/constant'

    export default{
        name: 'historyView',
        data(){
            return{
                store,
                isHistNotesEmpty: false,
                histNotes: [],
                noHistResp: "No History for this RETS",
                searchHistoryFilter: "",
                editText: false,
                editContent: false,
                updateOID: -1,
                isClose: false,
                ogNote: "",
                loggedInUserName: "",
                hasAttachment: false,
                numAttachments: 0,
                isAttachedActive: false,
                isActive: false,
                testOid: 0,
                searchAttach: false,
            }
        },
        mounted(){

        }, 
        methods:{
            clearContent(){
                this.searchHistoryFilter = ""
            },
            async addNote(){
                await store.addNote(null, false)
                this.isHistNotesEmpty = false
                this.orderList
                this.openNote(null, `${store.addNoteOid}`)
            },
            openNote(n, oid){
                this.editContent = true
                this.isClose = true;
                this.updateOID = oid
                this.ogNote = n
                const oidFlag = `${oid}`    
                document.getElementById(`${oidFlag}Small`).classList.add("active-chat-box")
            },
            deleteNote(n,oid){
                store.deleteNote(oid)
                this.orderList
                if(!this.histNotes.length){
                    this.isHistNotesEmpty = true
                }
                return
            },
            async updateNote(n, oid){
                const findItem = store.modifyNote(n, oid)
                this.editContent = false
                this.updateOID = findItem.OBJECTID
                this.updateOID = -1
                const oidFlag = `${oid}`
                document.getElementById(`${oidFlag}`).classList.remove("active-chat-box")
            },
            closeNotes(n, notes){
                notes.CMNT = this.ogNote
                this.editContent = false
                this.isClose = false;
                this.updateOID = -1
                const oidFlag = `${notes.OBJECTID}Small`
                document.getElementById(`${oidFlag}`).classList.remove("active-chat-box")
                return
            },
            async replyNote(note){
                this.isHistNotesEmpty = false
                const cmnt = null
                const sortType = "end"
                const returnOid = await store.replyNote(note, sortType)
                this.openNote(cmnt, returnOid)
                this.testOid = returnOid
                return
            },
            attachToNote(cmnt, oid){
                // this.updateOID = oid
                // this.hasAttachment = true
                const input = document.createElement('input')
                input.type = "file"
                input.name = "attachment"
                input.click()

                input.addEventListener("change", (event)=>{
                    addAttachments(oid, event.target.files)
                })

                input.remove()
                const oidFlag = `${oid}Small`
                document.getElementById(`${oidFlag}`).classList.remove("active-chat-box")
            },
            returnDateFormat(e){
                //10/29/2023 09:11am
                const date = new Date(e)
                return `${date.toLocaleString('en-US')}`
            },
            returnUserName(n){
                if(n === 'RETSBOT' || !n) {
                    return n ?? 'SYSTEM GENERATED'
                }
                console.log(n)
                this.loggedInUserName = appConstants.defaultUserValue[0].value
                const usernameRow = appConstants.userRoles.find(name => name.value === n)
                return usernameRow?.name ?? n
            },
            queryAttachments(){
                this.isAttachedActive = !this.isAttachedActive
                if(this.isAttachedActive){
                    this.histNotes = store.historyChat.filter(x => x.attachments).sort((a,b) => a.CREATE_DT - b.CREATE_DT)
                    return
                }
                this.histNotes = this.orderList
                return
                
            },
            getAttachmentCount(){

            },
            openAttachement(url){
                window.open(url, "_blank")
            },
            deleteAttach(noteOid, attachName){
                deleteAttachment(noteOid, attachName)
                
            }   
        },
        watch:{
            searchHistoryFilter:{
                handler: function(a){
                    try{
                        this.noSearch = false
                        if(!a.length || !a){
                            this.histNotes = store.historyChat.slice().sort((a,b) => a.CREATE_DT - b.CREATE_DT)
                            if(!this.histNotes.length){
                                return this.isHistNotesEmpty = true
                            }
                            return
                        }
                        const searchString = a.toLowerCase()
                        let s;
                        const acceptedObj = []
                        for(s of store.historyChat){
                            const createObjKey = Object.values(s)
                            createObjKey.forEach(x => {
                                if(String(x).toLowerCase().includes(searchString) && (acceptedObj.findIndex(oid => oid.OBJECTID === s.OBJECTID) === -1)){
                                    acceptedObj.push(s)
                                }
                                // else{
                                //     this.noSearch = true
                                // }

                            })

                        }
                        if(!acceptedObj.length){
                            this.noSearch = true
                        }
                        this.histNotes = acceptedObj.sort((a,b) => a.CREATE_DT - b.CREATE_DT)
                    }
                    catch(a){
                        console.log(a)
                    }
                    
                },
                immediate:true
            },
            'store.historyChat.length':{
                handler: function(a,b){
                    console.log(a)
                    if(a === 0){
                        this.isHistNotesEmpty = true
                        console.log(this.isHistNotesEmpty)
                        return
                    }
                    this.orderList
                    this.isHistNotesEmpty = false
                    return
                },
                immediate: true
            }
        },
        computed:{
            orderList: function(){
                return this.histNotes = store.historyChat.slice().sort((a,b) => a.CREATE_DT - b.CREATE_DT)
            }
        }
    }

</script>

<style scoped>
    .search-history{
        height: 0px !important;
        margin-left: 10px; 
        margin-right: 10px;
        max-width: 550px;
        min-width: 100px;
        position: relative;
    }

    #displayHistory{
        position: relative; 
        display: flex;
        flex-direction: column;
        min-height: 100px;
        max-height: calc(38vh - 130px);
        width: 95.7%;
        overflow-y: auto;
        padding-bottom: 30px;
    }
    #search{
        position: relative;
        bottom: 1.5rem;
        right: 6px;
        width: 69%;
    }
    #replyingToCmnt{
        position: relative;
        color: #44546a;
        font-size: 10px;
    }
    .filter-notification-bubble{
        position: relative;
        width: .9rem;
        background-color:#4472C4;
        height: .9rem;
        float: right;
        top: 1.8rem;
        left: 3.4rem;
        border-radius: 50%;
        z-index: 9999
    }

    #chatDiv{
        margin-bottom: 5px;
        padding: 0%;
        padding-bottom: 0px;
        max-height: 30vh;
        margin-right: 10px;
    }

    .v-btn--active{
        text-decoration: underline !important;
        color: #4472C4 !important;
        /* background-color: transparent !important; */
        /* padding: 0px !important; */
    }

    .history-notes{
        border-color: red;
        background-color: #4472C4;
    }
    #addCommentBtnSmall{
        position: relative;
        float: right;
        margin-right: 15px;
        padding-left: 10px;
        padding-right: 10px;
        bottom: 2px;
    }
    .history-note{
        width: 320px;
        position: relative;
        /* position: relative; 
        width: 380px;
        position: relative;
        padding-bottom: 4px;
        display: flex; 
        flex-direction: column; 
        min-height: 2px; 
        max-height: 38px;
        overflow: hidden; */
    }

</style>
