import {view, retsLayer, homeWidget, retsGraphicLayer, TxDotRoaways, retsHistory, graphics, flagRetsColor, sketchWidgetcreate, retsPointRenderer} from './map-Init'
import Query from "@arcgis/core/rest/support/Query.js";
import Graphic from "@arcgis/core/Graphic.js";
import { appConstants } from "../common/constant.js";
import {store} from './store.js'
//import {getDFOFromGRID} from './crud.js'
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { addRETSPT, updateRETSPT } from './crud.js';
import esriRequest from "@arcgis/core/request.js";
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils.js";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

export function clickRetsPoint(){
    try{
        view.on("click", (event)=>{
            view.hitTest(event, {include: [retsLayer, retsGraphicLayer]}).then((evt) =>{
                if(!evt.results.length){
                    removeHighlight("a", true)
                    removeAllCardHighlight()
                    return
                }
                clearRoadHighlightObj()
                store.roadHighlightObj.clear()
                const retsPt = store.roadObj.find(rd => rd.attributes.OBJECTID === evt.results[0].graphic.attributes.OBJECTID)
                store.roadHighlightObj.add(retsPt)
                outlineFeedCards(evt.results)
                removeHighlight("a", true)
                if(store.isMoveRetsPt){
                    //getPointRoadInteraction(evt.results)
                    //modifyRETSPt(evt.results)
                }
                evt.results.forEach(rest => rest.graphic.layer.title ? highlightRETSPoint(rest.graphic.attributes) : highlightGraphicPt(rest.graphic.attributes))
                return evt.results[0].graphic.attributes.RETS_ID;
            })
        })
    }
    catch(err){
        console.log(err)
    }

}

export function hoverRetsPoint(){
    view.on("pointer-move", (event)=>{
        view.hitTest(event, {include: [retsLayer, retsGraphicLayer, graphics]}).then((evt) =>{
            if(!evt.results.length){
                document.getElementById("viewDiv").style.cursor = "default"
                return
            }
            document.getElementById("viewDiv").style.cursor = "pointer"
            return;
        })
    })
}

export function highlightRETSPoint(feature){
    //checks and waits for retsLayer featureLayerView
    view.whenLayerView(retsLayer)
        .then((lyrView) => {
            //highlights Point by giving OBJECTID
            lyrView.highlight(feature.OBJECTID)
            
        })
}

function highlightGraphicPt(feature){
    view.whenLayerView(retsGraphicLayer)
        .then((lyrView) => {
            store.clickedGraphic = feature.OBJECTID
            lyrView.highlight(feature.OBJECTID)
        })
}

export async function getHighlightGraphic(){
    return await view.whenLayerView(retsGraphicLayer)
}

export function removeHighlight(feature, removeAll){
    view.whenLayerView(retsLayer)
        .then((lyrView) => {
            if(removeAll){
                lyrView._highlightIds.clear()
                return
            }

            if(lyrView._highlightIds.has(feature?.attributes.OBJECTID)){
                //console.log("before: " + feature?.attributes.OBJECTID )
                lyrView._highlightIds.delete(feature?.attributes.OBJECTID)
                //console.log("after: " + feature?.attributes.OBJECTID )
                
                //return
            }
            
            return
        })
}

export function outlineFeedCards(cards){
    //return new Promise((res, rej)=>{
        cards.forEach((x) => {
            //set card outline
            var objectcomparison = x.attributes ? String(x.attributes.RETS_ID).concat('-',x.attributes.OBJECTID) : String(x.graphic.attributes.RETS_ID).concat('-',x.graphic.attributes.OBJECTID)
            if(!document.getElementById(objectcomparison)) return
            document.getElementById(objectcomparison).classList.add('highlight-card')
            //store.roadHighlightObj.add(objectcomparison)
            //zoom to card in feed
            document.getElementById(objectcomparison).scrollIntoView({behavior: 'smooth'})
            // const zoomToCard = document.createElement('a')
            // zoomToCard.href = `#${objectcomparison}`
            // zoomToCard.click(preventHashUrl())
            //remove card outline
            // setTimeout(()=>{
            //     document.getElementById(objectcomparison).classList.remove('highlight-card')
            // },5000)
        })
        //res("done too")
        //Sstore.isShowSelected ? toggleHighlightCards(bool) : null
    //})
}

