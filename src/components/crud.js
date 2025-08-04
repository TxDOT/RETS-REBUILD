import { retsLayer, retsHistory, flagRetsColor, retsRole } from "./map-Init";
import Graphic from "@arcgis/core/Graphic.js";
import { appConstants } from "../common/constant";
import {store} from './store.js'


export async function addRETSPT(retsObj){
    return retsLayer.applyEdits({
        addFeatures: [retsObj]
    })
}

// export async function updateRETSPT(retsObj){
    
//     const createGeo = {
//         type: "point",
//         x: retsObj.geometry.x ? retsObj.geometry.x : retsObj.geometry[0],
//         y: retsObj.geometry.y ? retsObj.geometry.y : retsObj.geometry[1]
//     }
    
//     const copyRetsObj = JSON.stringify(retsObj)
//     const enable = JSON.parse(copyRetsObj)
//     enable.attributes.CREATE_DT = new Date(retsObj.attributes.CREATE_DT).getTime()
//     enable.attributes.EDIT_DT = new Date(retsObj.attributes.EDIT_DT).getTime()
//     enable.attributes.EDIT_NM = appConstants.userRoles.find(usr => usr.name === retsObj.attributes.EDIT_NM)?.value ?? retsObj.attributes.EDIT_NM
//     enable.attributes.CREATE_NM = appConstants.userRoles.find(usr => usr.name === retsObj.attributes.CREATE_NM)?.value ?? retsObj.attributes.CREATE_NM
//     enable.attributes.NO_RTE = enable.attributes.NO_RTE === true ? 1 : 0
//     enable.attributes.DIST_ANALYST = enable.attributes.DIST_ANALYST.toString()
//     enable.attributes.DFO = enable.attributes.DFO?.length ? Number(enable.attributes.DFO) : null

//     if(enable.attributes.RELATED_RETS){
//         enable.attributes.RELATED_RETS = enable.attributes.RELATED_RETS.map(x => x.fullData ? x.fullData.RETS_ID : x).toString()
//     }
//     if(enable.attributes.STAT === 3){
//         let getUserInfo = appConstants.userRoles.find(user => user.value === enable.attributes.GIS_ANALYST)
//         store.devStatus === "dev" ? sendWebhookEmail(enable.attributes.RETS_ID, getUserInfo.email) : null
//     }
    
//     retsObj.attributes.flagColor.FLAG === "" ? null : postFlagColor(retsObj)
    
//     delete enable.attributes?.retsPt
//     delete enable.attributes?.STATUS
//     delete enable.attributes?.index
//     delete enable.attributes?.logInUser
//     delete enable.attributes?.flagColor 
//     delete enable.attributes?.visibilty
//     delete enable.attributes?.mdiaccountgroup
//     delete enable.attributes?.mdipencilboxoutline
//     delete enable.attributes?.mdialarm
//     delete enable.attributes?.mdicheckdecagramoutline
//     delete enable.attributes?.mditimersand
//     delete enable.attributes?.mdiaccountmultiplecheck
//     delete enable.attributes?.mdiexclamation
//     delete enable.attributes?.historyUpdate 
//     delete enable.attributes?.mdipaperclip
    
//     let esriUpdateGraphic = createGraphic(enable)
//     esriUpdateGraphic.geometry = createGeo
//     try{
//         let updateResp = await retsLayer.applyEdits({
//             updateFeatures: [esriUpdateGraphic]
//         })

//         if(Object.hasOwn(updateResp.updateFeatureResults[0], "error")){
//             if(updateResp.updateFeatureResults[0].error){
//                 console.error(updateResp.updateFeatureResults[0].error.message)
//             }
//             return
//         }
//     }
//     catch(err){
//         console.log(err)
//     }

//     console.log(`${retsObj.attributes.OBJECTID} updated`)
// }


