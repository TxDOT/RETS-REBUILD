

<template style="overflow-y:hidden;">
    <v-navigation-drawer width="200" height="100" permanent color="black">
        <v-list height="100%" id="icons-top" >
            <v-list-item v-for="(tool, i) in retsToolsTop" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" :active="tool.isActive">  
                <v-tooltip :text=tool.name >
                    <template v-slot:activator="{ props}">
                        <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props"></v-icon>
                </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>
        <v-list id="icons-bottom">
            <v-list-item v-for="(tool, i) in retsToolsBottom" :key="i" :value="tool" @mouseover="tool.hover(tool.title)" @click="tool.action()" active-class="btn-left-brder" >
                <v-tooltip location="bottom" :text=tool.name >
                    <template v-slot:activator="{ props }">
                    <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props"></v-icon>
                </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
    <v-card id="basemaptoggle" max-width="400" hover @mouseleave="mouseleavebasemap" v-if = "basemapcard" >
       
        <v-card-item >
            <v-btn @click="toggledarkgrey">
                <v-card-title id="basemapfont" > Dark Grey </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item>
            <v-btn @click="togglelightgrey">
                <v-card-title id="basemapfont"> Light Grey </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="togglestandard">
                <v-card-title id="basemapfont"> Standard TxDOT </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="toggleimagery">
                <v-card-title id="basemapfont"> Imagery </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="togglegoogle">
                <v-card-title id="basemapfont"> Google </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="toggleosm">
                <v-card-title id="basemapfont"> OSM </v-card-title>
            </v-btn>
        </v-card-item>



    </v-card>
    <v-card id="jumptotoggle" max-width="400" hover @mouseleave="mouseleavejumpto" v-if = "jumptocard" >
       
       <v-card-item >
           <v-btn @click="handleJumpToToolGoogle()">
               <v-card-title id="jumptofont" > Jump to Google </v-card-title>
           </v-btn>
       </v-card-item>
       <v-card-item>
           <v-btn @click="handleJumpToToolSPM()">
               <v-card-title id="jumptofont"> Jump to SPM </v-card-title>
           </v-btn>
       </v-card-item>

   </v-card>
    
    <RetsCards :addrets = "addrets2"/>

</template>

