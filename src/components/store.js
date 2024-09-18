import { reactive } from 'vue';
import { appConstants } from '../common/constant';
import {sendChatHistory} from './crud.js'
import {getQueryLayer, getCmntOID, addAttachments, getAttachmentInfo, filterMapActivityFeed, getHistoryView} from './utility.js'

export const store = reactive({
        devStatus: "prod",
        currFilter: "",
        lastQuery : "",
        filterItems: [],
        filterquery: "",
        clickevent: "",
        count: 0,
        isCloseDetail: false,
        clickStatus: false,
        taskGem: 0,
        clickedGraphic: 0,
        isDetailsPage: false,
        cancelpopup: false,
        activityBanner: "Activity Feed",
        isNoRets: false,
        RetsCardStatus: "RETSBOT is refreshing your RETS",
        isCard: true,
        currentInfo: "",
        history: "",
        updateChatHistory: {},
        historyRetsId: 0,
        historyChat: [],
        allHistoryChat: [],
        chatAttachments: [],
        attachment: [],
        addNoteOid: 0,
        sort: "ASC",
        roadHighlightObj: new Set(),
        isShowSelected: false,
        isSelectEnabled: false,
        showSelected:[],
        userRetsFlag: [],
        isColorPicked: false,
        flagClickedId: "",
        flagRETSID: null,
        archiveRetsData: [],
        zoomInToEnable: true,
        zoomInText: "Move RETS Point",
        archiveRetsDataString: "",
        nextRoad: [],
        roadObj: [],
        roadObjOverflow: [],
        retsObj: {
                attributes:{
                        RTE_NM: "",
                        DFO: 0
                }
        },
        updateRetsSearch:[],
        updatedRetsPtName: "",
        loggedInUser:"",
        isAttachedActive: false,
        numAttachments: 0,
        //retsFilters: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "EDIT_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": appConstants.defaultStatValues, 
                         //"ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": appConstants.defaultUserValue, 
                         //"filterTotal": 2},
        isDisableValidations: false,
        isSaveBtnDisable: true,
        closeIsRoadExist: false,
        isCancelBtnDisable: false,
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
        addPtRd: "",
        toggleFeed: 1, 
        DFO: null,
        outOfRange: false,
        isAdd: false,
        cancelEvent: null,
        highlight: null,
        isSaving: false,
        savedFilter: "",
        coordinatenotification: false,
        latlonstring:"",
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
        async addNote(cmnt, isAttach, isExpand){
                const date = new Date().getTime()
                const newHistory = {RETS_ID: this.historyRetsId, CMNT: cmnt, CMNT_NM: `${appConstants.defaultUserValue[0].value}`, SYS_GEN: 0, CREATE_DT: date, EDIT_DT: date, CMNT_TYPE_ID: 0}
                try{
                        await sendChatHistory(newHistory, "add")
                        let newDate = new Date().getTime()
                        if(this.isShowSelected){
                                this.roadHighlightObj.forEach((x) => {
                                        if(x.attributes.RETS_ID === this.historyRetsId){
                                                x.attributes.EDIT_DT = newDate
                                        }
                                        
                                })
                        }

                        
                        const returnComments = await getCmntOID(newHistory.RETS_ID)
                        store.addNoteOid = returnComments.features[0].attributes.OBJECTID
                        newHistory.OBJECTID = isExpand ? `${returnComments.features[0].attributes.OBJECTID}` : returnComments.features[0].attributes.OBJECTID
                        if(isAttach){
                                const oid = returnComments.features[0].attributes.OBJECTID
                                addAttachments(oid, store.attachment, true)
                                newHistory.attachments = []
                                Array.from(store.attachment).forEach(x => newHistory.attachments.push({name: x.name}))
                                store.attachment = []
                        }
                        this.historyChat.push(newHistory)
                }
                catch(err){
                        console.log(err)
                }
                        
                
        },
        modifyNote(cmt, oid){
                const modDate = new Date().getTime()
                if(this.isShowSelected){
                        this.roadHighlightObj.forEach((x) => {
                                if(x.attributes.RETS_ID === this.historyRetsId){
                                        x.attributes.EDIT_DT = new Date(modDate).toLocaleString('en-US')
                                }
                                
                        })
                        let test = new Set([...this.roadHighlightObj].sort((a,b) => new Date(a.attributes.EDIT_DT) - new Date(b.attributes.EDIT_DT)))
                        console.log(test)
                }
                const findItem = this.historyChat.find(note => note.OBJECTID === oid)
                findItem.EDIT_DT = modDate
                findItem.CMNT = cmt
                findItem.CMNT_TYPE_ID = 0
                sendChatHistory(findItem, "modify")
                return findItem
        },
        async deleteNote(oid){
                const noteIndex = this.historyChat.findIndex(x => x.OBJECTID === oid)
                if(this.historyChat.at(noteIndex).attachments){
                        store.numAttachments -= 1
                }
                this.historyChat.splice(noteIndex, 1)
                await sendChatHistory({"OBJECTID": oid}, "delete")
                return
        },
        async replyNote(note){
                const updateDate = new Date().getTime()
                const chatObj = {RETS_ID: this.historyRetsId, CMNT: null, CMNT_NM: `${appConstants.defaultUserValue[0].value}`, PARENT_ID: note.OBJECTID, SYS_GEN: 0, CREATE_DT: updateDate, EDIT_DT: updateDate, CMNT_TYPE_ID: 0}
                const oidReturn = await this.sendHistoryToFeatLayer(chatObj)

                return oidReturn
        },
        async sendHistoryToFeatLayer(chatObj){
                await sendChatHistory(chatObj, "add")
                const getCMNT = await getQueryLayer({"whereString": `RETS_ID = ${chatObj.RETS_ID}`, "queryLayer": "retsHistory" }, "CREATE_DT DESC")
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
        // preserveHighlightCards(){
        //         if(this.isShowSelected){
        //                 console.log(this.roadHighlightObj)
        //                 this.updateRetsSearch = [...this.roadHighlightObj]
        //                 console.log(this.updateRetsSearch)
        //                 return
        //         }
        //         return
        // },
        async getRetsLayer(userid, where, layer, orderFields){ //////////////////////////remove userid from here
                this.loggedInUser = userid
                const queryString = {"whereString": where, "queryLayer": layer}
                //const orderField = "EDIT_DT DESC, PRIO"
                try{
                        this.roadObj.length = 0
                        this.updateRetsSearch.length = 0
                        getQueryLayer(queryString, orderFields)
                                .then((obj) => {
                                        if(obj.features.length){
                                                obj.features.forEach((x, i) => {
                                                        x.attributes.flagColor = this.setFlagColor(x.attributes)
                                                        x.attributes.CREATE_NM = this.returnUserName(x.attributes.CREATE_NM)
                                                        x.attributes.EDIT_NM = this.returnUserName(x.attributes.EDIT_NM)
                                                        x.attributes.CREATE_DT = this.returnDateFormat(x.attributes.CREATE_DT)
                                                        x.attributes.EDIT_DT = this.returnDateFormat(x.attributes.EDIT_DT)
                                                        x.attributes.mdiaccountmultiplecheck = this.isAssigned(x.attributes.ASSIGNED_TO)
                                                        x.attributes.mdiaccountgroup = this.isMOTxDOTConnct(x.attributes.ACTV)
                                                        x.attributes.mdipencilboxoutline = this.isRequest(x.attributes.ACTV)
                                                        x.attributes.mdialarm = this.isDeadline(x.attributes.DEADLINE)
                                                        x.attributes.mdicheckdecagramoutline = this.isComplete(x.attributes.STAT)
                                                        x.attributes.mditimersand = this.isNoActivity(x.attributes.STAT, x.attributes.EDIT_DT)
                                                        x.attributes.mdiexclamation = this.isPrio(x.attributes.PRIO)
                                                        x.attributes.DFO = x.attributes.DFO ? x.attributes.DFO.toFixed(3) : x.attributes.DFO
                                                        x.attributes.historyUpdate = "Loading"
                                                        this.roadObj.push({attributes: x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                                                        //store.archiveRetsData.push({attributes: x.attributes, geometry: [x.geometry.x, x.geometry.y]})
                                                })
                                                
                                                this.updateRetsSearch = this.roadObj
                                                return
                                        }
                                        if(!obj.features.length){
                                                this.RetsCardStatus = "Bummer or lucky?? No Rets for you!"
                                                return 
                                        }
                                })



                        this.isDetailsPage = false
                        this.isNoRets = true
                }
                
                catch(err){

                }    
        },
        setFilterFeed(){
                filterMapActivityFeed(this.filter)
                        .then((resp) => {
                                this.RetsCardStatus = "RETSBOT is working hard to get you those RETS!"
                                this.roadObj = []
                                this.updateRetsSearch = []
                                const query = {"whereString": `${resp}`, "queryLayer": "retsLayerLayerView"}
                                const orderField = `${this.filter.createDt.filter} ${this.filter.createDt.sortType}`
                                 
                                this.getRetsLayer(store.loggedInUser, query.whereString, query.queryLayer, orderField)
                                
                                this.isDetailsPage = false
                                this.isNoRets = true
                                return
                        })
                        .catch(err => console.log(err))
                        
        },
        addRetsID(ret){
                this.roadObj.push(ret)
                this.roadObj.sort((a,b) => new Date(b.attributes.EDIT_DT) - new Date(a.attributes.EDIT_DT))
        },
        async updateRetsID(){
                //find updated rets
                //find rets in roadObj and update that index
                const resp = `${store.savedFilter}`
                const query = {"whereString": `${resp}`, "queryLayer": "retsLayer"}
                const orderField = `${this.CREATE_DT.filter} ${this.CREATE_DT.sortType}`
                const obj = await getQueryLayer(query, orderField)
                        if(obj.features.length){
                                
                                const updateItem = {attributes: obj.features[0].attributes, geometry: [obj.features[0].geometry.x, obj.features[0].geometry.y]}
                                updateItem.attributes.flagColor = this.setFlagColor(obj.features[0].attributes)
                                updateItem.attributes.CREATE_NM = this.returnUserName(obj.features[0].attributes.CREATE_NM)
                                updateItem.attributes.EDIT_NM = this.returnUserName(obj.features[0].attributes.EDIT_NM)
                                updateItem.attributes.CREATE_DT = this.returnDateFormat(obj.features[0].attributes.CREATE_DT)
                                updateItem.attributes.EDIT_DT = this.returnDateFormat(obj.features[0].attributes.EDIT_DT)
                                updateItem.attributes.mdiaccountmultiplecheck = this.isAssigned(obj.features[0].attributes.ASSIGNED_TO)
                                updateItem.attributes.mdiaccountgroup = this.isMOTxDOTConnct(obj.features[0].attributes.ACTV)
                                updateItem.attributes.mdipencilboxoutline = this.isRequest(obj.features[0].attributes.ACTV)
                                updateItem.attributes.mdialarm = this.isDeadline(obj.features[0].attributes.DEADLINE)
                                updateItem.attributes.mdicheckdecagramoutline = this.isComplete(obj.features[0].attributes.STAT)
                                updateItem.attributes.mditimersand = this.isNoActivity(obj.features[0].attributes.STAT, obj.features[0].attributes.EDIT_DT)
                                updateItem.attributes.mdiexclamation = this.isPrio(obj.features[0].attributes.PRIO)
                                updateItem.attributes.historyUpdate = "Loading"
                                //this.retsObj = updateItem
                                //const retsIndex = this.roadObj.findIndex(x => x.attributes.RETS_ID === obj.features[0].attributes.RETS_ID)
                                // if(retsIndex === -1){
                                //         this.roadObj.push(updateItem)
                                // }
                                // else{
                                //         this.roadObj.splice(retsIndex, 1, updateItem)
                                // }
                                        
                                        //sort by no activity setting (no activity sand thingy)
                                this.roadObj.sort((a,b) => new Date(b.attributes.EDIT_DT) - new Date(a.attributes.EDIT_DT))
                                this.updateRetsSearch = this.roadObj
                                const cloneRets = [...this.roadObj]
                                this.archiveRetsData = cloneRets

                                this.isNoRets = false
                                return
                        }
                this.
                this.isDetailsPage = false
                this.isNoRets = true
                return
        },
        deleteRetsID(){
                const findIndex = this.roadObj.findIndex(ret => ret.attributes.OBJECTID === store.retsObj.attributes.OBJECTID)
                console.log(findIndex)
                console.log(this.updateRetsSearch)
                this.updateRetsSearch.splice(findIndex, 1)

                const cloneRets = [...this.roadObj]
                this.archiveRetsData = cloneRets
        },
        returnUserName(n){
                if(!n) {
                    return "My name is Null"
                }
                const usernameRow = appConstants.userRoles.find(name => name.value === n)
                return usernameRow?.name ?? 'My name is not in the RESP table :('
        },
        returnDateFormat(e){
                //10/29/2023 09:11am
                const date = new Date(e)
                return `${date.toLocaleString('en-US')}`
        },
   
        isAssigned(ASSIGNED_TO){
                if(ASSIGNED_TO === store.loggedInUser){
                        return true
                }
                return false
        },
        isMOTxDOTConnct(ACTV){
                if(ACTV === "TxDOTConnect" || ACTV === 'Minute Order'){
                        return true
                }
                return false
        },
        isRequest(ACTV){
                if(ACTV === "Request"){
                        return true
                }
                return false
        },
        isDeadline(DEADLINE){
                if(!DEADLINE) return {bool: false, color: "white"}
                 if(DEADLINE){
                        const deadlineDate = new Date(DEADLINE)
                        const setDeadlineDate = `${deadlineDate.getMonth()+1}/${deadlineDate.getDate()}/${deadlineDate.getFullYear()}`
                        const todaysDate = new Date()
                        const oneDay = 24*60*60*1000;
                        const calcTime = deadlineDate.getTime() - todaysDate.getTime()
                        const pastDeadline = Math.round(calcTime/oneDay)
                        if(DEADLINE && pastDeadline < 0){
                                return {bool: true, color: "red", date: setDeadlineDate}
                        }
                        return {bool: true, color: "white", date: setDeadlineDate}
                }
                return {bool: false, color: "white"}

        },
        isComplete(STAT){
                if(STAT === 3){
                        return true
                }
                return false
        },
        isNoActivity(STAT, EDIT_DT){
                const editDt = new Date(EDIT_DT)
                const todayDate = new Date()
                const oneDay = 24*60*60*1000;
                const calcTime = todayDate.getTime() - editDt.getTime()
                const calcDate = Math.round(calcTime/oneDay)
                if(STAT === 2 && calcDate > 25){
                        return {bool: true, numDays: calcDate}
                }
                return {bool: false, numDays: calcDate}
        },
        isPrio(PRIO){
                if(PRIO === 0){
                        return true
                }
                return false
        },

        checkDetailsForComplete(){
                let item = [this.retsObj.attributes.RTE_NM, this.retsObj.attributes.DFO, this.retsObj.attributes.STAT, this.retsObj.attributes.DESC_].filter(x => !x)
                
                const fieldsToCheck = [
                        this.retsObj.attributes.GIS_ANALYST, this.retsObj.attributes.GRID_ANALYST, 
                        this.retsObj.attributes.DIST_ANALYST, this.retsObj.attributes.DIST_NM, 
                        this.retsObj.attributes.CNTY_NM
                    ]
                
                !this.retsObj.attributes.NO_RTE ? fieldsToCheck.push(this.retsObj.attributes.DFO) : null    
                const metadataIsUpdate = fieldsToCheck.some(x => !x)

                if(item.length && !this.retsObj.attributes.NO_RTE && this.isAlert){
                    this.isSaveBtnDisable = true
                    return
                }
                this.isSaveBtnDisable = metadataIsUpdate
        }         
        // async returnTopCMNT(retsID){
        //         const topCMNT = returnTopHistory(retsID)
        //         top.CMNT.features.map(cmnt => ``)
        // }


})