import { reactive } from 'vue';
import { appConstants } from '../common/constant';
import {sendChatHistory} from './crud.js'
import {getQueryLayer, getCmntOID, addAttachments, getAttachmentInfo} from './utility.js'

export const store = reactive({
        count: 0,
        isCloseDetail: false,
        taskGem: 0,
        clickedGraphic: 0,
        currentInfo: "",
        history: "",
        updateChatHistory: {},
        historyRetsId: 0,
        historyChat: [],
        chatAttachments: [],
        async getHistoryChatRet(){
                const getRelatedHistory = JSON.parse(this.history)
                const retsHistory = getRelatedHistory.filter(hist => hist.RETS_ID === this.historyRetsId)
                const attachment = await getAttachmentInfo(retsHistory.map(id => id.OBJECTID))

                retsHistory.forEach((hist) => {
                        if(Object.hasOwn(attachment, hist.OBJECTID)){
                                hist.attachments = attachment[hist.OBJECTID].map((a) => {
                                        if(a.parentObjectId === hist.OBJECTID){
                                                return {name: a.name, url: a.url}
                                        }
                                        
                                })
                        }
                })
                // this.historyChat = retsHistory
                return
        },
        addNote(cmnt, isAttach, event){
                const newHistory = {RETS_ID: this.historyRetsId, CMNT: cmnt, CMNT_NM: `${appConstants.defaultUserValue[0].value}`, SYS_GEN: 0}

                return sendChatHistory(newHistory, "add")
                        .then((res) => {
                                getCmntOID(newHistory.RETS_ID)
                                        .then((hist) => {
                                                newHistory.OBJECTID = hist.features[0].attributes.OBJECTID
                                                if(isAttach){
                                                        const oid = hist.features[0].attributes.OBJECTID
                                                        addAttachments(oid, event, true)
                                                        newHistory.attachments = []
                                                        Array.from(event).forEach(x => newHistory.attachments.push({name: x.name}))
                                                }
                                                this.historyChat.push(newHistory)
                                                
                                        })
                                
                        })
                        .catch(err => console.log(err))
                
        },
        modifyNote(cmt, oid){
                const findItem = this.historyChat.find(note => note.OBJECTID === oid)
                findItem.CMNT = cmt
                sendChatHistory(findItem, "modify")
                return findItem
        },
        async deleteNote(oid){
                const noteIndex = this.historyChat.findIndex(x => x.OBJECTID === oid)
                this.historyChat.splice(noteIndex, 1)
                await sendChatHistory({"OBJECTID": oid}, "delete")
                return
        },
        async replyNote(note){
                const chatObj = {RETS_ID: this.historyRetsId, CMNT: "Enter Text Here", CMNT_NM: `${appConstants.defaultUserValue[0].value}`, PARENT_ID: note.OBJECTID, SYS_GEN: 0}
                await this.sendHistoryToFeatLayer(chatObj)
                return
        },
        async sendHistoryToFeatLayer(chatObj){
                await sendChatHistory(chatObj, "add")
                const getCMNT = await getQueryLayer({"whereString": `RETS_ID = ${chatObj.RETS_ID}` }, "CREATE_DT DESC")
                const comment = getCMNT.features.find(x => x.attributes.CMNT === chatObj.CMNT)
                chatObj.OBJECTID = comment.attributes.OBJECTID
                this.isHistNotesEmpty = false
                this.historyChat.push(chatObj)
                return
        },
        attachToNote(oid, fileList){
                const chat = this.historyChat.find(x => x.OBJECTID === oid)
                if(!chat.attachments){
                        chat.attachments = []
                }
                // addAttachments(oid)
                fileList.forEach(x => chat.attachments.push({name: x.name}))
        },
})