export async function toggleHighlightCards(bool){
    const togglePromise = new Promise((res,rej) => {
        const getCardRows = document.getElementsByClassName("rets-card-row")
        let i;
        
        for(i=0; i < getCardRows.length; i++){
            if(bool === true){
                getCardRows[i].style.display = getCardRows[i].lastElementChild.classList.contains("highlight-card") ? "flex" : "none"
                continue
            }
            getCardRows[i].style.display = "flex"
        }
        if(!bool){
            store.roadObj = store.archiveRetsData
        }
        res("done")
        return
    })
    return await togglePromise
}

export function removeAllCardHighlight() {
    const getHighlightCardRows = document.getElementsByClassName("highlight-card")
    let i;
    for(i=0; i < getHighlightCardRows.length; i++){
        getHighlightCardRows[i].classList.remove('highlight-card')
    }
    clearRoadHighlightObj()
    return
}

export const clearGraphicsLayer = () => graphics.removeAll() 

export const clearRoadHighlightObj = () => store.roadHighlightObj.clear()

export const zoomTo = (geom) => view.goTo({center: [geom[0], geom[1]], scale: 30000})

export function getGEMTasks(){

    return [4516, 89, 1789]
    //getGemTasks when user types in #gem-search
}

//filter Map and activity feed 
export async function filterMapActivityFeed(filterOpt){
    let GIS_ANALYST = []
    let GRID_ANALYST = []
    let DIST_ANALYST = []
    let ASSIGNED_TO = []
    let STAT = []
    let DIST_NM = []
    let CNTY_NM = []
    let ACTV = []
    let JOB_TYPE = []

    let EDIT_DT = []
    
    let fullFilter = []

    for(let [key, value] of Object.entries(filterOpt)){
        // console.log(`'GIS_ANALYST' in (${GIS_ANALYST.join(" and ")})`)
        // console.log(`'GRID_ANALYST' in (${GRID_ANALYST.join(" and ")})`)
        // console.log(`'DIST_ANALYST' in (${DIST_ANALYST.join(" and ")})`)
        if(!value) continue
        if(value){
            if(key === 'user'){
                let a; 
                for(a=0; a < value.length; a++){
                    ASSIGNED_TO.push(`${value[a].value}`)
                    if(value[a].type === 1){
                        GIS_ANALYST.push(`'${value[a].value}'`)
                    }
                    if(value[a].type === 2){
                        GRID_ANALYST.push(`'${value[a].value}'`)
                    }
                    if(value[a].type === 3){
                        DIST_ANALYST.push(`'${value[a].value}'`)
                    }
                }

                GIS_ANALYST.length ? fullFilter.push(`GIS_ANALYST in (${GIS_ANALYST.join(" , ")})`) : null
                GRID_ANALYST.length ? fullFilter.push(`GRID_ANALYST in (${GRID_ANALYST.join(" , ")})`) : null
                DIST_ANALYST.length ? fullFilter.push(`DIST_ANALYST in (${DIST_ANALYST.join(" , ")})`) : null
                //ASSIGNED_TO.length ? fullFilter.push(`OR ASSIGNED_TO in (${ASSIGNED_TO.join(" , ")})`) : null
            }
            if(key === 'stat' || key === 'distNM' || key === 'cntyNM' || key === 'actv' || key === 'jobType'){

                if(key === "stat"){
                    let a; 
                    for(a=0; a < value.length; a++){
                        STAT.push(value[a].value)
                    }
                    STAT.length ? fullFilter.push(`STAT in (${STAT.join(" , ")})`) : null
                }
                if(key === 'distNM'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        DIST_NM.push(value[a].value)
                    }
                    DIST_NM.length ? fullFilter.push(`DIST_NM in (${DIST_NM.join(" , ")})`) : null
                }
                if(key === 'cntyNM'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        CNTY_NM.push(value[a].value)
                    }
                    CNTY_NM.length ? fullFilter.push(`CNTY_NM in (${CNTY_NM.join(" , ")})`) : null
                }
                if(key === 'actv'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        ACTV.push(`'${value[a].value}'`)
                    }
                    ACTV.length ? fullFilter.push(`ACTV in (${ACTV.join(" , ")})`) : null
                }
                if(key === 'jobType'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        JOB_TYPE.push(value[a].value)
                    }
                    JOB_TYPE.length ? fullFilter.push(`JOB_TYPE in (${JOB_TYPE.join(" , ")})`) : null
                }
                    continue
            }
            if(key === "editDt"){
                const splitDate = value.split("-")
                splitDate.length === 1 ? fullFilter.push(`EDIT_DT between timestamp '${splitDate[0]}' and timestamp '${splitDate[0]}'`) : fullFilter.push(`EDIT_DT  between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)
                //retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)\
                continue
            }
            // retsDefinitionExpressionArr.push(`${key} in ('${value}')`)
        }
    }

    const filterDef = fullFilter.join(" AND ")
    const filterMapPromise = new Promise((res, rej) => {
        retsLayer.definitionExpression = `${filterDef}`
        res(filterDef)
    })
    const returnFilterMapPromise = await filterMapPromise
    return filterDef


    // let retsDefinitionExpressionArr = []
    // for(let [key, value] of Object.entries(filterOpt)){
    //     if(!value || key === 'CREATE_DT' || key === 'filterTotal' || !value.length || key==='loggedInUser') continue
    //     if(value){
    //         if(key === `${appConstants.queryField[appConstants.userRoles.find(x => x.value === store.loggedInUser).type]}` || key === 'STAT' || key === 'DIST_NM' || key === 'CNTY_NM' || key === 'ACTV' || key === 'JOB_TYPE'){
    //             retsDefinitionExpressionArr.push(`${key} in (${processDomainArr(value)})`)
    //             continue
    //         }
    //         if(key === "EDIT_DT"){
    //             const splitDate = value.split("-")
    //             splitDate.length === 1 ? retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[0]}'`) : retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)
    //             ///retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)
    //             continue
    //         }
    //         retsDefinitionExpressionArr.push(`${key} in ('${value}')`)
    //     }
    // }

    // const filterMapPromise = new Promise((res, rej) => {
    //     const filterDef = retsDefinitionExpressionArr.join(' AND ')
    //     retsLayer.definitionExpression = `${filterDef}`
    //     res(filterDef)
    // })
    // const returnFilterMapPromise = await filterMapPromise
    // return returnFilterMapPromise
}

