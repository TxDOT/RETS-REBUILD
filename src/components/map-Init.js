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
import Graphic from "@arcgis/core/Graphic";
import { outlineFeedCards, removeOutline, home, scrollToTopOfFeed, highlightRETSPoint, removeHighlight} from "./utility.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import {store} from './store.js'
import esriConfig from "@arcgis/core/config.js";
import Point from '@arcgis/core/geometry/Point';



export const texasExtent = new Extent({
  xmin: -106.649513,
  ymin: 25.837163,
  xmax: -93.507217,
  ymax: 36.500704,
  spatialReference: {
    wkid: 4326 // WGS84 coordinate system
  }
})


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
    color: "rgba(65, 66, 66, 0)"
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

export const pointsymbol = {
  type: "simple-marker",
        color: "cyan",
        size: 8,
        outline:{
            width:0,
            color: "cyan"
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

//TxDOTRoadways Layer construction
export const TxDOTRoadways = new FeatureLayer ({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Roadways/FeatureServer/0",
  visible: true,
  renderer: roadwaysRenderer,
  outFields: ["*"],
  returnM: true,
  hasM: true,
  definitionExpression: `RTE_PRFX = 'IH'`
})

export const TxDOTRoadwayscopy = new FeatureLayer ({
  url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Roadways/FeatureServer/0",
  visible: true,
  renderer: roadwaysRenderer,
  outFields: ["*"],
  returnM: true,
  hasM: true,
  definitionExpression: "",
  visible:false
})

//Rets Layer construction
export const retsLayer = new FeatureLayer({
  url: store.devStatus === "dev" ? appConstants.retsPtDev : appConstants.retsPtProd,
  visible: true,
  outFields: ["*"],
  renderer: retsPointRenderer,
  editingEnabled: true,
})

export const retsRole = new FeatureLayer({
  //url: appConstants.retsUserRoleDev,
  url: store.devStatus === "dev" ? appConstants.retsUserRoleDev : appConstants.retsUserRoleProd,
  visible: false,
  outFields: ["*"],

})

//RETS History
export const retsHistory = new FeatureLayer({
  url: store.devStatus === "dev" ? appConstants.retsCMNTDev : appConstants.retsCMNTProd,
  outFields: ["*"],
  visible: true
})

//Rets User Roles
export const retsUserRole = new FeatureLayer({
  url: store.devStatus === "dev" ? appConstants.retsUserRoleDev : appConstants.retsUserRoleProd,
})

export const flagRetsColor = new FeatureLayer({
  url: store.devStatus === "dev" ? appConstants.retsFlagColorDev : appConstants.retsFlagColorProd,
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
  navigation: {
    mouseWheelZoomEnabled: true,
  },
  
})
export let featureSuggestions =  []  // To store the limited features

//create search widget
export const searchWidget = new Search({
  
  /////////////////////////////////
  view: view,
  includeDefaultSources: false,
  allPlaceholder: "City, County, District, Route, Minute Order, RETS ID",
  popupEnabled: false,
  popupTemplate: false,
  minSuggestCharacters: 3,
  maxSuggestions: 3,
  sources:
  [
    {
      name: "RETS ID",
      layer: retsLayer, 
      placeholder: "RETS ID",
      zoomScale: 5000,
      searchFields: ["RETS_ID"],
      displayField: "RETS_ID",
      exactMatch: false,
      outFields: ["*"],
     
    },
    {
      name: "County",
      layer: texasCounties, 
      placeholder: "County",
      searchFields: ["CNTY_NM"],
      displayField: "CNTY_NM", 
      exactMatch: false,
      outFields: ["*"],
      
    },
    {
      name: "District",
      layer: txdotDistricts, 
      placeholder: "District",
      searchFields: ["TXDOT_DIST_NM"],
      displayField: "TXDOT_DIST_NM", 
      exactMatch: false,
      outFields: ["*"],
    },

    {
      name: "Roadways",
      layer: TxDOTRoadwayscopy, 
      placeholder: "Roadways",
      searchFields: ["RTE_NM", "GID"],
      displayField: "RTE_NM", 
      exactMatch: false,
      outFields: ["*"],
      //suggestionTemplate: "NAME: {RTE_NM} (GID: {GID})"
    },
    {
      name: "City",
      layer: texasCities, 
      placeholder: "City",
      searchFields: ["CITY_NM"],
      displayField: "CITY_NM", 
      exactMatch: false,
      outFields: ["*"],
    },
    {
      name: "Minute Order",
      layer: retsLayer, 
      maxSuggestions:3,
      placeholder: "Minute Order",
      //zoomScale: 5000,
      searchFields: [ "ACTV_NBR" ],
      displayField: "ACTV_NBR",
      exactMatch: false,
      outFields: ["*"],
      suggestionTemplate: "RETS: {RETS_ID} (MO Number: {ACTV_NBR})", 
      getSuggestions: async function (searchValue) {
        const query = {
          where: `ACTV_NBR IS NOT NULL`,
          outFields: ["*"],
          returnGeometry: false,
          orderByFields: ["ACTV_NBR"]
        };
    
        try {
          const results = await retsLayer.queryFeatures(query);
          const features = results.features;
    
          const filteredFeatures = features.filter(feature => {
            const actvNbr = feature.attributes.ACTV_NBR;
            return actvNbr &&
                   String(actvNbr).toLowerCase().includes(searchValue.suggestTerm); 
          });
    
          const limitedFeatures = filteredFeatures.slice(0, 3);
          featureSuggestions = limitedFeatures
          // Process features into suggestions
          return limitedFeatures.map(feature => ({
            key: `${feature.attributes.RETS_ID}`,
            text: `RETS: ${feature.attributes.RETS_ID} (MO: ${feature.attributes.ACTV_NBR})`, 
            sourceIndex: 5 

          }));
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          return [];
        }
      },
    
      getResults: async function (suggestion) {

    const retsId = suggestion.suggestResult.key;

    const query = {
        where: `RETS_ID = ${retsId}`, 
        outFields: ["*"],
        returnGeometry: true 
    };

    try {
        const results = await retsLayer.queryFeatures(query);
        const feature = results.features[0]; 
       
        if (feature) {
            const geometry = feature.geometry
            let point = geometry
            view.goTo({
              target: point,
              zoom: 16,
            })
            highlightLayer.add(new Graphic({
              geometry: feature.geometry,
              symbol: pointsymbol
            }));
            const tempArray = [feature];
            removeOutline();
            outlineFeedCards(tempArray);
            
            const retsidnum = String(feature.attributes.OBJECTID).concat('-', feature.attributes.RETS_ID);
            setTimeout(() => {
              const element = document.getElementById(retsidnum);

              if (element) {
                element.classList.add("highlight-card");
            } else {
                console.log(`error`);
            }
            }, 1000);
           
        } 
        
    } catch (error) {
        console.error("Error querying feature:", error);
    }

        
    }
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
  layer: graphics,
  view: view,
  creationMode: "continuous",


});

export const sketchWidgetcreate = new Sketch({
  layer: graphics,
  view: view,
  creationMode: "single", 
  snappingOptions: {
      enabled: true,
      featureSources: [{layer: TxDOTRoadways, enabled: true}]
  },
});

// Adds the search widget below other elements in the top right corner of the view
view.ui.add(searchWidget, {
  position: "top-right",
  index: 2,
});

//adds zoom widget to map 
view.ui.add(ZoomWidget, {
  position: "top-right",
  index: 3
});

//adds home widget to map 
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

map.addMany([TxDOTRoadways, retsLayer, graphics, retsGraphicLayer, texasCounties, texasCities,  highlightLayer, txdotDistricts, retsHistory])

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
    removeOutline();
    outlineFeedCards(tempArray);
    const retsidnum = String(selectedFeature.attributes.OBJECTID).concat('-',selectedFeature.attributes.RETS_ID)
    document.getElementById(retsidnum).classList.add("highlight-card")
    return
  }

  


});



searchWidget.on("search-clear", function(event) {
  // Clear the highlight when the search is cleared
    highlightLayer.removeAll();
    scrollToTopOfFeed(0)
    removeOutline();


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
  home();
});


view.watch("scale", function(newValue) {
  if (newValue < 1000000 ) { 
    retsLayer.renderer = retsPointRenderer;
  } 
  else if(newValue > 1000000 && newValue < 2000000){
    retsLayer.renderer = retsPointRendererout2
  }
  else {
    retsLayer.renderer = retsPointRendererout;
  }
});

//remove attribution and zoom information
view.ui.remove("attribution")
// </></>
