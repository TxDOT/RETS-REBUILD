//import ESRI JS ESM classes
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js"
import Basemap from "@arcgis/core/Basemap.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Home from "@arcgis/core/widgets/Home.js";
import Search from "@arcgis/core/widgets/Search.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";





        export let retsPointRenderer = {
          type: "simple",
          symbol: {
            type: "simple-marker",
            size: 8,
            outline: {
              color: "white",
              width: 0.
            }
          },
          visualVariables: [{
            type: "color",
            field: "STAT",
            stops: [
              {value: 1, color: "rgb(255, 102, 255)"},
              {value: 2, color: "rgb(52, 255, 52)"},
              {value: 3, color: "rgb(255, 128, 0)"},
            ]
          }]

         }

         export let roadwaysRenderer = {
          type: "simple",
          symbol: {
            type: "simple-line",
            width: 0,
            opacity: 0,
            color: [255,255,255,255]
          }
         }
        //Rets Layer construction
        export const retsLayer = new FeatureLayer({
          url: "https://testportal.txdot.gov/createags/rest/services/RETS_REF/FeatureServer/0",
          visible: true,
          outFields: ["*"],
          renderer: retsPointRenderer,
          editingEnabled: true,
          
        })


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
          },
          labelPlacement: "above-right",
          minScale: 20000,
        })

        //Applies label class to rets layer
        retsLayer.labelingInfo = [retsLabelclass];


        
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

        //Add Vector Tile as a basemap
        export const lightVTBasemap = new Basemap({
          baseLayers: lightVectorTile
        })

        //Imagery Layer construction
        export const imageryTxdot = new WMTSLayer({
          url: "https://txgi.tnris.org/login/path/food-paul-zebra-shirt/wmts/1.0.0/WMTSCapabilities.xml"
        })

        //Created imagery basemap
        export const imageryBasemap = new Basemap({
          baseLayers: imageryTxdot
        })


        //add  basemap to the map
        export const map = new Map({
          basemap: darkVTBasemap,
        })

        //add feature layers to the map
        map.add(retsLayer)
        map.add(TxDotRoaways)



        //add  map to the mapview, set zoom and center of screen when the application loads
        export const view = new MapView({
          map: map,
          zoom: 6,
          center: [-100, 31.5]
        })



        let sketch = new Sketch({
          layer: retsLayer,
          view: view,
          snappingOptions:{
            enabled: true,
            featureSources: [{layer: TxDotRoaways, enabled: true}]
          }
        });




        //create basemap toggle widget
        const basemaptoggle = new BasemapToggle({
          view: view,
          nextBasemap: imageryBasemap,
        })

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
        
          //creates search widget
         export const ZoomWidget = new Zoom({
          view: view
         });

         //creates home widget
        export const homeWidget = new Home({
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

        //adds the home widget to the top right corner of the MapView
        view.ui.add(homeWidget, "top-right");

        //adds the toggle widget to the bottom right corner of the MapView
        view.ui.add(basemaptoggle, "bottom-right")

        //adds the sketch widget to the bottom right corner of the MapView
        view.ui.add(sketch, "bottom-right")




      //remove attribution and zoom information
        view.ui.remove("attribution")
        // </></>