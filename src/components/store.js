import { reactive } from 'vue';
import { appConstants } from '../common/constant';
import {sendChatHistory} from './crud.js'
import {getQueryLayer, getCmntOID, addAttachments, getAttachmentInfo, filterMapActivityFeed} from './utility.js'

export const store = reactive({
        count: 0,
        isCloseDetail: false,
        taskGem: 0,
        clickedGraphic: 0,
        isDetailsPage: false,
        activityBanner: "Activity Feed",
        isNoRets: false,
        isCard: true,
        currentInfo: "",
        history: "",
        updateChatHistory: {},
        historyRetsId: 0,
        historyChat: [],
        chatAttachments: [],
        attachment: [],
        addNoteOid: 0,
        sort: "ASC",
        roadHighlightObj: new Set(),
        isShowSelected: false,
        showSelected:[],
        userRetsFlag: [],
        archiveRetsData: [],
        archiveRetsDataString: "",
        roadObj: [],
        retsObj: [],
        updatedRetsPtName: "",
        loggedInUser:"",
        isAttachedActive: false,
        numAttachments: 0,
        //retsFilters: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "EDIT_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         //"ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": appConstants.defaultUserValue, 
                         //"filterTotal": 2},
        isDisableValidations: false,
        isSaveBtnDisable: false,
        isMoveRetsPt: false,
        showPopUp: false,
        dfoIndex: 0,
        isAlert: false,
        alertTextInfo: {"text": "Chat Saved", "color": "#70ad47", "type":"info","toggle": true},
        logDfo: 0,
        archiveFilter:{},
        CREATE_DT: {title: "Date: Newest to Oldest", sortType: "DESC", filter: "EDIT_DT"},
        JOB_TYPE:[],
        EDIT_DT: null,
        STAT:appConstants.defaultStatValues,
        ACTV:[],
        DIST_NM:[],
        CNTY_NM:[],
        USER:[],
        isAssignedTo: false,
        filterTotal: 2,
        isfilter: false,
        filterQuery: "",
        filter: {},
        editText: false,
        defaultFilterSetup(){
                // this.CREATE_DT.push({title: "Date: Newest to Oldest", sortType: "DESC", filter: "EDIT_DT"})
                // this.STAT = appConstants.defaultStatValues
                // this.USER.push(appConstants.userRoles.find(usr => usr.value === appConstants.defaultUserValue[0].value))
                store.filterTotal = 2

                this.filter.createDt = this.CREATE_DT
                this.filter.jobType = this.JOB_TYPE
                this.filter.editDt = this.EDIT_DT
                this.filter.stat = this.STAT
                this.filter.actv = this.ACTV
                this.filter.distNM = this.DIST_NM
                this.filter.cntyNM = this.CNTY_NM
                this.filter.user = this.USER
                this.filter.isAssignedTo = this.isAssignedTo
                return
        },
        async getHistoryChatRet(){
                try{    
                        if(!this.history.length) return
                        const getRelatedHistory = this.historyChat
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
                }
                catch(err){
                        console.log(err)
                }

        },
        async addNote(cmnt, isAttach){
                const date = new Date()
                const newHistory = {RETS_ID: this.historyRetsId, CMNT: cmnt, CMNT_NM: `${appConstants.defaultUserValue[0].value}`, SYS_GEN: 0, CREATE_DT: date, EDIT_DT: date }
                try{
                        await sendChatHistory(newHistory, "add")
                       
                        const returnComments = await getCmntOID(newHistory.RETS_ID)

                        store.addNoteOid = returnComments.features[0].attributes.OBJECTID
                        newHistory.OBJECTID = returnComments.features[0].attributes.OBJECTID
                        if(isAttach){
                                const oid = returnComments.features[0].attributes.OBJECTID
                                addAttachments(oid, store.attachment, true)
                                newHistory.attachments = []
                                Array.from(store.attachment).forEach(x => newHistory.attachments.push({name: x.name}))
                        }
                        this.historyChat.push(newHistory)
                        let divA = document.getElementById("chatDiv") 
                        let divB = document.getElementById("chatDivExpand")?.parentElement?.lastElementChild
                        divA.scrollIntoView({ behavior: 'smooth', block: 'start'})
                        divB?.scrollIntoView({ behavior: 'smooth', block: 'end'})

                }
                catch(err){
                        console.log(err)
                }
                        
                
        },
        modifyNote(cmt, oid){
                const modDate = new Date()
                const findItem = this.historyChat.find(note => note.OBJECTID === oid)
                findItem.EDIT_DT = modDate
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
        async replyNote(note, sortType){
                const updateDate = new Date()
                const chatObj = {RETS_ID: this.historyRetsId, CMNT: null, CMNT_NM: `${appConstants.defaultUserValue[0].value}`, PARENT_ID: note.OBJECTID, SYS_GEN: 0, CREATE_DT: updateDate, EDIT_DT: updateDate}
                const oidReturn = await this.sendHistoryToFeatLayer(chatObj)
                let divA = document.getElementById("chatDiv") 
                let divB = document.getElementById("chatDivExpand")?.parentElement?.lastElementChild
                divA.scrollIntoView({ behavior: 'smooth', block: 'start'})
                divB.scrollIntoView({ behavior: 'smooth', block: 'end'})
                return oidReturn
        },
        async sendHistoryToFeatLayer(chatObj){
                await sendChatHistory(chatObj, "add")
                const getCMNT = await getQueryLayer({"whereString": `RETS_ID = ${chatObj.RETS_ID}` }, "CREATE_DT DESC")
                const comment = getCMNT.features.find(x => x.attributes.CMNT === chatObj.CMNT)
                chatObj.OBJECTID = comment.attributes.OBJECTID
                this.isHistNotesEmpty = false
                this.historyChat.push(chatObj)
                return comment.attributes.OBJECTID
        },
        attachToNote(oid, fileList){
                const chat = this.historyChat.find(x => x.OBJECTID === oid)
                if(!chat.attachments){
                        chat.attachments = []
                }
                // addAttachments(oid)
                fileList.forEach(x => chat.attachments.push({name: x.name}))
                return
        },
        setFlagColor(att){
                const defaultValue = {FLAG: '', OBJECTID: '', RETS_ID: att.RETS_ID, USERNAME: this.loggedInUser}
                const retsFlag = store.userRetsFlag.find((flag) => flag.RETS_ID === att.RETS_ID)
                
                return retsFlag ?? defaultValue
        },
        preserveHighlightCards(){
                if(this.isShowSelected){
                        this.roadObj = this.roadObj.filter(rd => this.roadHighlightObj.has(String(rd.attributes.RETS_ID).concat('-',rd.attributes.OBJECTID)))
                        return
                }
                return
        },
        async getRetsLayer(userid){
                this.loggedInUser = userid
                const queryString = {"whereString": appConstants['defaultQuery'](userid), "queryLayer": "retsLayer"}
                const orderField = "EDIT_DT DESC, PRIO"
                getQueryLayer(queryString, orderField)
                .then(obj => {
                    if(obj.features.length){
                        obj.features.forEach((x) => {
                            x.attributes.flagColor = this.setFlagColor(x.attributes)
                            x.attributes.DFO = x.attributes.DFO ? x.attributes.DFO.toFixed(3) : x.attributes.DFO
                            x.attributes.visibilty = "flex"
                            this.roadObj.push({attributes: x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                            store.archiveRetsData.push({attributes: x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                        })
                        return
                    }
                    this.isDetailsPage = false
                    this.isNoRets = true
                    })
                .catch((err)=> console.log(err)) 
        },
        setFilterFeed(){
                filterMapActivityFeed(this.filter)
                        .then((resp) => {
                                this.roadObj = []
                                const query = {"whereString": `${resp}`, "queryLayer": "retsLayer"}
                                const orderField = `${this.filter.createDt.filter} ${this.filter.createDt.sortType}`
                                
                                getQueryLayer(query, orderField)
                                    .then(obj => {
                                        if(obj.features.length){
                                            obj.features.forEach((x) => {
                                                x.attributes.flagColor = this.setFlagColor(x.attributes)
                                                if(store.isShowSelected){
                                                    x.attributes.visibilty = store.roadHighlightObj.includes(String(x.attributes.RETS_ID).concat('-',x.attributes.OBJECTID)) ? "flex" : "none" 
                                                }
                                                else{
                                                    x.attributes.visibilty = "flex"
                                                }
                                                this.roadObj.push({attributes:x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                                                
                                            })
                                            this.isNoRets = false
                                            return
                                        }
                                        this.isDetailsPage = false
                                        this.isNoRets = true
                                        return
                                    })
                                    .catch((err)=> {
                                        console.log(err)
                                    })
                        })
                        .catch(err => console.log(err))
        },
        addRetsID(ret){
                this.roadObj.push(ret)
                this.roadObj.sort((a,b) => b.attributes.EDIT_DT - a.attributes.EDIT_DT)
        },
        updateRetsID(){
                //find updated rets
                //find rets in roadObj and update that index
                
                const resp = `RETS_ID = ${this.retsObj.attributes.RETS_ID}`
                const query = {"whereString": `${resp}`, "queryLayer": "retsLayer"}
                const orderField = `${this.CREATE_DT.filter} ${this.CREATE_DT.sortType}`
                getQueryLayer(query, orderField)
                        .then(obj => {
                                if(obj.features.length){
                                        const updateItem = {attributes: obj.features[0].attributes, geometry: [obj.features[0].geometry.x, obj.features[0].geometry.y]}
                                        store.retsObj = updateItem
                                        updateItem.attributes.flagColor = this.setFlagColor( obj.features[0].attributes)
                                        const retsIndex = this.roadObj.findIndex(x => x.attributes.RETS_ID === obj.features[0].attributes.RETS_ID)
                                        this.roadObj.splice(retsIndex, 1, updateItem)
                                        //sort by no activity setting (no activity sand thingy)
                                        this.roadObj.sort((a,b) => b.attributes.EDIT_DT - a.attributes.EDIT_DT)
                                        
                                        const cloneRets = [...this.roadObj]
                                        this.archiveRetsData = cloneRets

                                        this.preserveHighlightCards()

                                        this.isNoRets = false
                                        return
                                }
                                this.isDetailsPage = false
                                this.isNoRets = true
                                return
                            })
                            .catch((err)=> {
                                console.log(err)
                            })
        },
        deleteRetsID(){
                const findIndex = this.roadObj.findIndex(ret => ret.attributes.OBJECTID === store.retsObj.attributes.OBJECTID)
                this.roadObj.splice(findIndex, 1)

                const cloneRets = [...this.roadObj]
                this.archiveRetsData = cloneRets
        }

})