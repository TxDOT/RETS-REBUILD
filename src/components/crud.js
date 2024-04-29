import { retsLayer, DFOProducer, retsHistory, flagRetsColor } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";
import Query from "@arcgis/core/rest/support/Query";
import { appConstants } from "../common/constant";

export async function addRETSPT(retsObj){
    //retsObj.attributes.ACTV = retsObj.attributes.ACTV.value
    return retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

export async function updateRETSPT(retsObj){
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }

    const createGeo = {
        type: "point",
        x: retsObj.geometry.x ? retsObj.geometry.x : retsObj.geometry[0],
        y: retsObj.geometry.y ? retsObj.geometry.y : retsObj.geometry[1]
    }

    let setNoRTE = retsObj.attributes.NO_RTE === true ? 1 : 0
    retsObj.attributes.NO_RTE = setNoRTE
    const copyRetsObj = JSON.stringify(retsObj)
    const enable = JSON.parse(copyRetsObj)
    enable.attributes.CREATE_DT = new Date(retsObj.attributes.CREATE_DT).getTime()
    enable.attributes.EDIT_DT = new Date(retsObj.attributes.EDIT_DT).getTime()
    enable.attributes.EDIT_NM = appConstants.userRoles.find(usr => usr.name === retsObj.attributes.EDIT_NM)?.value ?? retsObj.attributes.EDIT_NM
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

    postFlagColor(retsObj)
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
    
    // retsObj.geometry ? creatGraph.geometry = {
    //                         type: "point",
    //                         x: retsObj?.geometry[0],
    //                         y: retsObj?.geometry[1]
    //                     } : null
    
    
    return creatGraph
}

export function getDFOFromGRID(gid, dfo){
    let returnGraphic =  createGraphic({attributes: {OBJECTID: 1, GID: gid, DFO: dfo}})
    DFOProducer.applyEdits({
        updateFeatures: [returnGraphic]
    })
        .then((x) => {
            const query = new Query()
            query.where = `1=1`
            query.outFields = ["*"]
            query.returnGeometry = true
            query.returnM = true
        
            DFOProducer.queryFeatures(query)
                .then(y => console.log(y))
        })
        .catch(err => console.log(err))
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
    })
    .catch(err => console.log(err)) 
    return
}