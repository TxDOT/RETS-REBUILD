import {view, retsLayer, homeWidget, retsGraphicLayer, TxDotRoaways, retsHistory, graphics, flagRetsColor, sketchWidgetcreate} from './map-Init'
import Query from "@arcgis/core/rest/support/Query.js";
import Graphic from "@arcgis/core/Graphic.js";
import { appConstants } from "../common/constant.js";
import {store} from './store.js'
import {getDFOFromGRID} from './crud.js'
import { addRETSPT } from './crud.js';
import esriRequest from "@arcgis/core/request.js";
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils.js";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";import esriId from "@arcgis/core/identity/IdentityManager.js";



export function clickRetsPoint(){
    try{
        view.on("click", (event)=>{
            view.hitTest(event, {include: [retsLayer, retsGraphicLayer]}).then((evt) =>{
                if(!evt.results.length){
                    store.roadHighlightObj.length = 0
                    removeHighlight("a", true)
                    removeAllCardHighlight()
                    return
                }
                clearRoadHighlightObj()
                outlineFeedCards(evt.results)
                removeHighlight("a", true)
                if(store.isMoveRetsPt){
                    getPointRoadInteraction(evt.results)
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
                console.log("before: " + feature?.attributes.OBJECTID )
                lyrView._highlightIds.delete(feature?.attributes.OBJECTID)
                //console.log("after: " + feature?.attributes.OBJECTID )
                
                return
            }
            
            return
        })
}

function outlineFeedCards(res){
    res.forEach((x) => {
        //set card outline
        var objectcomparison = x.attributes ? String(x.attributes.RETS_ID).concat('-',x.attributes.OBJECTID) : String(x.graphic.attributes.RETS_ID).concat('-',x.graphic.attributes.OBJECTID)
        if(!document.getElementById(objectcomparison)) return
        document.getElementById(objectcomparison).classList.add('highlight-card')
        store.roadHighlightObj.add(objectcomparison)
        console.log(store.roadHighlightObj.size)
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
    return;
}

export function removeAllCardHighlight() {
    const getHighlightCardRows = document.getElementsByClassName("highlight-card")
    console.log(getHighlightCardRows)
    let i;
    for(i=0; i < getHighlightCardRows.length; i++){
        console.log(getHighlightCardRows[i])
        if(store.isShowSelected){
            getHighlightCardRows[i].parentElement.style.display = "none"
        }
        getHighlightCardRows[i].classList.remove('highlight-card')
        clearRoadHighlightObj()
    }
    return
}

export const clearRoadHighlightObj = () => store.roadHighlightObj.clear()

export const zoomTo = (geom) => view.goTo({center: [geom[0], geom[1]], scale: 30000})

export function getGEMTasks(){

    return [4516, 89, 1789]
    //getGemTasks when user types in #gem-search
}

//filter Map and activity feed 
export async function filterMapActivityFeed(filterOpt){
    let retsDefinitionExpressionArr = []
    for(let [key, value] of Object.entries(filterOpt)){
        if(!value || key === 'CREATE_DT' || key === 'filterTotal' || !value.length || key==='loggedInUser') continue
        if(value){
            if(key === "GIS_ANALYST" || key === 'STAT' || key === 'DIST_NM' || key === 'CNTY_NM' || key === 'ACTV' || key === 'JOB_TYPE'){
                retsDefinitionExpressionArr.push(`${key} in (${processDomainArr(value)})`)
                continue
            }
            if(key === "EDIT_DT"){
                const splitDate = value.split("-")
                splitDate.length === 1 ? retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[0]}'`) : retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)
                ///retsDefinitionExpressionArr.push(`${key} between timestamp '${splitDate[0]}' and timestamp '${splitDate[1]}'`)
                continue
            }
            retsDefinitionExpressionArr.push(`${key} in ('${value}')`)
        }
    }

    const filterMapPromise = new Promise((res, rej) => {
        const filterDef = retsDefinitionExpressionArr.join(' AND ')
        retsLayer.definitionExpression = `${filterDef}`
        res(filterDef)
    })
    const returnFilterMapPromise = await filterMapPromise
    return returnFilterMapPromise
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

export function getUniqueQueryValues(layer, constantsProp){
    const query = new Query()
    query.where = `1=1`
    query.outFields = ["*"]
    
    layer.queryFeatures(query)
        .then((item) => {
            item.features.forEach(x => constantsProp.push({
                "value" : x.attributes.USERNAME,
                "name": x.attributes.NAME,
                "email": x.attributes.EMAIL
            }))
        })
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
                                

                                if (pressedkey === false){
                                    if (selectedFeatures.length){
                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
                                            removeHighlight(selectedFeatures[i].attributes,removeAll); 
                                            

                                             
                                            
      
                                          }
                                          removeOutline();

                                    }

                                    
                                    for (let i = 0; i < selectedFeatures.length; i++ ) {
                                        //removeOutline();
                                        highlightRETSPoint(selectedFeatures[i].attributes);
                                        outlineFeedCards(selectedFeatures);
                                         //outlineFeedCards(selectedFeatures);
                                        
                                        
                                    }
                                    
                                    graphics.removeAll() 
                                    return
                                    
                                }

                                
                                 
                                
                                if(pressedkey === "Shift"){
                                    for (let i = 0; i < selectedFeatures.length; i++ ) {
                                        highlightRETSPoint(selectedFeatures[i].attributes);
                                        outlineFeedCards(selectedFeatures);

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
    
}

export function logoutUser(){
    esriId.destroyCredentials({
    })

}

export function removeOutline(){
    const classList = document.querySelectorAll('.highlight-card');
    classList.forEach(element => {
    element.classList.remove('highlight-card'); // Remove each element individually
    });
    
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

export function getPointRoadInteraction(retsPt){
    //create graphic of clicked Pt
    console.log(retsPt)
    const findRelatedPtGraphic = graphics.graphics.items.find(x => (x?.attributes?.OBJECTID === retsPt.attributes.OBJECTID) && x.geometry.type === 'point')
    if(findRelatedPtGraphic){
        moveDFOPt(retsPt)
        return
    }
    //check if route exist, if so plot the point based on dfo
    TxDotRoaways.queryFeatures({
        where: `RTE_NM = '${retsPt.attributes.RTE_NM}'`,
        returnM: true,
        returnGeometry: true,
        outFields: ["*"]
    })
    .then((rd) => {
        if(!rd.features.length || !retsPt.attributes.DFO){
            if(!retsPt.attributes.DFO){
                store.alertTextInfo = {"text": "Route Number or DFO is missing", "color": "red", "toggle": true}
                store.isAlert = true
                return
            }
            store.alertTextInfo = {"text": "Route Name isn't exact", "color": "red", "toggle": true}
            console.log('fail')
            store.isAlert = true
            

            
            return 
        }
        //start editing pt
        const findPtRoadBelongs = rd.features.find((rd) => {
            const roadIndex =  rd.geometry.paths[0].findIndex(i => i[2] > Number(retsPt.attributes.DFO))
            store.dfoIndex = roadIndex === -1 ? "not in range" : roadIndex
            return roadIndex
        })
        console.log(findPtRoadBelongs)
        console.log(store.dfoIndex)
        
        //create graphic of road
        const rdGraphic = new Graphic({
            geometry: findPtRoadBelongs.geometry,
            attributes:{
                OBJECTID: retsPt.attributes.OBJECTID,
                RETS_ID: retsPt.attributes.RETS_ID
            },
            symbol: {
                type:"simple-line",
                color: [226, 119, 40],
                width: 4
            }
        })
        graphics.add(rdGraphic)
        if(store.dfoIndex === 'not in range'){
            console.log('not in range')
            store.isAlert = false
            store.isAlert = true
            store.alertTextInfo = {"text": "DFO is out of Range", "color": "red", "toggle": true}
            return
        }
        //plot point
        store.isAlert = false
        const dfoDistanceDiff = findPtRoadBelongs.geometry.paths[0].at(store.dfoIndex)[2] - Number(retsPt.attributes.DFO)
        const returnDfoPt = calculateAzimuth(findPtRoadBelongs, store.dfoIndex, dfoDistanceDiff)
        const dfoPt = new Graphic({
            geometry: returnDfoPt,
            attributes:{
                OBJECTID: retsPt.attributes.OBJECTID,
                RETS_ID: retsPt.attributes.RETS_ID
            },
            symbol:{
                type: "simple-marker",
                color: "red",
                size: 8,
                outline:{
                    width: 0.5,
                    color: "#4472C4"
                }
            }
        })
        graphics.add(dfoPt)
        moveDFOPt(retsPt)
        console.log(rd)
    })
    .catch(err => console.log(err))
    //if dfo doesn't exist, edit the point




    //hide clicked Pt
    // console.log(view)
    // const RETSFeatureLayerView = view.allLayerViews._items.find(x => x.layer.title === "RETS")
    // RETSFeatureLayerView.filter = {
    //     where: `GIS_ANALYST = 'DPROSACK' and RETS_ID not in (${retsPt.attributes.RETS_ID})`
    // }

    //find road information as point moves over road
    //get dfo value
}

function calculateAzimuth(rdLine, dfoIndex, dfo){
    const pointB = {
        type: 'point',
        x: rdLine.geometry.paths[0].at(dfoIndex)[0],
        y: rdLine.geometry.paths[0].at(dfoIndex)[1],

    }

    const pointA = {
        type: 'point',
        x: rdLine.geometry.paths[0].at(dfoIndex - 1)[0],
        y: rdLine.geometry.paths[0].at(dfoIndex - 1)[1],

    }

    const webMerConvertPointA = webMercatorUtils.webMercatorToGeographic(pointA)
    const webMerConvertPointB = webMercatorUtils.webMercatorToGeographic(pointB)
    webMerConvertPointA.spatialReference.wkid = 4326
    webMerConvertPointB.spatialReference.wkid = 4326

    const dfoToMeter = dfo*1609.344
    let returnAzmuth = geodesicUtils.geodesicDistance(webMerConvertPointA, webMerConvertPointB, "miles")
    const returnPoint = calculatePointWithDistance(webMerConvertPointA, dfoToMeter, returnAzmuth.azimuth)
    return returnPoint
}

function calculatePointWithDistance(pointA, dis, azmiuth){
    
    const dfoPt = geodesicUtils.pointFromDistance(pointA, dis, azmiuth)
    const converGeoToWebDfoPt = webMercatorUtils.geographicToWebMercator(dfoPt)
    return converGeoToWebDfoPt
}

function moveDFOPt(retsPt){
    console.log(graphics)
    const findRelatedGraphics = graphics.graphics.items.filter(x => x.attributes.OBJECTID === retsPt.attributes.OBJECTID)
    const findRelatedPtGraphic = findRelatedGraphics.find(graphic => graphic.geometry.type === 'point')
    const findRelateLineGraphic = findRelatedGraphics.find(graphic => graphic.geometry.type === 'polyline')

    view.on("click", (event)=>{
        view.hitTest(event, {include: [graphics]}).then((evt) =>{
            if(!evt.results.length){
                return
            }
                
            sketchWidgetcreate.update(findRelatedPtGraphic)
            findDFOSlider(findRelateLineGraphic)


                // sketchWidgetcreate.create("point", (event)=>{

                //     console.log(event)
                // })
            console.log(evt.results[0].graphic)
            return
        })
    })
}

function findDFOSlider(findRelateLineGraphic){
    view.on("pointer-move", (event) => {
        view.hitTest(event, {include: [findRelateLineGraphic]})
            .then((evt)=> {
                if(!evt.results.length){
                    return
                }
                const mapCoords = view.toMap({
                    type: "point",
                    x: event.x,
                    y: event.y
                })
                const findNearestVertex = geometryEngine.nearestVertex(findRelateLineGraphic.geometry, mapCoords)
                const dfo = geodesicUtils.geodesicDistance(webMercatorUtils.webMercatorToGeographic(mapCoords), webMercatorUtils.webMercatorToGeographic(findNearestVertex.coordinate), "miles")
                // console.log(dfo.distance)
                // console.log(findRelateLineGraphic.geometry.paths[0].at(findNearestVertex.vertexIndex)[2])
                store.retsObj.attributes.DFO = dfo.distance + findRelateLineGraphic.geometry.paths[0].at(findNearestVertex.vertexIndex)[2]
            })
    })
    return
}