export const getDomainValues = (fieldName) => retsLayer.getFieldDomain(fieldName)

export function getDistinctAttributeValues(field){
    const query = new Query()
    query.where = `${field} is not null`
    query.orderByFields = [`${field}`]
    query.outFields = [`${field}`]
    query.returnGeometry = false,
    query.returnDistinctValues = true

    retsLayer.queryFeatures(query)
        .then((item) => {
            item.features.forEach(x => appConstants.activityList.push({"name": "ACTV", "value": x.attributes.ACTV}))
        })
}

export function processDomainArr(domain){
    const holdArr = []
    domain.forEach((x) => {
        if(x.name === 'Username' || x.name === 'ACTV'){
            holdArr.push(`'${x.value}'`)
        }
        else{
            holdArr.push(typeof x.value === "string" ? `'${x.value}'` : x.value)
        }

    })
    return holdArr
}

export function getQueryLayer(newQuery, orderFields, count){
    const retsLayerView = view.allLayerViews._items.find(x => x.layer.title === "RETS") ?? retsLayer

    const query = new Query()
    query.where = `${newQuery.whereString}`
    query.orderByFields = [`${orderFields}`]
    query.outFields = newQuery.out ??= ["*"]
    query.returnGeometry = true
    query.num = count ??= 20000

    return newQuery.queryLayer === 'retsLayer' ? retsLayerView.queryFeatures(query) : retsHistory.queryFeatures(query)
}


export function searchCards(cardArr, string, searchParam){
    try{
        if(!string.length && !searchParam.isFilters){
            searchParam.type === 'sortA' ?  cardArr.forEach(x =>  document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.add('showCards')) : cardArr.forEach(x =>  document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.add('showCards'))
            return
        }
        cardArr.forEach((x) => {
            const a = !searchParam.isFilters ? Object.values(x.attributes ?? x).find(t => String(t).includes(string)) : x.attachments
            if(a){
                searchParam.type === 'sortA' ? document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.add('showCards') : document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.add('showCards')
            }
            else{
                searchParam.type === 'sortA' ? document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.remove('showCards') : document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.remove('showCards')
                searchParam.type === 'sortA' ? document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.add('hideCards') : document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.add('hideCards')
            }
        })
        return
    }
    catch(a){
        console.warn("search is not workin")
    }

}

