<template>
    <div style="margin-right: 10px; margin-left: 10px; width: 100%;">
        <div id="search">
            <v-text-field class="search-history" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" density="compact" v-model="searchHistoryFilter"></v-text-field>
        </div>
        <div style="position: relative; bottom: 2rem;">
                <v-btn variant="plain" density="compact" style="font-size: 10px; float: right; position: relative; bottom:0px; margin:0%; padding: 0%; padding:0px 10px 0px 10px; margin-right: 10px; margin-bottom: 0px" @click="queryAttachments" :disabled="numAttachments === 0" v-model="isAttachedActive" :active="isAttachedActive" active-class="active-button">
                    <template v-slot:prepend>
                        
                        <v-icon icon="mdi-filter"></v-icon>
                    </template>
                    Has attachments
                </v-btn>
                <div class="filter-notification-bubble" v-if="numAttachments > 0">
                    <p style="font-size: 13.5px; position: relative; left: 27%; bottom: 2px;"><b> {{ numAttachments }}</b></p>
                </div>
            </div>
        <div id="displayHistory">
                <div v-for="(note, i) in histNotes" :key="note.OBJECTID" track-by="OBJECTID" v-if="!isHistNotesEmpty" id="chatDiv">
                    <v-banner v-model="note[i]" :id="note.OBJECTID" class="history-notes" density="compact" style="padding: 0px; padding-left: 5px; border-left: 3px solid #4472C4 !important;">
                        <v-banner-text>
                            <span v-if="note.PARENT_ID" style="margin:0% !important; "> <p id="replyingToCmnt">Replying to "{{histNotes.find(x => x.OBJECTID === note.PARENT_ID)?.CMNT ?? "Referenced Note has been deleted"}}"</p></span>
                            <v-text-field style="width:100%; position: relative; width: 20rem !important; height: 2rem; margin:0% !important; z-index:9999;" density="compact" variant="plain" :disabled="note.OBJECTID !== updateOID" v-model="note.CMNT"></v-text-field>                                
                            <span style="font-size: 10px; color: grey; padding-left: 5px;">{{ returnUserName(note.CMNT_NM) }} {{ returnDateFormat(note.CREATE_DT) }}</span>
                            <div style="position: relative; bottom: 0rem;" v-if="note.attachments">
                                <span v-for="attach in note.attachments" style="padding-right: 3px;">
                                    <v-chip :text="attach.name" color="#4472C4" class="" closable density="compact" rounded="0" variant="flat" @click="openAttachement(attach.url)" @click:close="deleteAttach(note.OBJECTID, attach.name)"></v-chip>
                                </span>
                            </div>
                        </v-banner-text>
                        <div v-if="note.SYS_GEN === 0" style="width: 100%; position: absolute;">
                            <div style="position: relative; float: right; top: 14px;" v-if="note.SYS_GEN === 0">
                                <v-btn variant="plain" density="compact" icon="mdi-pencil-outline" style="font-size: 13px; bottom: 15px;" @click="openNote(note.CMNT, note.OBJECTID)" :disabled="note.CMNT_NM !== loggedInUserName"></v-btn>
                                <v-btn variant="plain" density="compact" icon="mdi-reply" style="font-size: 13px; bottom: 15px;" @click="replyNote(note.OBJECTID, note)"></v-btn>
                            </div>
                        </div>
 
                    </v-banner>
                    <span v-if="updateOID === note.OBJECTID && note.SYS_GEN === 0" :id="note.OBJECTID">
                        <div style="position: relative; float: right; top: 15px; margin: 0% !important; padding: 0% !important">
                           
                            <v-btn icon="mdi-delete" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="deleteNote(note.CMNT, note.OBJECTID)"></v-btn>
                            <v-btn icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="attachToNote(note.CMNT, note.OBJECTID)"></v-btn>
                            <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="closeNotes(note.CMNT, note)"></v-btn>
                            <v-btn icon="mdi-check"  variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="updateNote(note.CMNT, note.OBJECTID)"></v-btn>
                        </div>
                    </span>
                </div>

        </div>
        <v-text-field v-if="isHistNotesEmpty" disabled variant="plain">{{noHistResp}}</v-text-field>
    </div>
    
</template>

<script>
    import {store} from './store.js'
    import {addAttachments, deleteAttachment} from './utility.js'
    import { appConstants } from '../common/constant'

    export default{
        name: 'historyView',
        props: {
            historyString: String,
        },
        data(){
            return{
                store,
                isHistNotesEmpty: false,
                histNotes: [],
                fullChat: [],
                noHistResp: "No History for this RETS",
                searchHistoryFilter: '',
                editText: false,
                editContent: false,
                updateOID: -1,
                isClose: false,
                ogNote: "",
                loggedInUserName: "",
                attach: ["hello.txt", "Jaas.pdf"],
                hasAttachment: false,
                numAttachments: 0,
                isAttachedActive: false,
                isActive: false,
            }
        },
        mounted(){

        }, 
        methods:{
            openNote(n, oid){
                this.editContent = true
                this.isClose = true;
                this.updateOID = oid
                this.ogNote = n
            },
            deleteNote(n,oid){
                store.deleteNote(oid)
                return
            },
            async updateNote(n, oid){
                const findItem = store.modifyNote(n, oid)
                this.editContent = false
                this.updateOID = findItem.OBJECTID
                this.updateOID = -1
                
            },
            closeNotes(n, notes){
                notes.CMNT = this.ogNote
                this.editContent = false
                this.isClose = false;
                this.updateOID = -1
                return
            },
            async replyNote(cmnt, note){
                this.editContent = true
                await store.replyNote(note)
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

            },
            returnDateFormat(e){
                //10/29/2023 09:11am
                const date = e ? new Date(e) : new Date()
                return `${date.toLocaleString('en-US')}`
            },
            returnUserName(n){
                if(!n) {
                    return "System Generated"
                }
                this.loggedInUserName = appConstants.defaultUserValue[0].value
                const usernameRow = appConstants.userRoles.find(name => name.value === n)
                return usernameRow.name
            },
            queryAttachments(){
                this.isAttachedActive = !this.isAttachedActive
                if(this.isAttachedActive){
                    this.fullChat = this.histNotes
                    const getAttachmentComments = this.histNotes.filter(x => x.attachments)
                    store.historyChat = getAttachmentComments
                    return
                }

                store.historyChat = this.fullChat
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
            'store.historyChat':{
                handler: function(){
                    console.log(store.historyChat)
                    this.histNotes = store.historyChat

                    // const attachNum = store.historyChat.filter(chat => chat.attachments).length
                    // this.numAttachments = attachNum ?? 0
                },
                immediate: true
            },
        },
        computed:{
           
        }
    }

</script>

<style scoped>
    .search-history{
        height: 10px;
        bottom: 0px; 
        margin-left: 10px; 
        margin-right: 10px;
        max-width: 550px;
        min-width: 100px;
    }
    
    #displayHistory{
        display: flex;
        flex-direction: column;
        min-height: 10vh;
        max-height: 26vh;
        width: 98.7%;
        overflow-y: auto;
        padding-bottom: 5rem;
    }
    #search{
        position: relative;
        bottom: 2rem;
        right: 10px;
        width: 69%;
    }
    #replyingToCmnt{
        position: relative;
        color: #44546a;
        font-size: 10px;
    }
    .filter-notification-bubble{
        position: relative;
        width: 1.1rem;
        background-color:#4472C4;
        height: 1.1rem;
        float: right;
        top: .8rem;
        left: 1.6rem;
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

</style>