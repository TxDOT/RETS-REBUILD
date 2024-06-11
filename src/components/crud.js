import { retsLayer, retsHistory, flagRetsColor } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";
import { appConstants } from "../common/constant";
import {store} from './store.js'
export async function addRETSPT(retsObj){
    //retsObj.attributes.ACTV = retsObj.attributes.ACTV.value
    return retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

export async function updateRETSPT(retsObj){
    
    const createGeo = {
        type: "point",
        x: retsObj.geometry.x ? retsObj.geometry.x : retsObj.geometry[0],
        y: retsObj.geometry.y ? retsObj.geometry.y : retsObj.geometry[1]
    }
    
    const copyRetsObj = JSON.stringify(retsObj)
    const enable = JSON.parse(copyRetsObj)
    enable.attributes.CREATE_DT = new Date(retsObj.attributes.CREATE_DT).getTime()
    enable.attributes.EDIT_DT = new Date(retsObj.attributes.EDIT_DT).getTime()
    enable.attributes.EDIT_NM = appConstants.userRoles.find(usr => usr.name === retsObj.attributes.EDIT_NM)?.value ?? retsObj.attributes.EDIT_NM
    enable.attributes.CREATE_NM = appConstants.userRoles.find(usr => usr.name === retsObj.attributes.CREATE_NM)?.value ?? retsObj.attributes.CREATE_NM
    enable.attributes.NO_RTE = enable.attributes.NO_RTE === true ? 1 : 0

    if(enable.attributes.RELATED_RETS){
        enable.attributes.RELATED_RETS = enable.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    //enable.attributes.DFO = Number(DFO)
    retsObj.attributes.flagColor.FLAG === "" ? null : postFlagColor(retsObj)
    delete enable.attributes?.retsPt
    delete enable.attributes?.STATUS
    delete enable.attributes?.index
    delete enable.attributes?.logInUser
    delete enable.attributes?.flagColor 
    delete enable.attributes?.visibilty
    delete enable.attributes?.mdiaccountgroup
    delete enable.attributes?.mdipencilboxoutline
    delete enable.attributes?.mdialarm
    delete enable.attributes?.mdicheckdecagramoutline
    delete enable.attributes?.mditimersand
    delete enable.attributes?.mdiaccountmultiplecheck
    delete enable.attributes?.mdiexclamation

    let esriUpdateGraphic = createGraphic(enable)
    esriUpdateGraphic.geometry = createGeo

    await retsLayer.applyEdits({
        updateFeatures: [esriUpdateGraphic]
    })
    console.log(`${retsObj.attributes.OBJECTID} updated`)
}

export function deleteRETSPT(retsObj){
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    let esriDelGraphic = createGraphic(retsObj)
    retsLayer.applyEdits({
        deleteFeatures: [esriDelGraphic]
    })
    .then(() => console.log(`${retsObj.attributes.OBJECTID} deleted`))
    .catch(err => console.log(err))
}


function createGraphic(retsObj){
    delete retsObj?.attributes?.index
    delete retsObj?.attributes?.logInUser
    delete retsObj?.attributes?.retsPt
    delete retsObj?.attributes?.STATUS
    const creatGraph = new Graphic({
        attributes: retsObj.attributes ?? retsObj
    })
    
    return creatGraph
}

export async function sendChatHistory(chat, type){
    //take chat and send it chat history feature layer
    //create Graphic acceptable to be sent feature layer
    //if new ; add to feature layer
    //if update ; update feature in history feature layer
    //if delete ; delete feature in history feature layer
    let newGraphic;
    const chatType = {
        add: () => {
            newGraphic = createGraphic(chat)
            return retsHistory.applyEdits({
                addFeatures: [newGraphic]
            })
        },
        modify:() => {
            newGraphic = createGraphic(chat)
            return retsHistory.applyEdits({
                updateFeatures: [newGraphic]
            })
        },
        delete:() =>{
            newGraphic = createGraphic(chat)
            return retsHistory.applyEdits({
                deleteFeatures: [newGraphic]
            })
        }
    }
    
    const returnStatus = await chatType[type]()
    return returnStatus
    // return addRETSPT(newGraphic, "hist")
}

export function postFlagColor(rets){
    //if OBJECTID is blank, would mean its a new flag insert
    const flagGraphic = createGraphic(rets.attributes.flagColor)
    if(rets.attributes.flagColor.OBJECTID === ''){
        flagRetsColor.applyEdits({
            addFeatures: [flagGraphic]
        })
        .then(() => {
            //do nothing
            const findFlag = store.userRetsFlag.find(ret => ret.RETS_ID === flagGraphic.attributes.RETS_ID)
            findFlag ? findFlag.FLAG = flagGraphic.attributes.FLAG : store.userRetsFlag.push({FLAG: flagGraphic.attributes.FLAG, OBJECTID: flagGraphic.attributes.OBJECTID, RETS_ID: flagGraphic.attributes.RETS_ID, USERNAME: flagGraphic.attributes.USERNAME})
        })
        .catch(err => console.log(err)) 
        return
    }
    //if OBJECTID is filled, would mean its a update flag insert
    flagRetsColor.applyEdits({
        updateFeatures: [flagGraphic]
    })
    .then(() => {
        //do nothing
        const findFlag = store.userRetsFlag.find(ret => ret.RETS_ID === flagGraphic.attributes.RETS_ID)
        findFlag.FLAG = flagGraphic.attributes.FLAG
    })
    .catch(err => console.log(err)) 
    return
}