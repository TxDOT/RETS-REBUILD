import {view, retsLayer, homeWidget, retsGraphicLayer, TxDotRoaways, retsHistory, graphics} from './map-Init'
import Query from "@arcgis/core/rest/support/Query.js";
import Graphic from "@arcgis/core/Graphic.js";
import { appConstants } from "../common/constant.js";
import {store} from './store.js'
import {getDFOFromGRID} from './crud.js'
import { addRETSPT } from './crud.js';
import esriRequest from "@arcgis/core/request.js";

export function clickRetsPoint(){
    try{
        view.on("click", (event)=>{
            view.hitTest(event, {include: [retsLayer, retsGraphicLayer]}).then((evt) =>{
                if(!evt.results.length){
                    removeHighlight("a", true)
                    return
                }
                outlineFeedCards(evt.results)
                removeHighlight("a", true)
                evt.results.forEach(rest => rest.graphic.layer.title ? highlightRETSPoint(rest.graphic.attributes) : highlightGraphicPt(rest.graphic.attributes))
                // highlightRETSPoint(evt.results)
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
        view.hitTest(event, {include: [retsLayer, retsGraphicLayer]}).then((evt) =>{
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
            //highlights Point by giving OBJECTID
            if(lyrView._highlightIds.has(feature.OBJECTID)){
                lyrView._highlightIds.delete(feature.OBJECTID)
                return
            }
            return
        })
}

function outlineFeedCards(res){
    res.forEach((x) => {
        console.log(x.graphic.attributes)
        //set card outline
        const retsId = String(x.graphic.attributes.RETS_ID)
        const oid = String(x.graphic.attributes.OBJECTID)
        if(!document.getElementById(`${retsId}-${oid}`)) return
        document.getElementById(`${retsId}-${oid}`).classList.add('highlight-card')
        //zoom to card in feed

        const zoomToCard = document.createElement('a')
        zoomToCard.href = `#${retsId}-${oid}`
        zoomToCard.click()
        //remove card outline
        // setTimeout(()=>{
        //     document.getElementById(`${retsId}-${oid}`).classList.remove('highlight-card')
        // },5000)
    })
    return;
}


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
    // if(!string.length){
    //     cardArr.forEach(x => document.getElementById(`${x[index]}`).classList.add('showCards'))
    //     return
    // }
    cardArr.forEach((x) => {
        const a = Object.values(x.attributes).find(t => String(t).includes(string))
        if(a){
            document.getElementById(`${x.attributes[index]}`).classList.add('showCards')
        }
        else{
            document.getElementById(`${x.attributes[index]}`).classList.remove('showCards')
            document.getElementById(`${x.attributes[index]}`).classList.add('hideCards')
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

export function returnDFO(roadName, dfo){
    
    view.on("pointer-move", (event)=>{
        view.hitTest(event, {include: [TxDotRoaways]})
            .then((x) =>{
                if(!x.results.length) return
                getDFOFromGRID(x.results[0].graphic.attributes.GID, .2)
            })
    })
    
    // new Query({
    //     returnGeometry: true
    // })
    //query for road
    //find dfo placement on the road
        //find segment point is on (two points) => before, end
        //take beginning measure and find delta between beginning and placed point
        //return new dfo
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

export function selecttool(isSelectEnabled, sketchWidgetselect, clearSelection, graphics){
    var testshift = false;
    window.addEventListener("keydown", (event)=>{
        testshift = event.key
    });
    window.addEventListener("keyup", () => {
      testshift = false
    });
  
    if(isSelectEnabled === true){ 
        var state = clearSelection
        sketchWidgetselect.create("rectangle");
        state = !state
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

                                if (state === true && testshift != "Shift"){
                                    console.log('true')
                                    for (let i = 0; i < selectedFeatures.length; i++ ) {
                                      removeHighlight(selectedFeatures[i].attributes,state);  

                                      
                                    }
                                    for (let i = 0; i < selectedFeatures.length; i++ ) {
                                        highlightRETSPoint(selectedFeatures[i].attributes);
                                        
  
                                  }   
                                  console.log(selectedFeatures) 
                                  //outlineFeedCards(selectedFeatures);
                                  graphics.removeAll() 
                                   return 
                                }
                                
                                 if(state === true && testshift === "Shift"){
                                    console.log('false')

                                    for (let i = 0; i < selectedFeatures.length; i++ ) {
                                        highlightRETSPoint(selectedFeatures[i].attributes);
                                        
  
  
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
        clearSelection = !clearSelection
            
    }
    
    window.removeEventListener("keydown", (event)=>{
        testshift = event.key
    });
    window.removeEventListener("keyup", () => {
        testshift = false
    });

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