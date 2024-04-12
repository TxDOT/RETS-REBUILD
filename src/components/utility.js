import {view, retsLayer, homeWidget, retsGraphicLayer, TxDotRoaways, retsHistory, graphics, flagRetsColor, sketchWidgetcreate, retsPointRenderer} from './map-Init'
import Query from "@arcgis/core/rest/support/Query.js";
import Graphic from "@arcgis/core/Graphic.js";
import { appConstants } from "../common/constant.js";
import {store} from './store.js'
import {getDFOFromGRID} from './crud.js'
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
    //console.log(feature)
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
                
                return
            }
            
            return
        })
}

function outlineFeedCards(cards){
    return new Promise((res, rej)=>{
        cards.forEach((x) => {
            //set card outline
            var objectcomparison = x.attributes ? String(x.attributes.RETS_ID).concat('-',x.attributes.OBJECTID) : String(x.graphic.attributes.RETS_ID).concat('-',x.graphic.attributes.OBJECTID)
            if(!document.getElementById(objectcomparison)) return
            document.getElementById(objectcomparison).classList.add('highlight-card')
            store.roadHighlightObj.add(objectcomparison)
            
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
        res("done too")
        store.isShowSelected ? toggleHighlightCards(bool) : null
    })
}

export async function toggleHighlightCards(bool){
    const togglePromise = new Promise((res,rej) => {
        const getCardRows = document.getElementsByClassName("rets-card-row")
        let i;
        
        console.log('updatedSelection')
        console.log(store.roadHighlightObj)
        for(i=0; i < getCardRows.length; i++){
            if(bool === true){
                console.log(bool)
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
    console.log(getHighlightCardRows)
    let i;
    for(i=0; i < getHighlightCardRows.length; i++){
        console.log(getHighlightCardRows[i])
        if(store.isShowSelected){
            console.log(store.isShowSelected)
            getHighlightCardRows[i].parentElement.style.display = "none"
        }
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

    let STAT = []
    let DIST_NM = []
    let CNTY_NM = []
    let ACTV = []
    let JOB_TYPE = []

    let EDIT_DT = []

    let fullFilter = []

    console.log(filterOpt)
    for(let [key, value] of Object.entries(filterOpt)){
        // console.log(`'GIS_ANALYST' in (${GIS_ANALYST.join(" and ")})`)
        // console.log(`'GRID_ANALYST' in (${GRID_ANALYST.join(" and ")})`)
        // console.log(`'DIST_ANALYST' in (${DIST_ANALYST.join(" and ")})`)
        if(!value) continue
        if(value){
            console.log(key)
            if(key === 'user'){
                let a; 
                for(a=0; a < value.length; a++){
                    console.log(value[a])
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
                
            }
            if(key === 'stat' || key === 'distNM' || key === 'cntyNM' || key === 'actv' || key === 'jobType'){
                // console.log()
                // console.log(`'DIST_NM' in (${DIST_NM.join(" and ")})`)
                // console.log(`'CNTY_NM' in (${CNTY_NM.join(" and ")})`)
                // console.log(`'ACTV' in (${ACTV.join(" and ")})`)
                // console.log(`'JOB_TYPE' in (${JOB_TYPE.join(" , ")})`)
                if(key === "stat"){
                    let a; 
                    for(a=0; a < value.length; a++){
                        console.log(value[a])
                        STAT.push(value[a].value)
                    }
                    STAT.length ? fullFilter.push(`STAT in (${STAT.join(" , ")})`) : null
                }
                if(key === 'distNM'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        console.log(value[a])
                        DIST_NM.push(value[a].value)
                    }
                    DIST_NM.length ? fullFilter.push(`DIST_NM in (${DIST_NM.join(" , ")})`) : null
                }
                if(key === 'cntyNM'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        console.log(value[a])
                        CNTY_NM.push(value[a].value)
                    }
                    CNTY_NM.length ? fullFilter.push(`CNTY_NM in (${CNTY_NM.join(" , ")})`) : null
                }
                if(key === 'actv'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        console.log(value[a])
                        ACTV.push(`'${value[a].value}'`)
                    }
                    ACTV.length ? fullFilter.push(`ACTV in (${ACTV.join(" , ")})`) : null
                }
                if(key === 'jobType'){
                    let a; 
                    for(a=0; a < value.length; a++){
                        console.log(value[a])
                        JOB_TYPE.push(value[a].value)
                    }
                    JOB_TYPE.length ? fullFilter.push(`JOB_TYPE in (${JOB_TYPE.join(" , ")})`) : null
                }
                    continue
            }
            if(key === "editDt"){
                console.log(value)
                const splitDate = value.split("-")
                splitDate.length === 1 ? fullFilter.push(`EDIT_DT between timestamp '${splitDate[0]}' and timestamp '${splitDate[0]}'`) : fullFilter.push(`EDIT_DT  between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)
                //retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)\
                console.log(fullFilter)
                continue
            }
            // retsDefinitionExpressionArr.push(`${key} in ('${value}')`)
        }
    }

    console.log(fullFilter.join(" OR "))
    const filterDef = fullFilter.join(" AND ")
    const filterMapPromise = new Promise((res, rej) => {
        retsLayer.definitionExpression = `${filterDef}`
        res(filterDef)
    })
    const returnFilterMapPromise = await filterMapPromise
    console.log(returnFilterMapPromise)
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

    const query = new Query()
    query.where = `${newQuery.whereString}`
    query.orderByFields = [`${orderFields}`]
    query.outFields = newQuery.out ??= ["*"]
    query.returnGeometry = true
    query.num = count ??= 20000

    return newQuery.queryLayer === 'retsLayer' ? retsLayer.queryFeatures(query) : retsHistory.queryFeatures(query)
}


export function searchCards(cardArr, string, index){
    try{
        if(!string.length){
            cardArr.forEach(x =>  document.getElementById(`${x.attributes ? x.attributes[index] : x[index]}`).classList.add('showCards'))
            return
        }
        cardArr.forEach((x) => {
            const a = Object.values(x.attributes ?? x).find(t => String(t).includes(string))
            if(a){
                document.getElementById(`${x.attributes ? x.attributes[index] : x[index]}`).classList.add('showCards')
            }
            else{
                document.getElementById(`${x.attributes ? x.attributes[index] : x[index]}`).classList.remove('showCards')
                document.getElementById(`${x.attributes ? x.attributes[index] : x[index]}`).classList.add('hideCards')
            }
        })
        return
    }
    catch(a){
        console.warm("search is not workin")
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
    const queryString = {"whereString": `${query ?? '1=1'}`, "queryLayer": "retsHistory"}
    getQueryLayer(queryString, "create_dt desc")
        .then((hist) => {
            const arrHist = []
            hist.features.forEach((x) => {
                // x.attributes.attachments = []
                // x.attributes.attachments.push()
                arrHist.push(x.attributes)
            })
            query ? store.historyChat = arrHist : store.history = JSON.stringify(arrHist)
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
        console.log('run')
        if(isSelectEnabled === true){ 
            sketchWidgetselect.create("rectangle");
            var removeAll = true
            sketchWidgetselect
            .on("create", function (event) 
                {
                if (event.state === "complete")
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
                                    console.log(result.features.length)
                                    
    
                                    if (pressedkey === false){
                                        
                                        removeHighlight("a", removeAll); 
                                        removeAllCardHighlight()
                                        // for (let i = 0; i < selectedFeatures.length; i++ ) {
                                        
                                        //clearRoadHighlightObj()
                                        console.log(store.roadHighlightObj)
                    
                                        
                                        
                                        console.log('hey1')
                                                // }
                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
                                            store.roadHighlightObj.add(String(selectedFeatures[i].attributes.RETS_ID).concat('-', selectedFeatures[i].attributes.OBJECTID))
                                            highlightRETSPoint(selectedFeatures[i].attributes);
                                            //outlineFeedCards(selectedFeatures);
                                                    
                                                    
                                        }
                                        outlineFeedCards(selectedFeatures);        
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
                                            console.log("this: " + selectedFeatures[i].attributes.OBJECTID)
        
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
            console.log(x)
            console.log(arr)
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
    console.log(userid)
    const returnRetsFlagUser = await flagRetsColor.queryFeatures({
        where: `USERNAME = '${userid}'`,
        outFields: ["*"]
    }) 
    console.log(returnRetsFlagUser)
    returnRetsFlagUser.features.forEach(flag => store.userRetsFlag.push({FLAG: flag.attributes.FLAG, OBJECTID: flag.attributes.OBJECTID, RETS_ID: flag.attributes.RETS_ID, USERNAME: flag.attributes.USERNAME}))
    return
}

export async function createRoadGraphic(retsObj){
    console.log(retsObj)
    graphics.removeAll()
    //est routeName and DFO from Rets Fields
    const routeName = retsObj.attributes.RTE_NM
    const routeDFO = retsObj.attributes.DFO
    //query for road
    const returnRds = await queryRoads(routeName)
    console.log(returnRds)
    if(!returnRds.features.length){
        store.isAlert = true
        store.alertTextInfo = {"text": `Route and DFO are not valid`, "color": "red", "type":"error", "toggle": true}
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
        console.log(rdSegment)
    })

    console.log(rdSegment)
    drawFeaturedRoad(rdSegment)
    plotRetsPointOnRoad(routeDFO, rdSegment)
    
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
    console.log(rdGraphic)
    graphics.add(rdGraphic)
    return
}

function plotRetsPointOnRoad(dfo, rd){
    //find nearestVertex >
    const nearestVertexFront = rd.geometry.paths[0].findIndex(vertex => vertex[2] > dfo)
    console.log(nearestVertexFront)
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
    const webMerConvertPointA = webMercatorUtils.webMercatorToGeographic(nearestVertexBehindPoint)
    const webMerConvertPointB = webMercatorUtils.webMercatorToGeographic(nearestVertexFrontPoint)
    webMerConvertPointA.spatialReference.wkid = 4326
    webMerConvertPointB.spatialReference.wkid = 4326

    console.log(nearestVertexFrontPoint)
    console.log(nearestVertexBehindPoint)
    const dfoMilesToMeters = (dfo-rd.geometry.paths[0].at(nearestVertexFront-1)[2])*1609.344
    store.combinator = `${rd.attributes.RTE_NM}-${dfo}`
    console.log(dfoMilesToMeters)
    //calc to get the azmiuth of the line
    const {distance, azimuth, revAzimuth} = geodesicUtils.geodesicDistance(webMerConvertPointA, webMerConvertPointB, "miles")
    console.log(azimuth)
    const getPointLocation = geodesicUtils.pointFromDistance(webMerConvertPointA, dfoMilesToMeters, azimuth)
    //console.log(webMercatorUtils.geographicToWebMercator(getPointLocation))
    UpdatePt(getPointLocation)
    
    //compare distance from closetsCoordinate to nearestVertex -1 
    return
}

async function UpdatePt(pt){
    const isUpdate = compareRetsToDerivedLocation(pt)
    if(isUpdate){
        const newPt = webMercatorUtils.geographicToWebMercator(pt)
    
        const ptGraphic = new Graphic({
            geometry: newPt,
            attributes: store.retsObj.attributes,
            symbol: retsPointRenderer.uniqueValueInfos.find(symb => Number(symb.value) === store.retsObj.attributes.STAT).symbol
        })

       await updateRETSPT(ptGraphic)
        retsLayer.queryFeatures({
            where: `RETS_ID = ${ptGraphic.attributes.RETS_ID}`
        })
        .then(()=>{
            view.goTo(ptGraphic)
            store.updateRetsID()
            store.isAlert = false
            store.getHistoryChatRet()
        })
        .catch(err => console.log(err))
    }
    return
}

function compareRetsToDerivedLocation(derivedPt){
    console.log(derivedPt)
    const a = {
        type: "point",
        x: derivedPt.x,
        y: derivedPt.y
    }
    const convert = webMercatorUtils.webMercatorToGeographic(a)
    convert.spatialReference.wkid = 4326
    const retsGeo = {
        type:"point",
        x: store.retsObj.geometry[0],
        y: store.retsObj.geometry[1]
    }
    const retsConvertGeo = webMercatorUtils.webMercatorToGeographic(retsGeo)
    retsConvertGeo.spatialReference.wkid = 4326
    console.log(retsGeo)
    const {distance, azimuth, revAzimuth} = geodesicUtils.geodesicDistance(retsConvertGeo, convert, "miles")
    console.log(distance.toFixed(4))
    return false//Number(distance.toFixed(4)) < .0001 ? false : true
}

export function getRoadInformation(){
    const roadsLayerView = view.allLayerViews._items.find(x => x.layer.title === "TxDOT Roadways")

    console.log(store.retsObj.geometry)
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

    view.on(["drag", "pointer-up"], (event)=>{
        view.hitTest(event, {include: [roadsLayerView.layer]})
            .then((rd) => {
                if(!rd.results.length){
                    store.isAlert = true
                    store.alertTextInfo = {"text": `No Route has been detected`, "color": "yellow", "type":"info", "toggle": true}
                    store.retsObj.attributes.NO_RTE = true
                    store.retsObj.attributes.RTE_NM = ""
                    store.retsObj.attributes.DFO = ""
                    updateRETSPT(createGraphic)
                    retsLayer.queryFeatures({
                        where: `RETS_ID = ${createGraphic.attributes.RETS_ID}`
                    })
                    .then(()=>{
                        view.goTo(createGraphic)
                        store.updateRetsID()
                        store.isAlert = false
                        store.getHistoryChatRet()
                        return
                    })
                    .catch(err => console.log(err))
                }
                if(event.type === "drag"){
                    store.retsObj.attributes.RTE_NM = rd.results[0].graphic.attributes.RTE_NM
                }
                else if(event.type === "pointer-up"){
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
                            console.log(coordinate, distance, vertexIndex)
                            const newDFO = road.features[0].geometry.paths[0].at(vertexIndex)[2] + distance
                            road.features[0].attributes.DFO = newDFO
                            createRoadGraphic(road.features[0])
                        })
                   
                }

            })
            .catch(() => console.log('I dont care'))
    })
} 
