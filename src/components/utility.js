import {view, retsLayer} from './map-Init'

export function hoverHighlight(){
    view.on("click", (event)=>{
        view.hitTest(event, {include: retsLayer}).then((evt) =>{
            console.log(evt)
        })
    })
}