import {view, retsLayer, homeWidget, retsGraphicLayer, TxDotRoaways, retsHistory, graphics, flagRetsColor, sketchWidgetcreate, retsPointRenderer, texasExtent} from './map-Init'
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
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

export let retsLayerView; 
export let roadLayerView;

export async function getRetsLayerView (){
        const retLayerView = await view.whenLayerView(retsLayer)

        reactiveUtils.when(
            () => !retLayerView.dataUpdating,
            async () => {
                try{
                    retsLayerView = retLayerView

                    if(retsLayerView.view.zoom < 12){
                        store.zoomInText = "Zoom in to enable"
                        store.zoomInToEnable = true
                        return
                    }
                    store.zoomInText = "Move RETS Point"
                    store.zoomInToEnable = false
                    return
                }
                catch(err){
                    console.log(err)
                }
            },
        )

    return
}

export async function getTxDotRdWayLayerView(){
    const rdLayerView = await view.whenLayerView(TxDotRoaways)
    rdLayerView.highlightOptions = {
        color: "#FF00FF", //bright fuchsia
        haloOpacity: 0.8,
        fillOpacity: 0.3
      };
    reactiveUtils.when(
        () => !rdLayerView.dataUpdating,
        async () => {
            try{
                if( rdLayerView.view.zoom > 9 ){
                    if(TxDotRoaways.definitionExpression === "") return
                    rdLayerView.layer.definitionExpression = ""
                }
                if(rdLayerView.view.zoom < 10 ){
                    if(TxDotRoaways.definitionExpression === "RTE_PRFX = 'IH'") return
                    rdLayerView.layer.definitionExpression = "RTE_PRFX = 'IH'"
                }
                roadLayerView = rdLayerView
                sketchWidgetcreate.snappingOptions.featureSources.push({layer: roadLayerView.layer, enable: true})
            }
            catch(err){
                console.log(err)
            }
        }
    )
}

