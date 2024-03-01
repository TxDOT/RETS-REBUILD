

<template style="overflow-y:hidden;">
    <v-navigation-drawer width="200" height="100" permanent color="black">
        <v-list height="100%" id="icons-top" >
            <v-list-item v-for="(tool, i) in retsToolsTop" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" :active="tool.isActive">  
                <v-tooltip :text=tool.name>
                    <template v-slot:activator="{ props}">
                        <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props"></v-icon>
                </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>
        <v-list id="icons-bottom">
            <v-list-item v-for="(tool, i) in retsToolsBottom" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" >
                <v-tooltip :text=tool.name>
                    <template v-slot:activator="{ props }">
                    <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props"></v-icon>
                </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
    
    <RetsCards/>

</template>

<script>
    import RetsCards from '../components/RetsFeedCards.vue';
    import Sketch from '@arcgis/core/widgets/Sketch';
    import { retsLayer, sketchWidget, view} from '../components/map-Init.js';
    import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
    import { imageryBasemap, darkVTBasemap, map, sketchLayer} from '../components/map-Init.js';
    import Legend from "@arcgis/core/widgets/Legend.js";
    import LegendViewModel from "@arcgis/core/widgets/Legend/LegendViewModel.js";
    import Editor from "@arcgis/core/widgets/Editor.js";


    export default{
        components: {RetsCards},
        name: "RetsFeed",
        data(){
            return{
                tester: false,
                retsToolsTop: [
                               {title:"Test", icon: 'mdi-menu', color: "white", name: "Menu", action: () =>{
                                    this.isActive = !this.tester
                                    document.getElementById("container").style.display = 
                                    document.getElementById("container").style.display === "none" ? "block" : "none"
                                }, isActive: this.tester,
                               },  
                            //    {title:"Test", icon: 'mdi-plus', color: "#4472C4", action: () =>{
                            //     this.handleCreatetTool();
                            //    }},
                            //    {title:"Test", icon: 'mdi-chart-pie', color: "white", action: () =>{
                            //     console.log("Hey3")
                            //    }, isActive: false},
                            //    {title:"Test", icon: 'mdi-currency-btc', color: "white", action: () =>{
                            //     console.log("Hey4")
                            //    }, isActive: false},
                            //    {title:"Test", icon: 'mdi-filter', color: "white", action: () =>{
                            //     console.log("Hey5")
                            //    }, isActive: false},
                            //    {title:"Test", icon: 'mdi-bell-outline', color: "white", action: () =>{
                            //     console.log("Hey6")
                            //    }, isActive: false}
                            ],
 

                retsToolsBottom: [
                               {title:"Test", icon: 'mdi-select-multiple', color: "white", name: "Select", action: () =>{
                                this.handleSelectTool();
                               }},
                               {title:"Test", icon: 'mdi-map-marker', color: "white", name: "Jump to", action: () =>{
                                this.handleToolClick({name: "Jump To"});
                               }},
                               {title:"Test", icon: 'mdi-format-list-bulleted-type', color: "white", name: "Legend", action: () =>{
                                this.handleLegendTool();
                               }},
                               {title:"Test", icon: 'mdi-map-legend', color: "white", name: "Basemaps", action: () =>{
                                this.handleBasemapTool();
                               }},
                               {title:"Test", icon: 'mdi-cog', color: "white", name: "Settings", action: () =>{
                                console.log("Hey11")
                               }}
                            ],
                            //legend: null,
                            isLegendVisibile: true,
                            //basemaptoggle: true,

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
                    //this.initEdit();
                    this.initSketchWidget();
                },
                
                methods: {

                    // ... your existing methods ...

                    handleToolClick(tool) {
                    switch (tool.name) {
                        case "Create":
                        this.handleCreatetTool();
                        break;
                        case "Select":
                        this.handleSelectTool();
                        break;
                        case "Jump to":
                        this.handleJumpToTool();
                        break;
                        case "Legend":
                        this.handleLegendTool();
                        break;
                        case "Basemap":
                        this.handleBasemapTool();
                        break;
                        // Add more cases for other tools
                        default:
                        break;
                    }
                    },

                    handleCreatetTool() {
                    // Add your Sketch widget functionality for the "Select" tool here
                    // if (this.sketchWidget) {
                    //     this.sketchWidget.create("point");
                    // } else {
                    //     this.initSketchWidget();
                    // }
                    // },

                   

                    

                    },

                    handleSelectTool() {

                        // //this.sketchWidget.creationMode = "update";
                        // // this.sketchWidget.create("rectangle");
                        // // console.log("mode: ", this.sketchWidget.creationMode)
                        // this.sketchWidget.on("create", function (event) {
                        //     if (event.state === "complete" && event.tool === "rectangle") {
                        //     // Handle the selected graphics (customize as needed)
                        //     handleSelectedGraphics(event.graphic);
                        //     }
                        // });

                        // function handleSelectedGraphics(graphic) {
                        //     // Handle the selected graphics, for example, print their geometry type
                        //     var geometryType = graphic.geometry ? graphic.geometry.type : "N/A";
                        //     console.log(geometryType)
                        // }

                        // Activate the "select by rectangle" tool

                        
                        this.sketchWidget.create("rectangle");
                        this.sketchWidget.creationMode = "update";

                        

                    },

                    

                    
                    

                    handleJumpToTool() {
                    // Add your functionality for the "Jump to" tool here
                    console.log("Jump to tool clicked");
                    },

                    handleLegendTool() {
                        //this.initLegend();
                        this.isLegendVisible = !this.isLegendVisible;
                        

                         if(this.legend){
                            this.legend.container.style.display = this.isLegendVisible ? "block" : "none";
                         }

                         this.legend.visible = true;

                         
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
                                            title: "",
                                            layer: retsLayer,
                                        
                                        }
                                    ]
                            }),
                            visible: false,
                        }),

                        view.ui.add(this.legend, {
                                position: "bottom-right"
                            })                         
                            
                    },

                    initEdit(){ 
                        const editor = new Editor({
                                view: view,
                                layerInfos: [{
                                    layer: retsLayer,
                                    enabled: true,
                                    addEnabled: true,
                                    attributeUpdatesEnabled: true
                                }],
                                visible: true
                                });

                                view.ui.add(editor, "top-right");
                    },


                    handleBasemapTool() {
                        // Add your functionality for the "Jump to" tool here
                            if ( map.basemap === darkVTBasemap){
                                map.basemap = imageryBasemap
                                return 
                            }
                            map.basemap = darkVTBasemap
                            return
                    },

                    // Add more methods for other tools as needed

                    initSketchWidget() {
                    // Initialize the Sketch widget
                    this.sketchWidget = new Sketch({
                        layer: sketchLayer, // Replace with your actual feature layer
                        view: view, // Replace with your actual map view
                        // Other configuration options for the Sketch widget
                        creationMode: "single"
                    });


                    // Add the Sketch widget to the UI
                    //view.ui.add(this.sketchWidget, "top-right");
                    },

                    initBasemapToggle() {
                         this.basemaptoggle = new BasemapToggle({
                             view: view,
                             nextBasemap: imageryBasemap,
                             activeBasemap: darkVTBasemap,

                         });

                        // this.basemap.watch("nextBasemap", (newValue) => {
                        //     console.log("Basemap toggled to:", newValue);
                        // });

                        // this.basemap.container = "basemapToggleContainer"; // Specify the container ID or element
                        // view.ui.add(this.basemap, "top-right");


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
        bottom: 14rem;
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
</style>