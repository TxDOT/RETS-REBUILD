import {view, retsLayer} from './map-Init'
import Query from "@arcgis/core/rest/support/Query.js";
import {getUserId} from './login.js'

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
        document.getElementById(`${x.graphic.attributes.RETS_ID}`).classList.add('highlight-card')
        //zoom to card in feed
        const zoomToCard = document.createElement('a')
        zoomToCard.href = `#${x.graphic.attributes.RETS_ID}`
        zoomToCard.click()
        //remove card outline
        // setTimeout(()=>{
        //     document.getElementById(`${x.graphic.attributes.RETS_ID}`).classList.remove('highlight-card')
        // },500)
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
    console.log(filterOpt)
    let retsDefinitionExpressionArr = []
    for(let [key, value] of Object.entries(filterOpt)){
        if(!value || key === 'CREATE_DT' || key === 'filterTotal' || !value.length || key==='loggedInUser') continue
        if(value){
            if(key === "GIS_ANALYST" || key === 'STAT' || key === 'DIST_NM' || key === 'CNTY_NM'){
                retsDefinitionExpressionArr.push(`${key} in (${processDomainArr(value)})`)
                continue
            }
            // typeof value === 'string' ? value = `'${value}'` : null
            // const arrString = value.toString()
            retsDefinitionExpressionArr.push(`${key} in (${value})`)
        }
    }

    const filterMapPromise = new Promise((res, rej) => {
        
        const filterDef = retsDefinitionExpressionArr.join(' AND ')
        console.log(filterDef)
        retsLayer.definitionExpression = `${filterDef}`
        res(filterDef)
    })
    const hel = await filterMapPromise
    console.log(hel)
    return hel
}

export const getDomainValues = (fieldName) => retsLayer.getFieldDomain(fieldName)

export function processDomainArr(domain){
    const holdArr = []

    domain.forEach((x) => {
        if(x.name === 'Username'){
            holdArr.push(`'${x.value}'`)
            console.log(holdArr)
        }
        else{
            holdArr.push(x.value)
        }

    })
    return holdArr
}

export async function getQueryLayer(){

    const user = await getUserId()
    const query = new Query()
    query.where = `(GIS_ANALYST = '${user}') AND (STAT = 1 OR STAT = 2)`
    query.orderByFields = ["EDIT_DT"]
    query.outFields = ["*"]
    query.returnGeometry = true
    
    return retsLayer.queryFeatures(query)

        
}