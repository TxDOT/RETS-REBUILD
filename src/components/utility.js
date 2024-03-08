import {view, retsLayer, homeWidget} from './map-Init'

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
        },500)
    })
    return;
}


export const zoomTo = (geom) => view.goTo({center: [geom[0], geom[1]], scale: 30000})

export function getGEMTasks(){

    return [4516, 89, 1789]
    //getGemTasks when user types in #gem-search
}

export function home(){
    //cancels the initial viewpoint
    homeWidget.cancelGo()
    homeWidget.on("go", ()=>{
        retsLayer.queryExtent()
            .then((resp) =>{
                    //sets the view to the extent of the geometry
                view.goTo(resp.extent)
            })
    })
}

export function logAttributes(feature) {
    view.whenLayerView(retsLayer)
        .then((lyrView) => {
            console.log(feature.OBJECTID)

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


