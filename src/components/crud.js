import { retsLayer, retsHistory, flagRetsColor, retsRole } from "./map-Init";
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
        enable.attributes.RELATED_RETS = enable.attributes.RELATED_RETS.map(x => x.fullData ? x.fullData.RETS_ID : x).toString()
    }
    if(enable.attributes.STAT === 3){
        let getUserInfo = appConstants.userRoles.find(user => user.value === enable.attributes.GIS_ANALYST)
        sendWebhookEmail(enable.attributes.RETS_ID, getUserInfo.email)
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
    delete enable.attributes?.historyUpdate 

    let esriUpdateGraphic = createGraphic(enable)
    esriUpdateGraphic.geometry = createGeo

    try{
        await retsLayer.applyEdits({
            updateFeatures: [esriUpdateGraphic]
        })
    }
    catch(err){
        console.log(err)
    }

    console.log(`${retsObj.attributes.OBJECTID} updated`)
}

export async function updateRETSROLE(username, filterString) {
    const query = retsRole.createQuery();
    query.where = `USERNAME = '${username}'`; 
    query.returnGeometry = false;             
    query.outFields = ["OBJECTID", "FILTERS"]; 

    try {
        const result = await retsRole.queryFeatures(query);

        if (result.features.length === 0) {
            console.log(`No record found for USERNAME: ${username}`);
            return;
        }

        let featureToUpdate = result.features[0];
        let objectId = featureToUpdate.attributes.OBJECTID;

        let currentFilters = featureToUpdate.attributes.FILTERS || '';  
        let filterArray = currentFilters.split(',').map(filter => filter.trim()); 

        let trimmedFilterString = filterString.trim();
        
        filterArray = filterArray.filter(filter => filter !== trimmedFilterString);

        filterArray.push(trimmedFilterString);

        let updatedFilters = filterArray.join(','); 

        const esriUpdateGraphic = {
            attributes: {
                OBJECTID: objectId,       
                FILTERS: updatedFilters    
            }
        };

        const response = await retsRole.applyEdits({
            updateFeatures: [esriUpdateGraphic]
        });

        if (response.updateFeatureResults.length > 0 && response.updateFeatureResults[0].error) {
            console.error('Error updating feature:', response.updateFeatureResults[0].error);
        } else {
            console.log(`Record with USERNAME: ${username} successfully updated.`);
        }

    } catch (err) {
        console.error('Error querying or updating the feature:', err);
    }
}

export async function getFilterItems(username) {
    const query = retsRole.createQuery();
    query.where = `USERNAME = '${username}'`; 
    query.returnGeometry = false;             
    query.outFields = ["FILTERS"]; 

    try {
        const result = await retsRole.queryFeatures(query);

        if (result.features.length === 0) {
            console.log(`No record found for USERNAME: ${username}`);
            return [];
        }

        let feature = result.features[0];
        let filtersString = feature.attributes.FILTERS || ''; 

        return filtersString.split(',').map(item => item.trim()).filter(item => item.length > 0);

    } catch (err) {
        console.error('Error querying the feature:', err);
        return [];
    }
}

export async function deleteCustomQuery(username, filterToRemove) {
    
    const query = retsRole.createQuery();
    query.where = `USERNAME = '${username}'`; 
    query.returnGeometry = false;             
    query.outFields = ["OBJECTID", "FILTERS"]; 

    try {
        const result = await retsRole.queryFeatures(query);

        if (result.features.length === 0) {
            console.log(`No record found for USERNAME: ${username}`);
            return;
        }

        let featureToUpdate = result.features[0];
        let objectId = featureToUpdate.attributes.OBJECTID;

        let currentFilters = featureToUpdate.attributes.FILTERS || '';  

        let updatedFilters = currentFilters
            .split(',')
            .filter(filter => !filter.includes(filterToRemove))
            .join(',');

        const esriUpdateGraphic = {
            attributes: {
                OBJECTID: objectId,        
                FILTERS: updatedFilters   
            }
        };

        const response = await retsRole.applyEdits({
            updateFeatures: [esriUpdateGraphic]
        });

        if (response.updateFeatureResults.length > 0 && response.updateFeatureResults[0].error) {
            console.error('Error updating feature:', response.updateFeatureResults[0].error);
        } else {
            console.log(`Record with USERNAME: ${username} successfully updated.`);
        }

    } catch (err) {
        console.error('Error querying or updating the feature:', err);
    }
    
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
            return retsHistory.applyEdits({
                addFeatures: [newGraphic]
            })
        },
        modify:() => {
            let setRetsEditDate = new Date().getTime()
            // console.log(setRetsEditDate)
            // console.log(store.roadObj.find(ret => ret.attributes.RETS_ID === chat.RETS_ID))
            // let findStoreRetsObj = store.roadObj.find(ret => ret.attributes.RETS_ID === chat.RETS_ID)
            // findStoreRetsObj.attributes.EDIT_DT = setRetsEditDate

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