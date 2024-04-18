import { retsLayer, DFOProducer, retsHistory, flagRetsColor } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";
import Query from "@arcgis/core/rest/support/Query";
import {store} from './store'

export async function addRETSPT(retsObj){
    console.log(retsObj)
    //retsObj.attributes.ACTV = retsObj.attributes.ACTV.value
    return retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

export async function updateRETSPT(retsObj){
    console.log(retsObj)
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    retsObj.attributes.ACTV = !retsObj.attributes.ACTV ? null : retsObj.attributes.ACTV
    const createGeo = {
        type: "point",
        x: retsObj.geometry.x ? retsObj.geometry.x : retsObj.geometry[0],
        y: retsObj.geometry.y ? retsObj.geometry.y : retsObj.geometry[1]
    }

    console.log(retsObj.attributes.NO_RTE)
    let setNoRTE = retsObj.attributes.NO_RTE === true ? 1 : 0
    retsObj.attributes.NO_RTE = setNoRTE
    console.log(retsObj.attributes.NO_RTE)
    retsObj.attributes.ACTV = retsObj.attributes.ACTV?.value
    postFlagColor(retsObj)
    let esriUpdateGraphic = createGraphic(retsObj)
    console.log(esriUpdateGraphic)
    esriUpdateGraphic.geometry = createGeo

    // await retsLayer.applyEdits({
    //     updateFeatures: [esriUpdateGraphic]
    // })
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
    delete retsObj?.index
    delete retsObj?.logInUser
    delete retsObj?.retsPt
    delete retsObj?.STATUS

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
    console.log(returnStatus)
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
        .then((x) => console.log(x))
        .catch(err => console.log(err)) 
        return
    }
    //if OBJECTID is filled, would mean its a update flag insert    
    flagRetsColor.applyEdits({
        updateFeatures: [flagGraphic]
    })
    .then((x) => console.log(x))
    .catch(err => console.log(err)) 
    return
}