export function home(){
    homeWidget.cancelGo()
    homeWidget.on("go", ()=>{
        
        retsLayer.queryExtent()
            .then((resp) =>{
                view.goTo(resp.extent)
            })
    })
    return
}

export function addRelatedRetsToMap(rets){ 
    const graphicInArr = retsGraphicLayer.graphics.items.find(ret => ret.attributes.OBJECTID === rets.oid)
    if(graphicInArr){
        return
    }    
    
    const graphicPt = {
        type: "point",
        longitude: rets.geometry[0],
        latitude: rets.geometry[1],
    }
    
    const graphicSymb = {
        type: "simple-marker",
        color: appConstants.CardColorMap[`${rets.jobType}`],
        size: 8,
        outline:{
            width:1.5,
            color: "cyan"
        }
    }

    const pointGraphic = new Graphic({
        geometry: graphicPt,
        symbol: graphicSymb,
        attributes: {
            ...rets.fullData,
            retsId: rets.name
        },
        popupTemplate:{
            title: `${rets.fullData.RTE_NM}`,
            content: `${rets.fullData.DESC_}`,
            actions: [{title: "Open", id:"open-details"}]
        }
    })

    const textGraphic = new Graphic({
        geometry: graphicPt,
        symbol: {
            type: "text",
            color: "white",
            haloColor: "black",
            haloSize: "1px",
            text: rets.name,
            xoffset: 3,
            yoffset: 3
        },
        attributes: {
            OBJECTID: rets.oid,
            retsId: rets.name
        },

    })
    
    retsGraphicLayer.addMany([pointGraphic, textGraphic])
    return
}

export function turnAllVisibleGraphicsOff(){
    const isVisible = retsGraphicLayer.graphics.items.filter(x => x.visible === true)
    isVisible.forEach(vis => vis.visible = false)
    return
}
export function removeRelatedRetsFromMap(retsoid){
    const findGraphic = retsGraphicLayer.graphics.items.filter(x => x.attributes.OBJECTID === retsoid)
    retsGraphicLayer.removeMany(findGraphic)
    return
}

export function zoomToRelatedRets(relatedRets){
    const groupOfRets = retsGraphicLayer.graphics.items.filter(item => item.OBJECTID === relatedRets.oid)
    view.goTo(groupOfRets, {easing: "ease-in"})
    return
}

export const toggleRelatedRets = (retsid) =>  {
    const parseRets = JSON.parse(retsid)
    if(!parseRets.attributes.RELATED_RETS) return
    const newRetsId = typeof retsid === "object" ? parseRets.attributes.RELATED_RETS.map(x => x.fullData.RETS_ID) : parseRets.attributes.RELATED_RETS.split(",")
    turnAllVisibleGraphicsOff()
    newRetsId.forEach((ret) =>{
        let a = retsGraphicLayer.graphics.items.filter(item => item.attributes.retsId === Number(ret))
        a.forEach(x => x.visible = true)
    })
    return
}

// export function openDetailsFromGraphic(){
    
//}

export function returnHistory(query){
    store.numAttachments = 0
    const queryString = {"whereString": `${query ?? '1=1'}`, "queryLayer": "retsHistory"}
    getQueryLayer(queryString, "create_dt desc")
        .then((hist) => {
            const arrHist = []
            hist.features.forEach((x) => {
                getAttachmentInfo(x.attributes.OBJECTID)
                    .then((att) => {
                        if(Object.hasOwn(att, x.attributes.OBJECTID)){
                            x.attributes.attachments = att[x.attributes.OBJECTID].map((i) =>{
                                store.numAttachments += 1
                                return {name: i.name, url: i.url}
                            })
                            //store.historyChat.push(x.attributes)
                        }
                        store.historyChat.push(x.attributes)
                    })
                // x.attributes.attachments = []
                // x.attributes.attachments.push()
                //arrHist.push(x.attributes)
            })
            
            //query ? store.historyChat = arrHist : store.history = JSON.stringify(arrHist)
        })
        .catch(err => console.log(err))
    return
}

