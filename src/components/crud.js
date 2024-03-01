import { retsLayer } from "./map-Init";

function addRETSPT(){
    retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

function updateRETSPT(retsObj){
    retsLayer.applyEdits({
        updateFeatures: [retsObj]
    })
}

export function deleteRETSPT(retsObj){
    retsLayer.applyEdits({
        deleteFeatures: [retsObj.OBJECTID]
    })
}