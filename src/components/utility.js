import {view} from './map-Init'

export function hoverHighlight(){
    view.on("click", (event)=>{
        view.hitTest(event).then((evt) =>{
            console.log(evt)
        })
    })
}