export async function getAttachmentInfo(oid){
    try{
        const isAttach = await retsHistory.queryAttachments({
            objectIds: oid
        })
    
        if(isAttach){
           return isAttach
        }
    }

    catch(err){
        console.log(err)
    }
}

export async function getUniqueQueryValues(layer, constantsProp){
    const query = new Query()
    query.where = `1=1`
    query.outFields = ["*"]
    
    const getUserInfo = await layer.queryFeatures(query)
    getUserInfo.features.forEach(x => constantsProp.push({
        "value" : x.attributes.USERNAME,
        "name": x.attributes.NAME,
        "email": x.attributes.EMAIL,
        "type": x.attributes.TYPE
    }))
}

export function highlightpoints(event){
    // Get the rectangle geometry
    var rectangleGeometry = event.graphic.geometry;
    // Query for points within the rectangle
    var query = retsLayer.createQuery();
    query.geometry = rectangleGeometry;
    retsLayer.queryFeatures(query)

    return
}

export function createtool(sketchWidgetcreate, createretssym) {
    return new Promise((resolve, reject) => {
      sketchWidgetcreate.create("point");
      sketchWidgetcreate.on("create", (event) => {
        if (event.state === "complete") {
          const pointGeometry = event.graphic.geometry;
          const newPointGraphic = new Graphic({
            geometry: pointGeometry,
            spatialReference: { wkid: 3857 }
          });
  
          event.graphic.symbol = createretssym;
          resolve(newPointGraphic);
        }
      });
    });
  }

  export function deleteRetsGraphic(){
    graphics.graphics.items.forEach((ret) => {
        if(ret.geometry.type === 'point'){
            graphics.remove((ret))
        }
    })
    return
}

    var pressedkey = false;
    window.addEventListener("keydown", (event)=>{

        pressedkey = event.key
    });
    window.addEventListener("keyup", (event) => {
        pressedkey = false
    });

    export function selecttool(isSelectEnabled, sketchWidgetselect, graphics){
        if(isSelectEnabled === true){ 
            sketchWidgetselect.create("rectangle");
            var removeAll = true
            sketchWidgetselect
            .on("create", function (event) 
                {
                if(event.state === "complete")
                    {
                        // Get the rectangle geometry
                        var rectangleGeometry = event.graphic.geometry;
                        // Query for points within the rectangle
                        var query = retsLayer.createQuery();
                        query.geometry = rectangleGeometry;
                        retsLayer.queryFeatures(query)
                        .then(function (result) 
                                {
                                    // Access the selected features
                                    var selectedFeatures = result.features;
                                    
    
                                    if (pressedkey === false){
                                        
                                        removeHighlight("a", removeAll); 
                                        removeAllCardHighlight()
                                        store.roadHighlightObj.clear()
                                        // for (let i = 0; i < selectedFeatures.length; i++ ) {
                                        
                                        //clearRoadHighlightObj()

                                                // }
                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
                                            const b = store.roadObj.find(rd => rd.attributes.OBJECTID === selectedFeatures[i].attributes.OBJECTID)
                                            store.roadHighlightObj.add(b)
                                            highlightRETSPoint(selectedFeatures[i].attributes);
                                            //outlineFeedCards(b);
                                                    
                                                    
                                        }
                                        outlineFeedCards(store.roadHighlightObj);        
                                                graphics.removeAll() 
                                        //clearRoadHighlightObj()
                       
                                        return
                                        
                                    }
    
                                    
                                     
                                    
                                    if(pressedkey === "Shift"){
                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
                                            store.roadHighlightObj.add(String(selectedFeatures[i].attributes.RETS_ID).concat('-', selectedFeatures[i].attributes.OBJECTID))
                                            highlightRETSPoint(selectedFeatures[i].attributes);
                                            //outlineFeedCards(selectedFeatures);
    
                                        } 
                                        graphics.removeAll();
                                        return
                                    }
                                    
                                    if(pressedkey === "Control"){
                                        
                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
        
        
                                            removeHighlight(selectedFeatures[i]);  
    
                                        } 
    
                                       
                                        graphics.removeAll();
                                        return
            
                                    }
    
                                    
                                   
                                });
    
                                
                                
                    }
    
            });
    
            isSelectEnabled = !isSelectEnabled; 
        }
        else{
            isSelectEnabled = !isSelectEnabled;
            sketchWidgetselect.cancel()
                
        }
        
        
        return
      }

