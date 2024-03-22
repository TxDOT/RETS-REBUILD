<template>
    <div style="margin-right: 10px; margin-left: 10px; width: 100%;">
        <div id="search">
            <v-text-field class="search-history" placeholder="Search..." rounded="0" prepend-inner-icon="mdi-magnify" density="compact" v-model="searchHistoryFilter"></v-text-field>
        </div>
        <div style="position: relative; bottom: 2rem;">
                <v-btn variant="plain" density="compact" style="font-size: 10px; float: right; position: relative; bottom:0px; margin:0%; padding: 0%; padding:0px 10px 0px 10px; margin-right: 10px; margin-bottom: 0px">
                    <template v-slot:prepend>
                            <v-icon icon="mdi-filter"></v-icon>
                    </template>
                    Has attachments
                </v-btn>
            </div>
        <div id="displayHistory">
                <div v-for="(note, i) in histNotes" :key="note.OBJECTID" track-by="OBJECTID" v-if="!isHistNotesEmpty" id="test">
                    <v-banner v-model="note[i]" id="history-notes" density="compact" style="padding: 0px; padding-left: 5px; border-left: 3px solid #4472C4 !important;">
                        <v-banner-text>
                            <span v-if="note.replyInfo" style="margin:0% !important; "> <p id="replyingToCmnt">{{note.replyInfo}}</p></span>
                            <v-text-field style="width:100%; position: relative; width: 20rem !important; height: 2rem; margin:0% !important;" density="compact" variant="plain" :disabled="!editContent" v-model="note.CMNT"></v-text-field>                                
                            <span style="font-size: 10px; color: grey; padding-left: 5px;">{{ returnUserName(note.CMNT_NM) }} {{ returnDateFormat(note.CREATE_DT) }}</span>
                        </v-banner-text>
                        <template v-slot:actions v-if="note.SYS_GEN === 0">
                            <div style="position: relative; top: 6px;">
                                <v-btn icon="mdi-pencil-outline" style="font-size: 13px; bottom: 15px;" @click="openNote(note.CMNT, note.OBJECTID)"></v-btn>
                                <v-btn icon="mdi-reply" style="font-size: 13px; bottom: 15px;" @click="replyNote(note.CMNT, note)"></v-btn>
                            </div>
                        </template>
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
    import {searchCards} from './utility.js'
    import { appConstants } from '../common/constant'

    export default{
        name: 'historyView',
        props: {historyArr: String},
        data(){
            return{
                store,
                isHistNotesEmpty: false,
                histNotes: [],
                noHistResp: "No History for this RETS",
                searchHistoryFilter: '',
                editText: false,
                editContent: false,
                updateOID: -1,
                isClose: false,
                ogNote: "",
                count: 0
            }
        },
        mounted(){
            this.getHistoryStore
        }, 
        methods:{
            openNote(n, oid){
                console.log(n, oid)
                this.editContent = true
                this.isClose = true;
                this.updateOID = oid
                this.ogNote = n
            },
            deleteNote(n, oid){
                const noteIndex = this.histNotes.findIndex(x => x.OBJECTID === oid)
                console.log(noteIndex)
                this.histNotes.splice(noteIndex, 1)
            },
            updateNote(n, oid){
                this.editContent = false
                this.updateOID = -1
            },
            closeNotes(n, notes){
                notes.CMNT = this.ogNote
                this.editContent = false
                this.isClose = false;
                this.updateOID = -1
            },
            replyNote(text, note){
                console.log(note)
                this.editContent = true
                
                let oid = this.count += 1
                console.log(oid)
                
                this.histNotes.push({OBJECTID: oid, RETS_ID: store.historyRetsId, CMNT: "Enter Text Here", CMNT_NM: appConstants.defaultUserValue[0].value, replyInfo: `Replying to "${note.CMNT}"`, SYS_GEN: 0})
                this.updateOID = oid
            },
            returnDateFormat(e){
                //10/29/2023 09:11am
                const date = new Date(e)
                return `${date.toLocaleString('en-US')}`
            },
            returnUserName(n){
                console.log(n)
                if(!n) {
                    return "I have no name"
                }
                const usernameRow = appConstants.userRoles.find(name => name.USERNAME === n)
                return usernameRow.name
            },
        },
        watch:{
            searchHistoryFilter:{
                handler: function(){
                    if(this.searchHistoryFilter.length){
                        console.log(this.histNotes)
                        console.log(this.searchHistoryFilter)
                        searchCards(this.histNotes, this.searchHistoryFilter, "OBJECTID")
                        return
                    }

                },
                immediate:true
            },
            historyArr:{
                handler: function(){
                    console.log(this.histNotes)
                    let oid = this.count += 1
                    this.histNotes.push({OBJECTID: oid , RETS_ID: store.historyRetsId, CMNT: this.historyArr, SYS_GEN: 0})
                },
                immediate: true
            },
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
                    this.count = unpackHistory.length
                    const getRelatedHist = unpackHistory.filter(hists => hists.RETS_ID === store.historyRetsId)//4430)
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
    .search-history{
        height: 10px;
        bottom: 0px; 
        margin-left: 10px; 
        margin-right: 10px;
        max-width: 550px;
        min-width: 100px;
    }
    
    #history-notes{
        /* border-left: 3px solid #4472C4 !important;
        position: relative;
        bottom: 2rem !important;
        border-radius: 0%;
        width: 100%;
        margin: 0%;
        padding: 1%;
        padding-bottom: 3rem; */
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
    #test{
        
        /* bottom: 1.5rem;
        width: 100% !important;*/
        margin-bottom: 5px;
        padding: 0%;
        padding-bottom: 0px;
        max-height: 30vh;
        margin-right: 10px;
    }
    #search{
        position: relative;
        bottom: 2rem;
        right: 10px;
    }
    #replyingToCmnt{
        position: relative;
        color: #44546a;
        font-size: 10px;

    }   
</style>