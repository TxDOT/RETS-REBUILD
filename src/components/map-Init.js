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
import Legend from "@arcgis/core/widgets/Legend";
import LegendViewModel from "@arcgis/core/widgets/Legend/LegendViewModel";

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
      color: appConstants.CardColorMap[2],
      outline: {
        color: "white",
        width: 0
      }
    }),
    label: "In Progress"
  },
  {
    value: "3",
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
    value: "4",
    symbol: new SimpleMarkerSymbol({
      size: 8,
      color: appConstants.CardColorMap[4],
      outline: {
        color: "white",
        width: 0
      }
    }),
    label: "On Hold"
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
export let polygonRenderer = {
  type: "simple",
    symbol: {
      type: "simple-fill",  // autocasts as new SimpleFillSymbol()
      color: "transparent",
      style: "solid",
      outline: {  // autocasts as new SimpleLineSymbol()
        color: "transparent",
        width: 0
      }
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

//County Layer construction
export const texasCounties = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Counties_Detailed/FeatureServer/0",
  visible: true,
  renderer: polygonRenderer
  
  
})

export const txdotDistricts = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Districts/FeatureServer/0",
  visible: true,
  renderer: polygonRenderer
})

export const texasCities = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_City_Boundaries/FeatureServer/0",
  visible: true,
  renderer: polygonRenderer
})

export const minuteOrders = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Highway_Designations/FeatureServer",
  visble: true, 
  renderer: roadwaysRenderer
})




//TxDotRoaways Layer construction
export const TxDotRoaways = new FeatureLayer ({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Roadways/FeatureServer/0",
  visible: true,
  renderer: roadwaysRenderer,
})

//Creates label class for RETS points
export const retsLabelclass = new LabelClass({
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
  url: "https://www.arcgis.com/sharing/rest/content/items/507a9905e7154ce484617c7327ee8bc4/resources/styles/root.json",
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
    lods: TileInfo.create().lods, //property to allow a mapview center to the imagery basemap
    rotationEnabled: false,
  },
  
})



//create search widget
export const searchWidget = new Search({
  
  view: view,
  includeDefaultSources: false,
  allPlaceholder: "City, County, District, Route",
  sources:
  [
    {
      name: "RETS ID",
      layer: retsLayer, 
      zoomScale: 5000,
      searchFields: ["RETS_ID","GIS_ANALYST","GRID_ANALYST","DIST_ANALYST","ACTV"],
      displayField: "RETS_ID", 
      exactMatch: false,
      outFields: ["*"],
      minSuggestCharacters: 2,
      
    },
    {
      name: "County",
      layer: texasCounties, 
      searchFields: ["CNTY_NM"],
      displayField: "CNTY_NM", 
      exactMatch: false,
      outFields: ["*"],
      maxSuggestions: 1,
      minSuggestCharacters: 2,
      
    },
    {
      name: "District",
      layer: txdotDistricts, 
      searchFields: ["TXDOT_DIST_NM"],
      displayField: "TXDOT_DIST_NM", 
      exactMatch: false,
      outFields: ["*"],
      maxSuggestions: 3,
      minSuggestCharacters: 2,
    },
    {
      name: "Roadways",
      layer: TxDotRoaways, 
      searchFields: ["RTE_NM", "GID"],
      displayField: "RTE_NM", 
      exactMatch: false,
      outFields: ["*"],
      maxSuggestions: 1,
      minSuggestCharacters: 2,
    },
    {
      name: "Cities",
      layer: texasCities, 
      searchFields: ["CITY_NM"],
      displayField: "CITY_NM", 
      exactMatch: false,
      outFields: ["*"],
      //maxSuggestions: 1,
      minSuggestCharacters: 3,
    },
    {
      name: "Minute Orders",
      layer: minuteOrders, 
      searchFields: ["mo_nbr"],
      displayField: "mo_nbr", 
      exactMatch: false,
      outFields: ["*"],
      //maxSuggestions: 1,
      minSuggestCharacters: 3,
    },
    
    
  ],

});

export var homeWidget  = new Home({
  view: view,
});

//creates search widget
export const ZoomWidget = new Zoom({
  view: view
});

export const legendWidget = new Legend({
  view: view,
  viewModel: new LegendViewModel 
  ({
      view: view,
      layerInfos:
          [
              {
                  title: false,
                  layer: retsLayer,
              
              }
          ]
  }),
  style : {
      type: "card",
      layout: "side-by-side"
  },
  headingLevel: 0,
  id: "esrilegend",
  visible: false,
});
 export const sketchWidgetselect = new Sketch({
  layer: graphics, // Replace with your actual feature layer
  view: view,
  creationMode: "continuous", // Replace with your actual map view
  // defaultUpdateOptions: {
  //     tool: "transform"
  // }

});

export const sketchWidgetcreate = new Sketch({
  layer: graphics, // Replace with your actual feature layer
  view: view,
  creationMode: "single", // Replace with your actual map view
  snappingOptions: {
      enabled: true,
      featureSources: [{layer: TxDotRoaways, enabled: true}]
  },


});


// Adds the search widget below other elements in the top right corner of the view
view.ui.add(searchWidget, {
  position: "top-right",
  index: 2,
  container: "searchcont",
});

searchWidget.on("select-result", function(event) {
  const selectedFeature = event.result.feature;
  
  if (selectedFeature && selectedFeature.geometry) {
    // Calculate the extent of the selected feature
    const extent = selectedFeature.geometry.extent;
    
    
    // Set the map view's extent based on the feature's extent
    console.log(extent)
    view.extent = extent;
  }
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
view.ui.add(legendWidget, {
  position: "bottom-right"
})    

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

map.addMany([retsLayer,TxDotRoaways, graphics, retsGraphicLayer, texasCounties, texasCities, minuteOrders])

//remove attribution and zoom information
view.ui.remove("attribution")
// </></>



