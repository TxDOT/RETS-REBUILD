//import ESRI JS ESM classes
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js"
import Basemap from "@arcgis/core/Basemap.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Home from "@arcgis/core/widgets/Home.js";
import Search from "@arcgis/core/widgets/Search.js";
    
        //Rets Layer construction
        export const retsLayer = new FeatureLayer({url: "https://testportal.txdot.gov/createags/rest/services/RETS_REF/FeatureServer/0",//"https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadway_Edits_Tracking/FeatureServer/0",
        visible: true,
        outFields: ["*"],
        //definitionExpression: `GIS_ANLST = 'Sam Bogle' and STAT = 'Not Started'`,
        popupEnabled: true,
        portalItem:{url: "f37dfee631244e80b12c4c6271066317"
        }

        })

        //Dark Vector Tile construction
        export const darkVectorTile = new VectorTileLayer({url: "https://www.arcgis.com/sharing/rest/content/items/4bd376c56f314bc5a36446630db604a6/resources/styles/root.json"
        })

        //Add Vector Tile as a basemap
        export const darkVTBasemap = new Basemap({baseLayers: darkVectorTile
        })

        //add  basemap to the map
        export const map = new Map({basemap: darkVTBasemap,
        })

        //add  map to the mapview, set zoom and center of screen when the application loads
        export const view = new MapView({map: map,
        zoom: 6,
        center: [-100, 31.5]
        //highlightOptions: {color} ,"orange"
        })

        //export const searchWidget = new Search({
         //   view: view
          //});
          // Adds the search widget below other elements in
          // the top left corner of the view
         // view.ui.add(searchWidget, {
           // position: "top-left",
           // index: 2
         // });

        //let view = new MapView({
           // container: "viewDiv",
           // map: map
        //});

        let zoom = new Zoom({
            view: view
        });

        let homeWidget = new Home({
            view: view,
            viewpoint: new Viewpoint()
        });

        // adds the home widget to the top right corner of the MapView
        view.ui.add(homeWidget, "top-right");
        map.add(retsLayer);
// Layer.fromPortalItem({
            //     portalItem: {
            //       // autocasts as new PortalItem()
            //       id: "f37dfee631244e80b12c4c6271066317",
            //       portal:{
            //         url: "https://testportal.txdot.gov/create"
            //       }
            //     },
            //   }).then(lyr => map.add(lyr))
            //add feature layers to the map
            //map.add(retsLayer)
            //remove attribution and zoom information
      //  }

//remove attribution and zoom information
        //view.ui.remove("attribution");</></>