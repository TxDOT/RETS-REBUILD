//import ESRI JS ESM classes
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js"
import Basemap from "@arcgis/core/Basemap.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Home from "@arcgis/core/widgets/Home.js";
import Search from "@arcgis/core/widgets/Search.js";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";
import { appConstants } from "../common/constant"; 
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import OpenStreetMapLayer from "@arcgis/core/layers/OpenStreetMapLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import TileInfo from "@arcgis/core/layers/support/TileInfo.js";

export let retsPointRenderer = new UniqueValueRenderer({
 field: "STAT", // Field based on which the symbology will be categorized
 uniqueValueInfos: [
  {
    value: "1",
    symbol: new SimpleMarkerSymbol({
      size: 8,
      color: appConstants.CardColorMap[1],
      outline: {
        color: "white",
        width: 0
      }
     }),
     label: "Not Started"
  },
  {
    value: "2",
      symbol: new SimpleMarkerSymbol({
      size: 8,
      color: appConstants.CardColorMap[3],
        outline: {
          color: "white",
          width: 0
        }
      }),
      label: "Complete"
  },
  {
    value: "3",
    symbol: new SimpleMarkerSymbol({
      size: 8,
      color: appConstants.CardColorMap[2],
      outline: {
        color: "white",
        width: 0
      }
    }),
    label: "in Progress"
  },

  // Add more unique value info objects as needed...
  ]
});

export let roadwaysRenderer = {
  type: "simple",
    symbol: {
      type: "simple-line",
      width: 0,
      opacity: 0,
      color: "transparent"
    }
}
//Rets Layer construction
export const retsLayer = new FeatureLayer({
  url: "https://testportal.txdot.gov/createags/rest/services/RETS/FeatureServer/0",
  visible: true,
  outFields: ["*"],
  renderer: retsPointRenderer,
  editingEnabled: true,
})

//DFO Producer in GRID
export const DFOProducer = new FeatureLayer({
  url: "https://testportal.txdot.gov/createags/rest/services/RETS_PNT_HELPER/FeatureServer/0",
  outFields:["*"],
  returnM: true,
  returnZ: true,
  hasM: true,
  hasZ: true,
  visible: true,
})

//TxDotRoaways Layer construction
export const TxDotRoaways = new FeatureLayer ({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Roadways/FeatureServer/0",
  visible: true,
  renderer: roadwaysRenderer,
  outFields: ["GID"],
  hasM: true
})

//RETS History
export const retsHistory = new FeatureLayer({
  url: "https://testportal.txdot.gov/createags/rest/services/RETS_CMNT/FeatureServer/0",
  outFields: ["*"]
})

//Rets User Roles
export const retsUserRole = new FeatureLayer({
  url: "https://testportal.txdot.gov/createags/rest/services/RETS_SUPPORT/FeatureServer/1"
})

//Creates label class for RETS points
const retsLabelclass = new LabelClass({
  labelExpressionInfo : {expression: "$feature.RETS_ID"},
  symbol: {
    type: "text",
    color: "white",
    font: {
      size: 12
    }
  },
  labelPlacement: "above-right",
  minScale: 200000,
})

//Applies label class to rets layer
retsLayer.labelingInfo = [retsLabelclass];

export const sketchLayer = new GraphicsLayer({});

export const retsGraphicLayer = new GraphicsLayer({});

export const graphics = new GraphicsLayer({});
////////////////////////////////////////////BASEMAPS//////////////////////////////////////////////////////////////////////////
        
//Dark Vector Tile construction
export const darkVectorTile = new VectorTileLayer({
  url: "https://www.arcgis.com/sharing/rest/content/items/4bd376c56f314bc5a36446630db604a6/resources/styles/root.json"
})

//Add Vector Tile as a basemap
export const darkVTBasemap = new Basemap({
  baseLayers: darkVectorTile
})
 
//Light Vector Tile construction
export const lightVectorTile = new VectorTileLayer({
  url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer",
  labelsVisible: true,
})

