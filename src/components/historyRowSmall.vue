<template>
    <div style="width: 99%; margin-left: 10px; height: 100%; display: flex; flex-direction: column; gap: 2px;">
        <div id="search">
            <div style="position: relative; display: flex; flex-direction: row;">
                <v-text-field class="search-history" placeholder="Search..." flat rounded="0" prepend-inner-icon="mdi-magnify" density="compact" v-model="searchHistoryFilter" variant="solo-filled" elevation="0" >
                <template v-slot:append-inner>
                    <v-icon icon="mdi-close" @click="clearContent" v-if="searchHistoryFilter.length"></v-icon>
                </template>
                </v-text-field>

                <div style="position: relative; flex: auto; width: 0%; padding-top: 5px; right: 2px;">
                    <v-btn variant="plain" density="compact" style="font-size: 10px; float: right; text-transform: none;" @click="queryAttachments" :disabled="store.numAttachments === 0" v-model="isAttachedActive" :active="isAttachedActive" active-class="active-button">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-filter"></v-icon>
                        </template>
                        Has attachments
                    </v-btn>
                    <div class="filter-notification-bubble" v-if="store.numAttachments > 0">
                        <p style="font-size: 11px; position: relative; left: 27%; bottom: 1px;"><b> {{ store.numAttachments }}</b></p>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="isHistNotesEmpty" style="flex: auto;">
            <v-text-field disabled variant="plain">No History for this RETS</v-text-field>
        </div>
        <div id="displayHistory" v-if="!this.isHistNotesEmpty">
            <div v-for="(note, i) in histNotes" :key="note.OBJECTID" track-by="OBJECTID">
                <v-banner :id="`${note.OBJECTID}Small`" v-model="note[i]" density="compact" class="note" style=" max-height: 60px;">
                    <div style="max-width: 84%;">
                        <span v-if="note.PARENT_ID" style="margin:0% !important;">
                            <p id="replyingToCmnt">Replying to "{{store.historyChat.find(x => x.OBJECTID === note.PARENT_ID)?.CMNT ?? "Referenced Note has been deleted"}}"</p>
                        </span>
                        
                        <v-textarea class="history-note" rows="1" auto-grow density="compact" :disabled="note.OBJECTID !== updateOID" variant="plain" v-model="note.CMNT" placeholder="Enter Comment" autofocus></v-textarea>
                        
                        <span v-for="(i,n) in note.URL" style="display: flex; flex-direction: row; max-width: 99%; font-size: 12px;">
                            <span v-html="returnHyperLink(i, n)" style="max-width: 99%;"></span>
                        </span>
                        
                        <div style="flex: auto; position: relative; top: -10px; width: 100%;">
                            <span style="font-size: 10px; color: grey; padding-left: 2px; position: relative; bottom: 0px; padding: 0px;">{{ returnUserName(note.CMNT_NM) }} {{ returnDateFormat(note.CREATE_DT) }} <b v-if="note.CREATE_DT !== note.EDIT_DT && note.SYS_GEN === 0" class="main-color">{{ `Edited ${returnDateFormat(note.EDIT_DT)}` }}</b></span>
                        </div>
                        <div style="position: relative; top: 0px;" v-if="note.attachments">
                            <span v-for="attach in note.attachments" style="padding-right: 3px;">
                                <v-chip :text="attach.name" color="#4472C4" :closable="editContent && updateOID === note.OBJECTID ? true: false" density="compact" rounded="0" variant="flat" @click="openAttachement(attach.url)" @click:close="deleteAttach(note.OBJECTID, attach.name)"></v-chip>
                            </span>
                        </div>
                    </div>
                    <div v-if="note.SYS_GEN === 0" style="position: relative; flex: auto;">
                        <div style="position: relative; float: right; width: 60px;">
                            <v-btn variant="plain" density="compact" icon="mdi-pencil-outline" style="font-size: 10px;" @click="openNote(note)" :disabled="note.CMNT_NM !== loggedInUserName"></v-btn>
                            <v-btn variant="plain" density="compact" icon="mdi-reply" style="font-size: 10px;" @click="replyNote(note)"></v-btn>
                        </div>
                    </div>
                </v-banner>
                    <span v-if="updateOID === note.OBJECTID && note.SYS_GEN === 0" :id="note.OBJECTID">
                        <div style="position: relative; float: right; top: 15px; margin: 0% !important; padding: 0% !important; padding-right: 5px;">                           
                            <v-btn icon="mdi-delete" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="deleteNote(note.CMNT, note.OBJECTID)"></v-btn>
                            <v-btn icon="mdi-paperclip" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="attachToNote(note.CMNT, note.OBJECTID)"></v-btn>
                            <v-btn icon="mdi-close" variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="closeNotes(note)"></v-btn>
                            <v-btn icon="mdi-check"  variant="plain" density="compact" style="font-size: 10px; bottom: 15px;" @click="updateNote(note)"></v-btn>
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
                urlLinks: [],
                addURL: false,
            }
        },
        mounted(){
            this.orderList
        },
        updated(){
            document.querySelector('#displayHistory').scrollTop = document.querySelector('#displayHistory').scrollHeight - document.querySelector('#displayHistory').clientHeight
           
        },
        methods:{
            returnHyperLink(url, index){
                if(url.match(/^www./g)){
                    return `Link ${index+1} <a href='https://${url}' target='_blank'>${url}</a>`
                }
                return `Link ${index+1} <a href='${url}' target='_blank'>${url}</a>`
                
            },
            getHyperLinks(index){
                if(!index.CMNT) return
                let findURL = index.CMNT.match(/(\S+(?<=www|https)((?=)\S+))/g)
                if(findURL){
                    index.URL = findURL
                    findURL.forEach((url, i) => {
                        let returnUpdateCMNT = index.CMNT.replace(url, `see Link ${i + 1}`)
                        index.CMNT = returnUpdateCMNT
                    })
                }

                return index.CMNT
            },
            clearContent(){
                this.searchHistoryFilter = ""
                return
            },
            async addNote(){
                await store.addNote(null, false)
                this.isHistNotesEmpty = false
                this.orderList
                this.openNote(null, `${store.addNoteOid}`)
                return
            },
            openNote(n){
                this.editContent = true
                this.isClose = true;
                this.updateOID = n.OBJECTID
                this.ogNote = n.CMNT
                const oidFlag = `${n.OBJECTID}`    
                document.getElementById(`${oidFlag}Small`).classList.add("active-chat-box")
                this.switchHyperlink(n)
                return
            },
            deleteNote(n,oid){
                store.deleteNote(oid)
                this.orderList
                if(!this.histNotes.length){
                    this.isHistNotesEmpty = true
                    return
                }
                return
            },
            async updateNote(n){
                const findItem = await store.modifyNote(n.CMNT, n.OBJECTID)
                this.editContent = false
                //this.updateOID = findItem.OBJECTID
                this.updateOID = -1
                const oidFlag = `${n.OBJECTID}Small`
                document.getElementById(`${oidFlag}`).classList.remove("active-chat-box")
                this.getHyperLinks(findItem)
                return
            },
            closeNotes(note){
                note.CMNT = this.ogNote
                this.editContent = false
                this.isClose = false;
                this.updateOID = -1
                const oidFlag = `${note.OBJECTID}Small`
                document.getElementById(`${oidFlag}`).classList.remove("active-chat-box")
                this.getHyperLinks(note)
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
            switchHyperlink(note){
                note.URL.forEach((url, i) => {
                    let switchHyper = note.CMNT.replace(`see Link ${i+1}`, url)
                    note.CMNT = switchHyper
                })

                return
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
            openAttachement(url){
                window.open(url, "_blank")
            },
            deleteAttach(noteOid, attachName){
                // const returnHistObj = this.histNotes.find(note => note.OBJECTID === noteOid)
                // const returnAttchIndex = returnHistObj.attachments.findIndex(att => att.name === attachName)
                // console.log(returnAttchIndex)
                // console.log(JSON.stringify(returnHistObj.attachments))
                // returnHistObj.attachments.splice(returnAttchIndex, 1)
                // console.log(returnHistObj)
                // console.log(this.histNotes.at(-1).attachments)
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
                    if(a.length === 0){
                        this.isHistNotesEmpty = true
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
                this.histNotes = store.historyChat.slice().sort((a,b) => a.CREATE_DT - b.CREATE_DT)
                this.histNotes.forEach((x) => {
                    let cmnt = this.getHyperLinks(x)
                    x.CMNT = cmnt
                })
                return this.histNotes
            }
        }
    }

</script>

<style scoped>
    .search-history{
        position: relative;
        width: 38%;
        max-height: 4px;
        min-height: 4px;
    }

    #displayHistory{
        position: relative; 
        display: flex;
        flex-direction: column;
        height: calc(38vh - 130px);
        width: 95.7%;
        overflow-y: auto;
        padding-bottom: 30px;
        margin-bottom: 4px;
        flex: auto;
        gap: 5px;
    }
    .note{
        display: flex;
        flex-direction: column;
        padding: 0px;
        padding-left: 5px;
        border-left: 5px solid #4472C4 !important; 
        margin-bottom: 0px;
        gap: 5px;
    }
    #search{
        position: relative;
        width: 100%;
        height: 40px;
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
        bottom: 1.8rem;
        right: 6.6rem;
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
        height: fit-content;
    }

    :deep(.v-input__details){
        min-height: 0px !important;
        padding-top: 0px !important;
    }
</style>