<script>
    import RetsCards from '../components/RetsFeedCards.vue';
    import Sketch from '@arcgis/core/widgets/Sketch';
    import Legend from "@arcgis/core/widgets/Legend.js";
    import LegendViewModel from "@arcgis/core/widgets/Legend/LegendViewModel.js";
    import Graphic from "@arcgis/core/Graphic.js";
    import { imageryBasemap, darkVTBasemap, map,lightVTBasemap, standardVTBasemap, googleVTBasemap, OSMVTBasemap, graphics, createretssym, TxDotRoaways, retsLayer, view, retsGraphicLayer} from '../components/map-Init.js';
    import {highlightRETSPoint, removeHighlight} from '../components/utility.js'
    import {addRETSPT} from '../components/crud.js'
    

    export default{
        components: {RetsCards},
        name: "RetsFeed",
        data(){
            return{
                addrets2: null,
                basemapcard: false,
                jumptocard:false,
                tester: false,
                isLegendVisible: true,
                isSelectEnabled: true,
                clearSelection: false,
                retsToolsTop: [
                               {title:"Test", icon: 'mdi-menu', color: "white", name: "Menu", action: () =>{
                                    this.isActive = !this.tester
                                    document.getElementById("container").style.display = 
                                    document.getElementById("container").style.display === "none" ? "block" : "none"
                                }, isActive: this.tester,
                               },  
                               {title:"Test", icon: 'mdi-plus', color: "#4472C4", action: async () =>{
                                const graphicAdd = await this.handleCreateTool();
                                this.processAddPt(graphicAdd)
                               }},
                            ],
 
                retsToolsBottom: [
                               {title:"Select", icon: 'mdi-select-multiple', color: "white", name: "Select", action: () =>{
                                this.handleSelectTool();
                               },
                               hover:(i) => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                },
                               {title:"JumpTo", icon: 'mdi-map-marker', color: "white", name: "Jump To", action: () =>{
                                console.log("click")
                               },
                               hover:(i) => 
                                    { 
                                        if (i === "JumpTo")
                                            {
                                                this.basemapcard = false;
                                                this.jumptocard = true
                                            }
                                    }
                                },
                               {title:"Legend", icon: 'mdi-format-list-bulleted-type', color: "white", name: "Legend", action: () =>{
                                this.handleLegendTool();
                                this.addrets2 = 2
                               },
                               hover:(i) => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                },
                               {title:"Basemap", icon: 'mdi-map-legend', color: "white", name: "Basemaps", action: () => {
                                console.log("click")
                               },
                                hover:(i) => { 
                                    if (i === "Basemap")
                                        {
                                            this.jumptocard = false;
                                            this.basemapcard = true
                                        }
                                    }
                                },
                               {title:"Test", icon: 'mdi-cog', color: "white", name: "Settings", action: () =>{
                                console.log("Hey11")
                               },
                               hover:(i) => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                }
                            ],
                            

            }
        },
                computed:{
                    test:{
                        get(){
                            return this.tester
                        },
                        set(value){
                            this.tester = value
                        }
                    }
                },
                mounted() {
                    this.initLegend();
                    this.initSketchWidget();
                },
                
                methods: {
                    mouseleavebasemap(){
                        this.basemapcard = false;
                    },
                    mouseleavejumpto(){
                        this.jumptocard = false;
                    },
                    async processAddPt(newPointGraphic){
                        try{
                            console.log(newPointGraphic)
                            const objectid = await addRETSPT(newPointGraphic)
                            const obj = objectid.addFeatureResults[0].objectId
                            this.addrets2 = obj
                            return
                        }
                        catch(err){
                            console.log(err)
                        }
                    },
                    async handleCreateTool() {
                        let newPromise = new Promise((res, rej) =>{
                            this.sketchWidgetcreate
                            this.sketchWidgetcreate.create("point")
                            this.sketchWidgetcreate.on("create", (event) =>{
                                if(event.state === "complete") {
                                    // Get the point geometry from the sketch
                                    const pointGeometry = event.graphic.geometry;

                                    // Create a new graphic with the point geometry
                                    const newPointGraphic = new Graphic({
                                        geometry: pointGeometry,
                                        spatialReference: {
                                            wkid: 3857
                                        }
                                    });

                                    event.graphic.symbol = createretssym;
                                    res(newPointGraphic)
                                }
                            })
                        })

                        return await newPromise
                    },

                    handleSelectTool() { 
                        if(this.isSelectEnabled === true){ 
                            var state = this.clearSelection
                            this.sketchWidgetselect.create("rectangle");
                            state = !state
                            this.sketchWidgetselect
                            .on("create", function (event) 
                                {
                                // Check if the geometry is a polygon (rectangle)
                                if (event.state === "complete")
                                    {

                                        // Get the rectangle geometry
                                        var rectangleGeometry = event.graphic.geometry;
                                        // Query for points within the rectangle
                                        var query = retsLayer.createQuery();
                                        query.geometry = rectangleGeometry;
                                        retsLayer.queryFeatures(query)
                                        .then(function (result) 
                                                {
                                                    // Access the selected features
                                                    var selectedFeatures = result.features;
                                                    
                                                    if (state === true){
                                                        for (let i = 0; i < selectedFeatures.length; i++ ) {
                                                          removeHighlight(selectedFeatures[i].attributes,state);  
                                                          
                                                        }
                                                        
                                                    }

                                                    for (let i = 0; i < selectedFeatures.length; i++ ) {
                                                          highlightRETSPoint(selectedFeatures[i].attributes);
                                                          

                
                                                    }     
                                                    graphics.removeAll()
   
                                                });

                                                
                                                return
                                    }

                            });

                            this.isSelectEnabled = !this.isSelectEnabled; 
                        }
                        else{
                            this.isSelectEnabled = !this.isSelectEnabled;
                            this.sketchWidgetselect.cancel()
                            this.clearSelection = !this.clearSelection
                                
                        }
                        

                        return
                    },

                    handleJumpToToolGoogle() {
                        var ctr = view.center;                
                        var lat = ctr.latitude;                
                        var lon = ctr.longitude;     
                        var level = view.zoom ;
                        window.open("https://www.google.com/maps/@"+lat+","+lon+","+level+"z");
                        this.jumptocard = false;

                    },
                    handleJumpToToolSPM() {
                        var ctr = view.center;                
                        var lat = ctr.latitude;                
                        var lon = ctr.longitude;                
                        var level = view.zoom -1 ;                
                        window.open("https://www.txdot.gov/apps/statewide_mapping/StatewidePlanningMap.html?coords="+lat+","+lon+","+level);
                        this.jumptocard = false;
                    },

                    handleLegendTool() {

                        this.legend.container.style.display = this.isLegendVisible ? "block" : "none";
                        this.isLegendVisible = !this.isLegendVisible;
                         
                        return
                    
                     },

                    initLegend()
                    { 
                       
                        this.legend = new Legend
                        ({
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
                        }),

                        view.ui.add(this.legend, {
                                position: "bottom-right"
                            })                         
                            
                    },

                    initSketchWidget() {


                    this.sketchWidgetselect = new Sketch({
                        layer: graphics, // Replace with your actual feature layer
                        view: view,
                        creationMode: "continuous", // Replace with your actual map view
                        defaultUpdateOptions: {
                            tool: "transform"
                        }

                    });

                    this.sketchWidgetcreate = new Sketch({
                        layer: graphics, // Replace with your actual feature layer
                        view: view,
                        creationMode: "single", // Replace with your actual map view
                        snappingOptions: {
                            enabled: true,
                            featureSources: [{layer: TxDotRoaways, enabled: true}]
                        },
            

                    });
                    
                    },
                    toggledarkgrey(){
                        map.basemap = darkVTBasemap;
                        this.basemapcard = false;
                    },
                    togglelightgrey(){
                        map.basemap = lightVTBasemap
                        this.basemapcard = false;
                    },
                    togglestandard(){
                        map.basemap = standardVTBasemap;
                        this.basemapcard = false;
                    },  
                    toggleimagery(){
                        map.basemap = imageryBasemap;
                        this.basemapcard = false;
                    },
                    togglegoogle(){
                        map.basemap = googleVTBasemap;
                        this.basemapcard = false;
                    },
                    toggleosm(){
                        map.basemap = OSMVTBasemap;
                        this.basemapcard = false;
                    }
                },
    }
