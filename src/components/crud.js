import { retsLayer } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";

export async function addRETSPT(retsObj){
    return retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

export async function updateRETSPT(retsObj){
    console.log(retsObj)
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    let esriUpdateGraphic = createGraphic(retsObj)
    await retsLayer.applyEdits({
        updateFeatures: [esriUpdateGraphic]
    })
}

export function deleteRETSPT(retsObj){
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    let esriDelGraphic = createGraphic(retsObj)
    retsLayer.applyEdits({
        deleteFeatures: [esriDelGraphic]
    })
    .then(x => console.log(x))
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