export function clickRetsPoint(){
    try{
        view.on("click", (event)=>{
            view.hitTest(event, {include: [retsLayer, retsGraphicLayer]}).then((evt) =>{
                if(!evt.results.length){
                    removeOutline()
                    removeHighlight("a", true)
                    removeAllCardHighlight()
                    clearRoadHighlightObj()
                    scrollToTopOfFeed(0)
                    if(store.isSelectEnabled){
                        store.isShowSelected = false
                        return
                    }
                    return
                }
                //clearRoadHighlightObj()
                store.roadHighlightObj.clear()
                const retsPt = store.roadObj.find(rd => rd.attributes.OBJECTID === evt.results[0].graphic.attributes.OBJECTID)
                store.roadHighlightObj.add(retsPt)
                removeOutline()
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
            document.getElementById(objectcomparison).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
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

export function removeAllCardHighlight() {
    const getHighlightCardRows = document.getElementsByClassName("highlight-card")
    let i;
    for(i=0; i < getHighlightCardRows.length; i++){
        getHighlightCardRows[i].classList.toggle('highlight-card')
    }
    //clearRoadHighlightObj()
    return
}

export const clearGraphicsLayer = () => {
    graphics.removeAll()
    retsGraphicLayer.removeAll()
}

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
    let ANALYST = []
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
            if(key === 'isAssignedTo' && value){
                fullFilter.push(`ASSIGNED_TO in ('${store.loggedInUser}')`)
            }
            if(key === 'user' && !filterOpt.isAssignedTo){
                let a; 
                for(a=0; a < value.length; a++){
                    ASSIGNED_TO.push(`'${value[a].value}'`)
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
                //(GIS_ANALYST in () and GIS_ANALYST in () and DIST_ANALYST in () OR ASSIGNED_TO in ()) AND STAT (1,2,4) 
                //[GIS_ANALYST in () , GIS_ANALYST in () , DIST_ANALYST in ()]
                GIS_ANALYST.length ? ANALYST.push(`GIS_ANALYST in (${GIS_ANALYST.join(" , ")})`) : null
                GRID_ANALYST.length ? ANALYST.push(`GRID_ANALYST in (${GRID_ANALYST.join(" , ")})`) : null
                DIST_ANALYST.length ? ANALYST.push(`DIST_ANALYST in (${DIST_ANALYST.join(" , ")})`) : null
                let mapAnalyst = ANALYST.map((analyst, index) =>{
                   
                    if(index === 0){
                        return `(${analyst}`
                    }
                    return analyst
                })
                
                fullFilter = [...fullFilter, mapAnalyst.join(' OR ')]
                ASSIGNED_TO.length ? fullFilter.push(`OR ASSIGNED_TO in (${ASSIGNED_TO.join(" , ")}))`) : null
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
    const removeEmpty = fullFilter.filter(x => x.length)
    let filterDef = removeEmpty.join(" AND ")
    let newFilter = filterDef.replace("AND OR", "OR")
    // if(!filterOpt.isAssignedTo){
    //     const assignedToQuery = [...GIS_ANALYST, ...GRID_ANALYST, ...DIST_ANALYST]
    //     assignedToQuery.map((i) => `${i}`).join(",")
    //     filterDef = filterDef.concat(' OR (ASSIGNED_TO in (', assignedToQuery, '))')

    // }
    try{
        const filterMapPromise = new Promise((res, rej) => {
            retsLayerView.layer.definitionExpression = store.savedFilter = `${newFilter}`
            res(filterDef)
        })

        retsLayerView.layer.queryExtent()
        .then((resp) =>{
            if(resp.count === 0){
                view.goTo(texasExtent)
                return
            }
            view.goTo(resp.extent)
        })
        return newFilter
    }
    catch(err){
        store.RetsCardStatus = "Oops! There is an issue with the filter expression"
    }

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

    if(newQuery.queryLayer === 'retsLayer'){
        return retsLayer.queryFeatures(query)
    }
    if(newQuery.queryLayer === 'retsLayerLayerView'){
        return retsLayerView.layer.queryFeatures(query)
    }
    return retsHistory.queryFeatures(query)
 
}


export function searchCards(cardArr, string, searchParam){
    try{
        const searchString = string.toLowerCase()
        let s;
        const acceptedObj = []
        for(s of cardArr){
            const createObjKey = Object.values(s)
            createObjKey.forEach(x => {
                if(String(x).toLowerCase().includes(searchString)){
                    acceptedObj.push(s)
                }
            })

        }

        if(!string.length && !searchParam.isFilters ){
            searchParam.type === 'sortA' ?  cardArr.forEach(x =>  document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.add('showCards')) : cardArr.forEach(x =>  document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.add('showCards'))
            return
        }
        // console.log(cardArr)
        // cardArr.forEach((x) => {
            // Object.values(x).forEach(s => {
            //     const toLowerString = String(s).toLowerCase()
            //     const searchString = string.toLowerCase()
            //     document.getElementById(`${x.OBJECTID}`).classList.toggle('hideCards', toLowerString.includes(searchString))
            //     // if(toLowerString.includes(searchString)){
            //     //     document.getElementById(`${x.OBJECTID}`).classList.add("hideCards")
            //     //     console.log("cool")
            //     // }
            //     // else{
            //     //     console.log("not cool")
            //     // }
               
            //     //document.getElementById(`${x.attributes.OBJECTID}`).classList.toggle('hideCards', !toLowerString.includes(searchString))
            // })
            // // if(a){
            // //     searchParam.type === 'sortA' ? document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.add('showCards') : document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.add('showCards')
            // // }
            // // else{
            // //     searchParam.type === 'sortA' ? document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.remove('showCards') : document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.remove('showCards')
            // //     searchParam.type === 'sortA' ? document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}`).classList.add('hideCards') : document.getElementById(`${x.attributes ? x.attributes[searchParam.param] : x[searchParam.param]}Expand`).classList.add('hideCards')
            // // }
        //})
        return
    }
    catch(a){
        //console.warn(a)
    }

}

export function home(onrender){
    if (onrender){
        retsLayer.queryExtent()
        .then((resp) =>{
            if (resp.count== 0 || resp.count > 3000){
                view.goTo(texasExtent)
            }
            else{
                view.goTo(resp.extent)
            }
        })
    }
    homeWidget.cancelGo()
    homeWidget.on("go", ()=>{
        
        retsLayer.queryExtent()
            .then((resp) =>{
                if (resp.count== 0 || resp.count > 3000){
                    view.goTo(view.center)
                }
                else{
                    view.goTo(resp.extent)
                }
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
            //const arrHist = []
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
                const graphicToScreenPt = view.toScreen(pointGeometry)
                view.hitTest(graphicToScreenPt, {include: roadLayerView.layer})
                    .then((hit) =>{
                        if(!hit.results.length){
                            store.retsObj.attributes.RTE_NM = ""
                            store.retsObj.attributes.DFO = ""
                            return
                        }
                        const convertMapPts = webMercatorUtils.webMercatorToGeographic(event.graphic.geometry)
                        findDFOLocation(convertMapPts, hit.results[0].graphic.attributes.GID)
                    })  
                const newPointGraphic = new Graphic({
                    geometry: pointGeometry,
                    spatialReference: { wkid: 3857 }
                });
                    
                event.graphic.symbol = createretssym;
                resolve(newPointGraphic);
            }
            if(event.state === "cancel"){
                reject("cancelled")
                return
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
                                    graphics.removeAll();
                                    var selectedFeatures = result.features;
                                    if(!selectedFeatures.length && store.isShowSelected){
                                        store.isShowSelected = false
                                        return
                                    }
    
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
                                        scrollToTopOfFeed(store.roadHighlightObj.size)             
                                        //clearRoadHighlightObj()
                                        return
                                        
                                    }
    
                                    
                                     
                                    
                                    if(pressedkey === "Shift"){
                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
                                            const b = store.roadObj.find(rd => rd.attributes.OBJECTID === selectedFeatures[i].attributes.OBJECTID)
                                            store.roadHighlightObj.add(b)
                                            highlightRETSPoint(selectedFeatures[i].attributes);
                                        }
                                        outlineFeedCards(store.roadHighlightObj);  
                                        return
                                    }
                                    
                                    if(pressedkey === "Control"){    
                                            var rectangleGeometry2 = event.graphic.geometry;
                                            var query2 = retsLayer.createQuery();
                                            query2.geometry = rectangleGeometry2;
                                            retsLayer.queryFeatures(query2)
                                            .then(function (result) 
                                                    {
                                                        graphics.removeAll();
                                                        var selectedFeaturesnew = result.features;
                                                        for (let i = 0; i < selectedFeaturesnew.length; i++ ) {
                                                            const b = store.roadObj.find(rd => rd.attributes.OBJECTID === selectedFeaturesnew[i].attributes.OBJECTID)
                                                            store.roadHighlightObj.delete(b)
                                                            removeOutline()

                                                            outlineFeedCards(store.roadHighlightObj);
                                                            removeHighlight("a", removeAll)
                                                            scrollToTopOfFeed(store.roadHighlightObj.size)
                                                            let arr = Array.from(store.roadHighlightObj)

                                                            arr  = arr.filter(obj => {
                                                                return !selectedFeaturesnew.some(feature => feature.attributes.OBJECTID === obj.attributes.OBJECTID)
                                                            })
                                                            for (let n = 0; n < arr.length; n++){
                                                                if (n >= 0){
                                                                    highlightRETSPoint(arr[n].attributes);
                                                                    
                                                                }
                                                            }      
                                                            
                                                        }

                                                    })

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
export function scrollToTopOfFeed(setsize){
    const feedElement = document.querySelector('.card-feed-div')
    if(setsize === 0){
        feedElement.scrollTop = 0; //Scroll the feed dive to the top
    }
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
    return await getQueryLayer(queryString, "CREATE_DT DESC")
}

export async function returnTopHistory(retsID){
    return await retsHistory.queryFeatures({
        num: 1,
        where: `RETS_ID = ${retsID}`,
        outFields:["CMNT", "CMNT_NM", "CREATE_DT"],
        orderByFields: ["CREATE_DT DESC"]
    })
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
        .then(() => console.log(`${store.loggedInUser} added an attachment!`))
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
                        store.numAttachments -= 1
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
    const returnRds = await queryRoads("RTE_NM", `'${routeName}'`)
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
        console.log(startM)
        if(routeDFO >= startM && routeDFO <= endM){
            return rd
        }
    })

    //if not on a road segment range

    console.log(rdSegment)
    if(!rdSegment){
        store.isAlert = true
        store.alertTextInfo = {"text": `DFO is out of Range. Begin DFO: ${startM.toFixed(3)} End DFO: ${endM.toFixed(3)}`, "color": "red", "type":"error", "toggle": true}
        store.dfoIndex = "not in range"
        return
    }

    drawFeaturedRoad(rdSegment)
    plotRetsPointOnRoad(routeDFO, rdSegment, onStartUp)
    
    return
}

async function queryRoads(field, value){
    return await roadLayerView.layer.queryFeatures({
        where: `${field} = ${value}`,
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
    UpdatePt(getPointLocation, onStartUp)
    
    //compare distance from closetsCoordinate to nearestVertex -1 
    return
}

async function UpdatePt(pt, onStartUp){
   //const isUpdate = compareRetsToDerivedLocation(pt, mValues)
    if(!onStartUp){
        const ptGraphic = new Graphic({
            geometry: pt,
            attributes: store.retsObj.attributes,
            symbol: retsPointRenderer.uniqueValueInfos.find(symb => Number(symb.value) === store.retsObj.attributes.STAT).symbol
        })
       await updateRETSPT(ptGraphic)
       await retsLayer.queryFeatures({
            where: `RETS_ID = ${ptGraphic.attributes.RETS_ID}`
        })
        // graphics.add(ptGraphic)
        //hideRetsPt(ptGraphic.attributes.RETS_ID)
        view.goTo(ptGraphic)
        store.retsObj.geometry = [ptGraphic.geometry.x , ptGraphic.geometry.y]
        store.isAlert = false
        store.getHistoryChatRet()
            
        let a;
        for(a = 0; a < graphics.graphics.items.length; a++){
            if(graphics.graphics.items[a].geometry.type === "point"){
                graphics.remove(graphics.graphics.items[a])
                continue
            }
        }
        retsLayer.refresh()
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
export const completeMovePtSketch = () => sketchWidgetcreate.complete()
export const cancelSketchPt = () => sketchWidgetcreate.cancel()


export function getRoadInformation(){
    // changeCursor('crosshair')
    
    // const createGraphic = new Graphic({
    //     geometry: {
    //         type: "point",
    //         x: store.retsObj.geometry[0],
    //         y: store.retsObj.geometry[1]
    //     },
    //     attributes: store.retsObj.attributes,
    //     symbol: retsPointRenderer.uniqueValueInfos.find(symb => Number(symb.value) === store.retsObj.attributes.STAT).symbol
    // })


    // graphics.add(createGraphic)

    try{
        sketchWidgetcreate.create("point", {mode: "click"})
        sketchWidgetcreate.on("create", (event) => {
            if(event.state === "complete"){
                console.log(event)
                const getGraphic = event.graphic
                const graphicToScreenPt = view.toScreen(getGraphic.geometry)
                getGraphic.attributes = store.retsObj.attributes
                const convertToGeoCoord = webMercatorUtils.webMercatorToGeographic(getGraphic.geometry)
                view.hitTest(graphicToScreenPt, {include: roadLayerView.layer})
                    .then((hit) => {
                        if(!hit.results.length){
                            UpdatePt(convertToGeoCoord, false)
                            store.retsObj.attributes.NO_RTE = true
                            store.isSaveBtnDisable = false
                            store.isAlert = true
                            store.alertTextInfo = {"text": `No Route has been detected`, "color": "yellow", "type":"info", "toggle": true}
                            store.isMoveRetsPt = false
                            return
                        }
                        const convertMapPts = webMercatorUtils.webMercatorToGeographic(event.graphic.geometry)
                        findDFOLocation(convertMapPts, hit.results[0].graphic.attributes.GID)
                        completeMovePtSketch()
                        console.log(hit)
                        UpdatePt(convertToGeoCoord, false)
                        store.cancelEvent.remove()
                        store.isMoveRetsPt = false
                        // store.isSaveBtnDisable = false
                        // console.log(store.retsObj.attributes.NO_RTE)
                        return
                    })
                    .catch(() => {
                        //
                    })
                return
            }
        })
    
        if(!store.isMoveRetsPt){
            completeMovePtSketch()
            return
        }
    }
    catch(err){
        store.cancelEvent.remove()
        return
    }
    

    // const rdEvent = view.on(["click", "pointer-move"], async (event)=>{
    //     const hitTest = await view.hitTest(event, {include: [roadLayerView.layer]})
    //     try{
    //         if(event.type === "pointer-move" && store.isMoveRetsPt){
    //             if(!hitTest.results.length){
    //                 store.addPtRd = ""
    //                 store.DFO = null
    //             }
    //             if(hitTest.results.length){
    //                 if(store.isAdd){
    //                     const createMapPts = view.toMap(hitTest.screenPoint)
    //                     const convertMapPts = webMercatorUtils.webMercatorToGeographic(createMapPts)
                       
    //                     store.addPtRd = hitTest.results[0].graphic.attributes.RTE_NM
    //                     findDFOLocation(convertMapPts, hitTest.results[0].graphic.attributes.GID)
    //                         .then(dfo => store.DFO = dfo ? Number((dfo).toFixed(3)) : null)
                        
                        
                        

    //                     // store.addPtGID = hitTest.results[0].graphic.geometry
    //                     return
    //                 }
                   
    //                 store.retsObj.attributes.RTE_NM = hitTest.results[0].graphic.attributes.RTE_NM
    //                 return
    //             }
               
    //         }
            
    //         if(event.type === "click" && store.isMoveRetsPt){

    //             const createMapPts = view.toMap(hitTest.screenPoint)
    //             const convertMapPts = webMercatorUtils.webMercatorToGeographic(createMapPts)
    //             if(hitTest.results.length && (store.retsObj.attributes.NO_RTE === false || store.retsObj.attributes.NO_RTE === 0)){     
    //                 findDFOLocation(convertMapPts, hitTest.results[0].graphic.attributes.GID)
    //                 completeMovePtSketch()
    //                 store.isMoveRetsPt = false
    //                 changeCursor("default")
                       
    //             }
    //             else{
                    
    //                 store.retsObj.geometry = {
    //                     type: "point",
    //                     x: convertMapPts.x,
    //                     y: convertMapPts.y,
    //                 }
    //                // hideRetsPt(createGraphic.attributes.RETS_ID)
    //                 await UpdatePt(store.retsObj.geometry, false)
    //                 completeMovePtSketch()
                    
    //                 changeCursor("default")

    //                 store.retsObj.attributes.NO_RTE = true
    //                 store.isMoveRetsPt = false
    //                 if(!hitTest.results.length){
    //                     store.isAlert = true
    //                     store.alertTextInfo = {"text": `No Route has been detected`, "color": "yellow", "type":"info", "toggle": true}
    //                     store.isMoveRetsPt = false
    //                 }
    //             }

    //             return
                         
    //         }
    //     }
    //     catch(err){
    //         console.log(err)
    //     }
    // })
    
    // return rdEvent
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

export function buildDFOLines(rd, retsPt, dist){
    const constructLineA = new Graphic({
        geometry: {
            type: "polyline",
            paths:[
                rd.at(retsPt.vertexIndex),
                rd.at(retsPt.vertexIndex+1)
            ]
        }
    })

    const constructLineB = new Graphic({
        geometry: {
            type: "polyline",
            paths: [
                rd.at(retsPt.vertexIndex),
                rd.at(retsPt.vertexIndex-1)
            ]
        }
    })

    const distance = geometryEngine.intersects(constructLineA.geometry, retsPt.coordinate) ? rd.at(retsPt.vertexIndex)[2] + dist : rd.at(retsPt.vertexIndex)[2] - dist

    return distance
}

export const changeCursor = (c) => view.cursor = c

// export function getCardsExtent(){
    
//     retsLayerView.queryExtent({
//     })
//         .then(x => {
//             console.log(x)
//             // const extentPoly = {
//             //     type: "polygon",
//             //     extent: x.extent
//             // }
//             //geometryEngine.intersects(extentPoly)
//         })
// }


export function hideRetsPt(retsID){
    retsLayerView.layer.definitionExpression = `${appConstants['defaultQuery'](store.loggedInUser)} AND (RETS_ID not in (${retsID}))`
}

async function findDFOLocation(convertMapPts, gid){
    try{
        const road = await queryRoads("GID", gid)
        console.log(road)
        store.retsObj.attributes.RTE_NM = road.features[0].attributes.RTE_NM
    
        const roadConvertToGeo = webMercatorUtils.webMercatorToGeographic(road.features[0].geometry)
                                
        const returnCoord = geometryEngine.nearestCoordinate(roadConvertToGeo, convertMapPts)
        const neareastVertexPoint = new Graphic({
            geometry:{
                type: "point",
                longitude: roadConvertToGeo.paths[0].at(returnCoord.vertexIndex)[0],
                latitude: roadConvertToGeo.paths[0].at(returnCoord.vertexIndex)[1]
            },
            spatialReference:{
                wkid: 4326
            }
        })
        const {distance} = geodesicUtils.geodesicDistance(returnCoord.coordinate, neareastVertexPoint.geometry, "miles")
        //store.isMoveRetsPt = false
        const newDFO = buildDFOLines(roadConvertToGeo.paths[0], returnCoord, distance) //roadConvertToGeo.paths[0].at(vertexIndex)[2] + distance
        console.log(newDFO)
        store.retsObj.geometry = [returnCoord.coordinate.x, returnCoord.coordinate.y]
        store.retsObj.attributes.DFO = newDFO.toFixed(3)
        return newDFO
    }
    catch(err){
        console.log(err)
    }
    
}

export function hitTestMoveRETS(){
    let destoryTimeout;
    const movePointHitTest = view.on("pointer-move", (event) => {
        view.hitTest(event, {include: roadLayerView.layer})
            .then((hit) => {
                
                if(destoryTimeout){
                    clearTimeout(destoryTimeout)
                }
                if(!hit.results.length){
                    store.addPtRd = ""
                    store.DFO = null
                    return
                }
                destoryTimeout = setTimeout(()=>{
                    store.retsObj.attributes.RTE_NM = hit.results[0].graphic.attributes.RTE_NM
                },300)
                    
                return 
            })
            .catch(err => console.log(err))
    })

    return movePointHitTest
}

export async function isRoadExist(){
    const exist = await roadLayerView.queryFeatures({
        where: `RTE_NM = '${store.retsObj.attributes.RTE_NM}'`
    })
    
    if(!exist.features.length){
        return true
    }
    return false
}