export async function handleaddrets(newPointGraphic, addrets){
    try{
        const obj = await addRETSPT(newPointGraphic)
        const objectid = obj.addFeatureResults[0].objectId
        addrets = objectid
        return
    }
    catch(err){
        console.log(err)
        return
    }
}

export async function getCmntOID(retId){
    const queryString = {"whereString": `RETS_ID = ${retId}`, "queryLayer": "retsHistory"}
    return await getQueryLayer(queryString, "EDIT_DT DESC")
}

export function addAttachments(oid, files, flag){
    const arr = Array.from(files)
    const formData = new FormData()
    formData.append("attachment", arr[0], arr[0].name)
    
    esriRequest(`https://testportal.txdot.gov/createags/rest/services/RETS_CMNT/FeatureServer/0/${oid}/addAttachment`, {
        body: formData,
        method: "post",
        responseType: "html",
    })
        .then((x) => {
            store.numAttachments += 1
            flag ? null : store.attachToNote(oid, arr)
        })
        .then(() => console.log('add attachment'))
        .catch(err => console.log(err))
}

export function deleteAttachment(oid, attachName){
    const attachGraphic = new Graphic({
        attributes :{
            OBJECTID : oid,
        }
    })

    retsHistory.queryAttachments({
        objectIds: [oid]
    })
    .then((x) => {
        x[oid].forEach((attach) => {
            if(attach.name === attachName){
                retsHistory.deleteAttachments(attachGraphic, [attach.id])
                    .then((y) => {
                        const chat = store.historyChat.find(z => z.OBJECTID === attach.parentObjectId)
                        const index = chat.attachments.findIndex(att => att.name === attach.name)
                        chat.attachments.splice(index, 1)
                    })
                
                    .catch(err => console.log(err))
            }
        })
        
    })
    return 
}

export const rtrnNumAttachChat = () => store.historyChat.filter(chat => chat.attachments).length

export function togglemenu(isActOpen, shift){   
            
    var currentCenter = view.center.clone();
    var screenPoint = view.toScreen(currentCenter);
    var newCenter;    
    if (isActOpen === true){

         isActOpen =! isActOpen
        screenPoint.x = screenPoint.x + shift; // Adjust the x coordinate by the desired amount of pixels
        var newCenter = view.toMap(screenPoint); // Convert back to map coordinates
        view.goTo(newCenter)
        
    }
    else{
         isActOpen =! isActOpen
        screenPoint.x = screenPoint.x - shift; // Adjust the x coordinate by the desired amount of pixels
        var newCenter = view.toMap(screenPoint); // Convert back to map coordinates
        view.goTo(newCenter)                
    }
    return
}

export async function queryFlags(userid){
    const returnRetsFlagUser = await flagRetsColor.queryFeatures({
        where: `USERNAME = '${userid}'`,
        outFields: ["*"]
    }) 
    returnRetsFlagUser.features.forEach(flag => store.userRetsFlag.push({FLAG: flag.attributes.FLAG, OBJECTID: flag.attributes.OBJECTID, RETS_ID: flag.attributes.RETS_ID, USERNAME: flag.attributes.USERNAME}))
    return
}

export async function createRoadGraphic(retsObj, onStartUp){
    graphics.removeAll()
    //est routeName and DFO from Rets Fields
    const routeName = retsObj.attributes.RTE_NM
    const routeDFO = retsObj.attributes.DFO
    //query for road
    const returnRds = await queryRoads(routeName)
    if(!returnRds.features.length){
        store.isAlert = true
        store.alertTextInfo = {"text": `Route and/or DFO are not valid`, "color": "red", "type":"error", "toggle": true}
        store.dfoIndex = "not in range"
        return
    }
    //determine if dfo is on a roadSegment
    const rdSegment = returnRds.features.find((rd) => {
        let startM = rd.geometry.paths[0].at(0)[2]
        let endM = rd.geometry.paths[0].at(-1)[2]
        //if on a road segment
        if(routeDFO >= startM && routeDFO <= endM){
            
            return rd
        }
        //if not on a road segment range
        store.isAlert = true
        store.alertTextInfo = {"text": `DFO is out of Range. Begin DFO: ${startM} End DFO: ${endM}`, "color": "red", "type":"error", "toggle": true}
        store.dfoIndex = "not in range"
    })

    drawFeaturedRoad(rdSegment)
    plotRetsPointOnRoad(routeDFO, rdSegment, onStartUp)
    
    return
}