export const createretssym = new SimpleMarkerSymbol({
  size: 8,
  color: appConstants.CardColorMap[1],
  outline: {
    color: "white",
    width: 0
  },
})

//Imagery Layer construction
export const imageryTxdot = new WMTSLayer({
  url: "https://txgi.tnris.org/login/path/bucket-armada-virtual-lobby/wmts/1.0.0/WMTSCapabilities.xml",
  //url: "https://txgi.tnris.org/login/path/food-paul-zebra-shirt/wmts/1.0.0/WMTSCapabilities.xml"
})

//Created imagery basemap
export const imageryBasemap = new Basemap({
  baseLayers: [imageryTxdot]
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
  ui: {
    components: ["attribution"]
  },
  highlightOptions:{
    color: '#00FFCC',
    fillOpacity: 1
  },
  constraints: {
    lods: TileInfo.create().lods //property to allow a mapview center to the imagery basemap
  }
})

export var sketchWidget = new Sketch({
  layer: retsLayer, // Replace with your actual feature layer
  view: view, // Replace with your actual map view
  // Other configuration options for the Sketch widget
  creationMode: "single"
});
        

// let sketch = new Sketch({
//   layer: retsLayer,
//   view: view,
//   snappingOptions:{
//     enabled: true,
//     featureSources: [{layer: TxDotRoaways, enabled: true}]
//   }
// });

//create search widget
export const searchWidget = new Search({
  view: view,
  includeDefaultSources: false,
  sources:
  [
    {
      name: "RETS ID",
      layer: retsLayer, 
      placeholder: "City, County, District, Route",
      zoomScale: 5000,
      searchFields: ["RETS_ID","RTE_NM","CNTY_NM","DIST_NM","GIS_ANALYST","GRID_ANALYST","DIST_ANALYST","MO_NBR","ACTIVITY"],
      displayField: "RETS_ID",
      exactMatch: false,
      outFields: ["RETS_ID"],
      minSuggestCharacters: 0,
    },
  ] 
});

export var homeWidget  = new Home({
  view: view,
});

//creates search widget
export const ZoomWidget = new Zoom({
  view: view
});

// Adds the search widget below other elements in the top right corner of the view
view.ui.add(searchWidget, {
  position: "top-right",
  index: 2
});

//adds zoom widget to map 
view.ui.add(ZoomWidget, {
  position: "top-right",
  index: 3
});

//adds zoom widget to map 
view.ui.add(ZoomWidget, {
  position: "top-right",
  index: 3
});

view.ui.add(homeWidget, {
  position: "top-right",
  index: 3
});

//remove attribution and zoom information
view.ui.remove("attribution")
// </></>
        
////////////////////////////////////////////BASEMAPS AND LAYERS//////////////////////////////////////////////////////////////////////////
        
//Light Vector Tile basemap construction
export const lightVTBasemap = new Basemap({
  baseLayers: lightVectorTile
})

//Standard Vector Tile construction
export const standardVectorTile = new VectorTileLayer({
  url: "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer"
})

//Standard Vector Tile basemap construction
export const standardVTBasemap = new Basemap({
  baseLayers: standardVectorTile
})

//Google Web Tile construction
export const googleVectorTile = new WebTileLayer({
  urlTemplate: "https://mt1.google.com/vt/lyrs=r&x={col}&y={row}&z={level}",
})

//Google Web Tile basemap construction
export const googleVTBasemap = new Basemap({
  baseLayers: googleVectorTile
})

//Open Street Map Layer construction
export const OSMBasemap = new OpenStreetMapLayer({
  visible: true,                  
  name: "osm"                
})

//Open Street Map basemap construction
export const OSMVTBasemap = new Basemap({
  baseLayers: OSMBasemap
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

map.addMany([retsLayer, TxDotRoaways, sketchLayer, graphics, retsGraphicLayer])

//remove attribution and zoom information
view.ui.remove("attribution")
// </></>
