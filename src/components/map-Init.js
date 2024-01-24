//import ESRI JS ESM classes
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js"
import Basemap from "@arcgis/core/Basemap.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";

//used to register ESRI Application so users can access map
export const authentication = new OAuthInfo({
    appId: "mzUb97L38u61Wa4a",
    popup: false,
    popupCallbackUrl: "http://localhost:5173/"
})

esriId.registerOAuthInfos([authentication]);

//Rets Layer construction
export const retsLayer =  new FeatureLayer({
    url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadway_Edits_Tracking/FeatureServer/0",
    visible: true,
    outFields: ["*"],
    definitionExpression: `GIS_ANLST = 'David Prosack' and STAT = 'Not Started'`,
})

//Dark Vector Tile construction
export const darkVectorTile = new VectorTileLayer({
    url: "https://www.arcgis.com/sharing/rest/content/items/4bd376c56f314bc5a36446630db604a6/resources/styles/root.json"
})

//Add Vector Tile as a basemap
export const darkVTBasemap = new Basemap({
    baseLayers: darkVectorTile
})

//add  basemap to the map
export const map = new Map({
    basemap: darkVTBasemap,
})

//add  map to the mapview, set zoom and center of screen when the application loads
export const view = new MapView({
    map: map,
    zoom: 6,
    center: [-100, 31.5],
    highlightOptions: {
        color: "orange"
    }
})

//add feature layers to the map
map.add(retsLayer)

//remove attribution and zoom information
view.ui.remove("attribution");