async function queryRoads(rteName){
    const roadsLayerView = view.allLayerViews._items.find(x => x.layer.title === "TxDOT Roadways")
    return await roadsLayerView.layer.queryFeatures({
        where: `RTE_NM = '${rteName}'`,
        returnM: true,
        returnGeometry: true,
        outFields: ["*"]
    })
}

function drawFeaturedRoad(rd){
    console.log(rd)
    const rdGraphic = new Graphic({
        geometry: rd.geometry,
        attributes:{
            OBJECTID: store.retsObj.attributes.OBJECTID,
            RETS_ID: store.retsObj.attributes.RETS_ID
        },
        symbol: {
            type:"simple-line",
            color: [226, 119, 40],
            width: 4
        }
    })
    graphics.add(rdGraphic)
    return
}

function plotRetsPointOnRoad(dfo, rd, onStartUp){
    //find nearestVertex >
    const nearestVertexFront = rd.geometry.paths[0].findIndex(vertex => vertex[2] > dfo)
    const nearestVertexBehindPoint =  {
        type: "point",
        x: rd.geometry.paths[0].at(nearestVertexFront-1)[0],
        y: rd.geometry.paths[0].at(nearestVertexFront-1)[1],
    }
    const nearestVertexFrontPoint = {
        type: "point",
        x: rd.geometry.paths[0].at(nearestVertexFront)[0],
        y: rd.geometry.paths[0].at(nearestVertexFront)[1],
    }
    const beginM = rd.geometry.paths[0].at(nearestVertexFront-1)[2]
    const endM = rd.geometry.paths[0].at(nearestVertexFront)[2]
    const webMerConvertPointA = webMercatorUtils.webMercatorToGeographic(nearestVertexBehindPoint)
    const webMerConvertPointB = webMercatorUtils.webMercatorToGeographic(nearestVertexFrontPoint)
    webMerConvertPointA.spatialReference.wkid = 4326
    webMerConvertPointB.spatialReference.wkid = 4326

    const dfoMilesToMeters = (dfo-rd.geometry.paths[0].at(nearestVertexFront-1)[2])*1609.344
    store.combinator = `${rd.attributes.RTE_NM}-${dfo}`

    //calc to get the azmiuth of the line
    const {distance, azimuth, revAzimuth} = geodesicUtils.geodesicDistance(webMerConvertPointA, webMerConvertPointB, "miles")
    const getPointLocation = geodesicUtils.pointFromDistance(webMerConvertPointA, dfoMilesToMeters, azimuth)
    //console.log(webMercatorUtils.geographicToWebMercator(getPointLocation))
    UpdatePt(getPointLocation, onStartUp)
    
    //compare distance from closetsCoordinate to nearestVertex -1 
    return
}

async function UpdatePt(pt, onStartUp){
   //const isUpdate = compareRetsToDerivedLocation(pt, mValues)
    if(!onStartUp){
        const newPt = webMercatorUtils.geographicToWebMercator(pt)
        const ptGraphic = new Graphic({
            geometry: pt,
            attributes: store.retsObj.attributes,
            symbol: retsPointRenderer.uniqueValueInfos.find(symb => Number(symb.value) === store.retsObj.attributes.STAT).symbol
        })
        console.log(pt)
       await updateRETSPT(ptGraphic)
        retsLayer.queryFeatures({
            where: `RETS_ID = ${ptGraphic.attributes.RETS_ID}`
        })
        .then(()=>{
            view.goTo(ptGraphic)
            store.retsObj.geometry = [ptGraphic.geometry.x , ptGraphic.geometry.y]
            store.isAlert = false
            store.getHistoryChatRet()
            retsLayer.refresh()
        })
        .catch(err => console.log(err))
    }
    return
}

