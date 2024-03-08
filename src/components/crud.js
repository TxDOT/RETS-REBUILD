import { retsLayer } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";

function addRETSPT(){
    retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

export async function updateRETSPT(retsObj){
    retsObj.RELATED_RETS = retsObj.RELATED_RETS.map(x => x.name).toString()
    let esriUpdateGraphic = createGraphic(retsObj)
    await retsLayer.applyEdits({
        updateFeatures: [esriUpdateGraphic]
    })
}

export function deleteRETSPT(retsObj){
    retsObj.RELATED_RETS = retsObj.RELATED_RETS.map(x => x.name.RETS_ID).toString()
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
        attributes: retsObj
    })
}