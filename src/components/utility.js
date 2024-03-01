import {view, retsLayer, homeWidget} from './map-Init'
import Query from "@arcgis/core/rest/support/Query.js";
import { appConstants } from "../common/constant.js";

export function clickRetsPoint(){
    view.on("click", (event)=>{
        view.hitTest(event, {include: retsLayer}).then((evt) =>{
            if(!evt.results.length) return
            outlineFeedCards(evt.results)
            return;
        })
    })
}

function outlineFeedCards(res){
    res.forEach((x) => {
        //set card outline
        document.getElementById(`${x.graphic.attributes.OBJECTID}`).classList.add('highlight-card')
        //zoom to card in feed
        const zoomToCard = document.createElement('a')
        zoomToCard.href = `#${x.graphic.attributes.OBJECTID}`
        zoomToCard.click()
        //remove card outline
        setTimeout(()=>{
            document.getElementById(`${x.graphic.attributes.OBJECTID}`).classList.remove('highlight-card')
        },5000)
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
            holdArr.push(x.value)
        }

    })
    return holdArr
}

export function getQueryLayer(whereString, orderFields){

    const query = new Query()
    query.where = `${whereString}`
    query.orderByFields = [`${orderFields}`]
    query.outFields = ["*"]
    query.returnGeometry = true
    
    return retsLayer.queryFeatures(query)
}


export function searchCards(cardArr, string, index){
    // if(!string.length){
    //     cardArr.forEach(x => document.getElementById(`${x[index]}`).classList.add('showCards'))
    //     return
    // }
    cardArr.forEach((x) => {
        const a = Object.values(x).find(t => String(t).includes(string))
        if(a){
            console.log(x)
            document.getElementById(`${x[index]}`).classList.add('showCards')
        }
        else{
            document.getElementById(`${x[index]}`).classList.remove('showCards')
            document.getElementById(`${x[index]}`).classList.add('hideCards')
        }
    })
    
}

export function home(){
    homeWidget.cancelGo()
    homeWidget.on("go", ()=>{
        
        retsLayer.queryExtent()
            .then((resp) =>{
                view.goTo(resp.extent)
            })
    })
}