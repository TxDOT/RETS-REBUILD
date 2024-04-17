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
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Graphic from "@arcgis/core/Graphic";
import { outlineFeedCards, removeOutline, removeHighlight, home} from "./utility.js";



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
 
 export let retsPointRendererout = new UniqueValueRenderer({
   field: "STAT", // Field based on which the symbology will be categorized
   uniqueValueInfos: [
    {
      value: "1",
      symbol: new SimpleMarkerSymbol({
        size: 5,
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
        size: 5,
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
        size: 5,
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
        size: 5,
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
 
  export let retsPointRendererout2 = new UniqueValueRenderer({
   field: "STAT", // Field based on which the symbology will be categorized
   uniqueValueInfos: [
    {
      value: "1",
      symbol: new SimpleMarkerSymbol({
        size: 6,
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
        size: 6,
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
        size: 6,
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
        size: 6,
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




export const polygonsymbol = {
  type: "simple-fill",  // autocasts as new SimpleFillSymbol()
  color: [224,224,224,.4],
  outline: {  // autocasts as new SimpleLineSymbol()
    color: "#636363",
    width: 2
  }
 
 
}


//Highlight graphics layer construction
export const highlightLayer = new GraphicsLayer();

const highlightSymbolroadways = {
  type: "simple-fill", // Use a simple fill symbol
  color: "transparent", // Transparent fill color
  outline: {
    color: '#00FFCC', // Red color for the outline
    width: 2 // Outline width
  }
};




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
//County Layer construction
export const texasCounties = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/Texas_County_Boundaries/FeatureServer/0",
  visible: false,
  
  
})

export const txdotDistricts = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Districts/FeatureServer/0",
  visible: false,
  popupEnabled: false,
  popupTemplate: null,
})

export const texasCities = new FeatureLayer({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_City_Boundaries/FeatureServer/0",
  visible: false,
})

// export const minuteOrders = new FeatureLayer({
//   url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Highway_Designations/FeatureServer",
//   visble: false, 
// })


//TxDotRoaways Layer construction
export const TxDotRoaways = new FeatureLayer ({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Roadways/FeatureServer/0",
  visible: true,
  renderer: roadwaysRenderer,
  outFields: ["*"],
  returnM: true,
  //definitionExpression: `RTE_PRFX = 'IH'`
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

export const flagRetsColor = new FeatureLayer({
  url: "https://testportal.txdot.gov/createags/rest/services/RETS_SUPPORT/FeatureServer/3"
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
  popupEnabled: false,
  popupTemplate: false,
  sources:
  [
    {
      name: "RETS ID",
      layer: retsLayer, 
      placeholder: "RETS ID",
      zoomScale: 5000,
      searchFields: ["RETS_ID","RTE_NM","CNTY_NM","DIST_NM","GIS_ANALYST","GRID_ANALYST","DIST_ANALYST","ACTV"],
      displayField: "RETS_ID",
      exactMatch: false,
      outFields: ["*"],
      maxSuggestions: 3,
      
    },
    
    {
      name: "County",
      layer: texasCounties, 
      placeholder: "County",
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
      placeholder: "District",
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
      placeholder: "Roadways",
      searchFields: ["RTE_NM", "GID"],
      displayField: "RTE_NM", 
      exactMatch: false,
      outFields: ["*"],
      minSuggestCharacters: 2,
    },
    {
      name: "Cities",
      layer: texasCities, 
      placeholder: "Cities",
      searchFields: ["CITY_NM"],
      displayField: "CITY_NM", 
      exactMatch: false,
      outFields: ["*"],
      //maxSuggestions: 1,
      minSuggestCharacters: 3,
    },
    {
      name: "Minute Order",
      layer: retsLayer, 
      placeholder: "Minute Order",
      zoomScale: 5000,
      searchFields: [ "ACTV_NBR"],
      displayField: "ACTV_NBR",
      exactMatch: false,
      outFields: ["*"],
      minSuggestCharacters: 2,
      maxSuggestions: 3,
      
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

map.addMany([retsLayer, graphics, retsGraphicLayer, texasCounties, texasCities, TxDotRoaways, highlightLayer, txdotDistricts])


searchWidget.on("select-result", function(event) {
  const selectedFeature = event.result.feature;
  highlightLayer.removeAll(); // Clear previous highlights

    if (selectedFeature.geometry.type === "polygon") {
      
    // Highlight the selected polygon feature with highlightSymbol
    highlightLayer.add(new Graphic({
      geometry: selectedFeature.geometry,
      symbol: polygonsymbol
    }));
    
  } else if (selectedFeature.geometry.type === "polyline") {
    // Highlight the selected polyline feature with highlightSymbolRoadways
    highlightLayer.add(new Graphic({
      geometry: selectedFeature.geometry,
      symbol: highlightSymbolroadways
    }));
  } else if (selectedFeature.geometry.type === "point") {
    const tempArray = [selectedFeature];
    // Run the highlightRestPoints function on the selected point feature
    removeOutline();
    //removeHighlight(selectedFeature, true)
    outlineFeedCards(tempArray);
  }
  


});
searchWidget.on("search-clear", function(event) {
  // Clear the highlight when the search is cleared
    highlightLayer.removeAll();
  
  
    removeOutline();


});

searchWidget.on("search-complete", function(event){
  // The results are stored in the event Object[]
  highlightLayer.removeAll();
});

document.addEventListener('click', function(event) {
  const targetElement = event.target.className;
      if (targetElement === 'esri-search__source esri-menu__list-item' )
      {
           const searchInput = document.querySelector(".esri-search__input");
           searchInput.value = null;
           searchWidget.activeMenu = "none";
        searchWidget.focus()

      }

      
      
     

});


homeWidget.on("go", function() {
  // Run your function here
  home();
});

view.watch("scale", function(newValue) {
  if (newValue < 1000000 ) { // Adjust this scale threshold as needed
    retsLayer.renderer = retsPointRenderer;
  } 
  else if(newValue > 1000000 && newValue < 2000000){
    retsLayer.renderer = retsPointRendererout2
  }
  else {
    retsLayer.renderer = retsPointRendererout;
  }
});

//TxDotRoaways
//remove attribution and zoom information
view.ui.remove("attribution")
// </></>

//create RETS FeatureLayerView