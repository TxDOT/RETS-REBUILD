import { retsLayer } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";

function addRETSPT(){
    retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

export function updateRETSPT(retsObj){
    console.log(retsObj)
    let esriUpdateGraphic = createGraphic(retsObj)
    retsLayer.applyEdits({
        updateFeatures: [esriUpdateGraphic]
    })
    .then(() => console.log(`${retsObj.RETS_ID} has been updated`))
    .catch(err => console.log(err))
}

export function deleteRETSPT(retsObj){
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