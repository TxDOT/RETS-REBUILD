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
              label: "In Progress"
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
            {
              value: "5",
              symbol: new SimpleMarkerSymbol({
                size: 8,
                color: appConstants.CardColorMap[5],
                outline: {
                  color: "white",
                  width: 0
                }
              }),
              label: "Not Ready"
            },
          ]
         });

         export const createretssym = new SimpleMarkerSymbol({
          size: 8,
                color: appConstants.CardColorMap[1],
                outline: {
                  color: "white",
                  width: 0
                },
         })

        
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

        export const graphics = new GraphicsLayer({
          
                            
        });


        //TxDotRoaways Layer construction
        export const TxDotRoaways = new FeatureLayer ({
          url: "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Roadways/FeatureServer/0",
          visible: true,
          renderer: roadwaysRenderer,

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
        
  


        
        ////////////////////////////////////////////BASEMAPS AND LAYERS//////////////////////////////////////////////////////////////////////////
        
        //Dark Vector Tile construction
        export const darkVectorTile = new VectorTileLayer({
          url: "https://www.arcgis.com/sharing/rest/content/items/4bd376c56f314bc5a36446630db604a6/resources/styles/root.json"
        })
        //Dark Vector Tile basemap construction
        export const darkVTBasemap = new Basemap({
          baseLayers: darkVectorTile
        })
       
        //Light Vector Tile construction
        export const lightVectorTile = new VectorTileLayer({
          url: "https://www.arcgis.com/sharing/rest/content/items/507a9905e7154ce484617c7327ee8bc4/resources/styles/root.json",
          labelsVisible: true,
        })
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

        //Imagery Layer construction
        export const imageryTxdot = new WMTSLayer({
          url: "https://txgi.tnris.org/login/path/bucket-armada-virtual-lobby/wmts/1.0.0/WMTSCapabilities.xml",
          view: view,
        })

        //Imagery Layer basemap construction
        export const imageryBasemap = new Basemap({
          baseLayers: [imageryTxdot]
        })

        //Google Web Tile construction
        export const googleVectorTile = new WebTileLayer({
          urlTemplate: 
          "https://mt1.google.com/vt/lyrs=r&x={col}&y={row}&z={level}",
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

        //add  Dark Tile basemap to the map as default
        export const map = new Map({
          basemap: darkVTBasemap,
        })

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //add  map to the mapview
        export var view = new MapView({
          map: map,
          zoom: 6,
          constraints: {
               lods: TileInfo.create().lods //property to allow a mapview center to the imagery basemap
             }
        })

        //add feature layers to the map
        map.add(retsLayer)
        map.add(TxDotRoaways)
        map.add(graphics)


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

         

        // Adds the search widget to the top right corner of the view
         view.ui.add(searchWidget, {
           position: "top-right",
           index: 2
         });

         // Adds the zoom widget to the top right corner of the view
         view.ui.add(ZoomWidget, {
          position: "top-right",
          index: 3

        });

        // Adds the search widget to the top right corner of the view
        view.ui.add(homeWidget, {
          position: "top-right",
          index: 3

        });

      //remove attribution and zoom information
        view.ui.remove("attribution")
        // </></>