export async function updateRETSPT(retsObj) {
    // Construct geometry for the update
    const createGeo = {
        type: "point",
        x: retsObj.geometry.x ?? retsObj.geometry[0],
        y: retsObj.geometry.y ?? retsObj.geometry[1]
    };

    // Deep copy the object to avoid mutating the original
    const enable = JSON.parse(JSON.stringify(retsObj));


// Normalize date fields to timestamps
    enable.attributes.CREATE_DT = new Date(enable.attributes.CREATE_DT).getTime();
    enable.attributes.EDIT_DT = new Date(enable.attributes.EDIT_DT).getTime();

    // Map user names to their corresponding values from appConstants
    const getUserValue = name =>
        appConstants.userRoles.find(usr => usr.name === name)?.value ?? name;

    enable.attributes.EDIT_NM = getUserValue(enable.attributes.EDIT_NM);
    enable.attributes.CREATE_NM = getUserValue(enable.attributes.CREATE_NM);

    // Convert boolean to numeric flag
    enable.attributes.NO_RTE = enable.attributes.NO_RTE === true ? 1 : 0;

    // Ensure DIST_ANALYST is a string
    enable.attributes.DIST_ANALYST = String(enable.attributes.DIST_ANALYST);

    // Convert DFO to number or null
    enable.attributes.DFO = enable.attributes.DFO?.length ? Number(enable.attributes.DFO) : null;

    // Flatten RELATED_RETS to comma-separated RETS_IDs
    if (enable.attributes.RELATED_RETS) {
        enable.attributes.RELATED_RETS = enable.attributes.RELATED_RETS
            .map(x => x.fullData ? x.fullData.RETS_ID : x)
            .toString();
    }

    // If status is 3, send webhook email in dev mode
    if (enable.attributes.STAT === 3) {
        const userInfo = appConstants.userRoles.find(user => user.value === enable.attributes.GIS_ANALYST);
        if (store.devStatus === "dev" && userInfo?.email) {
            sendWebhookEmail(enable.attributes.RETS_ID, userInfo.email);
        }
    }

    // Post flag color if set
    if (retsObj.attributes.flagColor?.FLAG) {
        postFlagColor(retsObj);
    }

    // Remove unnecessary or UI-specific attributes
    const attributesToRemove = [
        "retsPt", "STATUS", "index", "logInUser", "flagColor", "visibilty",
        "mdiaccountgroup", "mdipencilboxoutline", "mdialarm", "mdicheckdecagramoutline",
        "mditimersand", "mdiaccountmultiplecheck", "mdiexclamation", "historyUpdate", "mdipaperclip"
    ];
    attributesToRemove.forEach(attr => delete enable.attributes?.[attr]);

    // Create ESRI graphic and assign geometry
    const esriUpdateGraphic = createGraphic(enable);
    esriUpdateGraphic.geometry = createGeo;

    // Attempt to apply edits to the layer
    try {
        const updateResp = await retsLayer.applyEdits({
            updateFeatures: [esriUpdateGraphic]
        });

        const updateResult = updateResp.updateFeatureResults?.[0];
        if (updateResult?.error) {
            console.error(updateResult.error.message);
            return;
        }
    } catch (err) {
        console.error("Update failed:", err);
    }

    console.log(`${retsObj.attributes.OBJECTID} updated`);
}

















export async function deleteRETSPT(retsObj){
    if(retsObj.attributes.RELATED_RETS){
        retsObj.attributes.RELATED_RETS = retsObj.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID).toString()
    }
    let esriDelGraphic = createGraphic(retsObj)
    await retsLayer.applyEdits({
        deleteFeatures: [esriDelGraphic]
    })

    console.log(`${retsObj.attributes.OBJECTID} deleted`)

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
            console.log(newGraphic)
            return retsHistory.applyEdits({
                addFeatures: [newGraphic]
            })
        },
        modify:() => {
            let setRetsEditDate = new Date().getTime()

            let a = createGraphic({"OBJECTID": chat.RETS_ID, "EDIT_DT": setRetsEditDate})
            retsLayer.applyEdits({
                updateFeatures: [a]
            })
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
        flagGraphic.attributes.OBJECTID = rets.attributes.OBJECTID
        flagGraphic.attributes.USERNAME = appConstants.defaultUserValue[0].value
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


export async function addRETSFilter(customQuery){
    let esriUpdateGraphic = createGraphic(customQuery)

    try{
        await retsRole.applyEdits({
            updateFeatures: [esriUpdateGraphic]
        })
        console.log(`RETSROLE updated`)
        return
    }
    catch(err){
        console.log(err)
    }
}

export async function addSettings(settingsObject){
    let esriUpdateGraphic = createGraphic(settingsObject)

    try{
        await retsRole.applyEdits({
            updateFeatures: [esriUpdateGraphic]
        })
        console.log(`RETSROLE updated`)
        return
    }
    catch(err){
        console.log(err)
    }
}

function sendWebhookEmail(retsNum, gisUser){
    fetch(`https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP-MB/RETS_Notify_DEV.fmw?Email=${gisUser}&RETSnumber=${retsNum}&opt_showresult=false&opt_servicemode=sync&token=0c12a2e7bd8784956b6b5750f763c0bf1b18323e`)
    .then(res => console.log(res))
    .catch(err => console.log(err))

    return
}