import { retsLayer, DFOProducer } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";
import Query from "@arcgis/core/rest/support/Query";

export async function addRETSPT(retsObj){
    return retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
    
}

export async function updateRETSPT(retsObj){
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    let esriUpdateGraphic = createGraphic(retsObj)
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
    .then(x => console.log(`${retsObj.attributes.OBJECTID} deleted`))
    .catch(err => console.log(err))
}


function createGraphic(retsObj){
    delete retsObj.index
    delete retsObj.logInUser
    delete retsObj.retsPt

    return new Graphic({
        attributes: retsObj.attributes
    })
}

export function getDFOFromGRID(gid, dfo){
    let returnGraphic =  createGraphic({attributes: {OBJECTID: 1, GID: gid, DFO: dfo}})
    console.log(returnGraphic)
    DFOProducer.applyEdits({
        updateFeatures: [returnGraphic]
    })
        .then((x) => {
            console.log(x)
            const query = new Query()
            query.where = `OBJECTID = 1`
            query.outFields = ["*"]
            query.returnGeometry = true
            query.returnM = true
        
            DFOProducer.queryFeatures(query)
                .then(y => console.log(y))
        })
        .catch(err => console.log(err))
}   