</script>

<style>
    .v-list-item:hover{
        cursor: pointer;
        background-color: rgba(128,128,128,.3);

    }

    #icons-bottom{
        position: relative;
        bottom: 15.5rem;
    }

    .v-navigation-drawer{
        overflow-y: hidden !important;
        height: 100% !important;
        width: 74px !important;
        color: black;
    }

    .v-navigation-drawer__content{
        overflow-y: hidden !important;
    }

    template{
        overflow-y: hidden;
    }

    .btn-left-brder{
        border-left: 5px solid #4472C4 !important;
    }
    .nav-bar-btn{
        height: 2rem;
        width: 100%;
    }
    .v-color-picker-swatches{
        overflow-y: hidden !important;
    }
    #basemaptoggle{
        position: absolute;
        width: 165px;
        height: 330px;
        bottom: 5%;
        left: 75px;
        z-index: 9999;
    }
    #basemapfont{
        font-size: 13px;
    }
    #jumptotoggle{
        position: absolute;
        width: 165px;
        height: 120px;
        bottom: 15.5%;
        left: 75px;
        z-index: 9999;

    }
    #jumptofont{
        font-size: 13px;
    }
    .esri-legend--card__service-caption-container{
        display: none;
    }
    .esri-legend--card__service-content{
        height: 45px;
        
    }

      
</style>