// function compareRetsToDerivedLocation(derivedPt, mValues){
//     // const a = {
//     //     type: "point",
//     //     x: derivedPt.x,
//     //     y: derivedPt.y
//     // }
//     // const convertBegin = webMercatorUtils.webMercatorToGeographic(a)
//     // convertBegin.spatialReference.wkid = 4326
//     // const retsGeo = {
//     //     type:"point",
//     //     x: store.retsObj.geometry[0],
//     //     y: store.retsObj.geometry[1]
//     // }
//     // const retsConvertGeo = webMercatorUtils.webMercatorToGeographic(retsGeo)
//     // retsConvertGeo.spatialReference.wkid = 4326
    
//     // const {distance, azimuth, revAzimuth} = geodesicUtils.geodesicDistance(retsConvertGeo, convertBegin, "miles")
//     console.log(distance, mValues[0], mValues[1])
//     if()
//     console.log(store.retsObj.attributes.DFO)
//     return Number(Math.round(distance)) === 0 ? false : true
// }

export function getRoadInformation(){
    const roadsLayerView = view.allLayerViews._items.find(x => x.layer.title === "TxDOT Roadways")

    const createGraphic = new Graphic({
        geometry: {
            type: "point",
            x: store.retsObj.geometry[0],
            y: store.retsObj.geometry[1]
        },
        attributes: store.retsObj.attributes,
        symbol: retsPointRenderer.uniqueValueInfos.find(symb => Number(symb.value) === store.retsObj.attributes.STAT).symbol
    })
    graphics.add(createGraphic)
    sketchWidgetcreate.update(createGraphic)

    const rdEvent = view.on(["drag", "pointer-up"], (event)=>{
        view.hitTest(event, {include: [roadsLayerView.layer]})
            .then((rd) => {
                // if(!rd.results.length && event.type === "pointer-up"){
                //     store.isAlert = true
                //     store.alertTextInfo = {"text": `No Route has been detected`, "color": "yellow", "type":"info", "toggle": true}
                //     store.retsObj.attributes.NO_RTE = true
                //     store.retsObj.attributes.RTE_NM = ""
                //     store.retsObj.attributes.DFO = ""
                //     updateRETSPT(createGraphic)
                //     retsLayer.queryFeatures({
                //         where: `RETS_ID = ${createGraphic.attributes.RETS_ID}`
                //     })
                //     .then(()=>{
                //         view.goTo(createGraphic)
                //         //store.updateRetsID()
                //         store.isAlert = false
                //         store.getHistoryChatRet()
                //         return
                //     })
                //     .catch(err => console.log(err))
                // }
                if(event.type === "drag"){
                    store.retsObj.attributes.RTE_NM = rd.results[0].graphic.attributes.RTE_NM
                }
                else if(event.type === "pointer-up" && rd.results.length){
                    console.log(rd.results)
                    roadsLayerView.layer.queryFeatures({
                        where: `RTE_NM = '${rd.results[0].graphic.attributes.RTE_NM}'`,
                        returnM: true,
                        returnGeometry: true,
                    })
                        .then((road)=>{
                            console.log(road)
                            store.updatedRetsPtName = road.features[0].attributes.RTE_NM
                            const roadConvertToGeo = webMercatorUtils.webMercatorToGeographic(road.features[0].geometry)
                            const ptConvertToGeo = webMercatorUtils.webMercatorToGeographic(createGraphic.geometry)
                            const {coordinate, distance, vertexIndex} = geometryEngine.nearestVertex(roadConvertToGeo, ptConvertToGeo)
                            const newDFO = road.features[0].geometry.paths[0].at(vertexIndex-1)[2] + distance
                            store.retsObj.attributes.DFO = newDFO.toFixed(3)
                            //drawFeaturedRoad(road.features[0])
                            //plotRetsPointOnRoad(newDFO, road.features[0].geometry, false)
                            return
                        })
                   return
                }
                return
            })
            .catch(() =>{
                //
            })
    })
    //rdEvent.remove()
    return
}

export function removeOutline(){
    const classList = document.querySelectorAll('.highlight-card');
    classList.forEach(element => {
    element.classList.remove('highlight-card'); // Remove each element individually
    });
    
}

export function logoutUser(){
    esriId.destroyCredentials({
    })

}
