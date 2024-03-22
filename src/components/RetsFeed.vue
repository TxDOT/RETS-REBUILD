

<template style="overflow-y:hidden;">
<Map ref="MapRef"></Map>

    <v-navigation-drawer width="200" height="100" permanent color="black">
        <v-list height="100%" id="icons-top" >
            <v-list-item v-for="(tool, i) in retsToolsTop" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" :active="tool.isActive">  
                <v-tooltip location="bottom" :text=tool.name >
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
   <v-card id = "containersettings" height = "600" v-if = "settingsstatus">
        <v-card-item id= "settingsheader" >
            <v-card-title id="headerfont">Settings</v-card-title>            
        </v-card-item>
        <hr id = "separator"/>
        <v-card-item id = "darkmodeitem" >
            
            <v-card-title id="darkmodetogglefont" >
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>
                Dark Mode
            </v-card-title>
            
            
        </v-card-item>
        <hr id = "separator" />
        <v-card-item id = "notificationsitems" >
            <v-card-title id="notificationsfont">Notifications</v-card-title>
            <v-card-subtitle id = "notificationssub">
                Send notifications for: <br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;RETS I Create<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;RETS assigned to me<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;RETS I'm tagged in<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;High Priority RETS<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;RETS assigned to me that have been<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inactive for 30 days<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;New RETS assigned to me<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;Status changed to<br>
                <v-icon size = "30" icon="mdi-toggle-switch"></v-icon>&nbsp;&nbsp;&nbsp;&nbsp;My RETS are archived
            </v-card-subtitle>
            
        </v-card-item>
        <hr id = "separator" />
        <v-card-item id=" bottomitems">
            <v-btn prepend-icon="mdi-power"  >LOGOUT</v-btn>
            <v-btn text="CANCEL"></v-btn>
            <v-btn text="SAVE"></v-btn>

        </v-card-item>


        


    </v-card>

   

    
    <RetsCards :addrets = "addrets2"/>

    

</template>

<script>
    import RetsCards from '../components/RetsFeedCards.vue';
    import { imageryBasemap, darkVTBasemap, map,lightVTBasemap, standardVTBasemap, googleVTBasemap, OSMVTBasemap, graphics, createretssym, view, legendWidget, sketchWidgetcreate, sketchWidgetselect} from '../components/map-Init.js';
    import {addRETSPT} from '../components/crud.js'
    import { createtool, selecttool } from '../components/utility.js';
    import Map from './Map.vue';
    

    export default{
        components: {RetsCards, Map},
        name: "RetsFeed",
        props: {addrets: Number},
        data(){
            return{
                addrets2: null,
                basemapcard: false,
                jumptocard:false,
                tester: false,
                isLegendVisible: false,
                isSelectEnabled: true,
                clearSelection: false,
                isCreateEnabled: true,
                settingsstatus: false,
                shiftKey: false,
                retsToolsTop: [
                               {title:"Test", icon: 'mdi-menu', color: "white", name: "Menu", action: () =>{
                                
                                    this.isActive = !this.tester
                                    document.getElementById("container").style.display = 
                                    document.getElementById("container").style.display === "none" ? "block" : "none",
                                    this.resizemap()
                                }, isActive: this.tester,
                               },  
                            //    {title:"Test", icon: 'mdi-plus', color: "#4472C4", name: "Add RETS", action: async () =>{
                            //     const graphicAdd = await this.handleCreateTool();
                            //     if (graphicAdd) {
                            //         this.processAddPt(graphicAdd)
                            //         }
                            //    }},
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
                                //this.addrets2 = 2
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
                                this.handleSettingsTool();
                                
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
                created(){
                    window.addEventListener("keydown", this.handleKeyDown);
                    //window.addEventListener("keyup", this.handleKeyUp);
                },
                destroyed() {
                    // Remove event listeners when the component is destroyed to avoid memory leaks
                    window.removeEventListener("keydown", this.handleKeyDown);
                    //window.removeEventListener("keyup", this.handleKeyUp);
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
                    //  document.addEventListener("keydown", this.handleKeyDown);
                    //  document.addEventListener("keyup", this.handleKeyUp);
                    

                },
                
                methods: {
                    handleKeyDown(event) {
                        // if (event.key === "Shift") {
                        //     // Set shiftStatus to false when the Shift key is released
                        //     this.shiftKey = true;
                             console.log(event.key)
                        //     return
                            
                        // }
                        //return this.shiftKey
                        this.shiftKey = true;
                        //console.log(this.shiftKey);
                        return this.shiftKey

                    },
                    handleKeyUp(event) {
                        // if (event.key === "Shift") {
                        //     // Set shiftStatus to false when the Shift key is released
                        //     this.shiftKey = false;
                        //     console.log("noshift")

                            
                        // }
                        // //return this.shiftKey
                        // return
                        this.shiftKey = true;

                    },
                    resizemap(){
                        this.$refs.MapRef.togglemenu();
                    },
                    mouseleavebasemap(){
                        this.basemapcard = false;
                    },
                    mouseleavejumpto(){
                        this.jumptocard = false;
                    },
                    async processAddPt(newPointGraphic){
                        //handleaddrets(newPointGraphic);
                        try{
                            console.log(newPointGraphic)
                            const obj = await addRETSPT(newPointGraphic)
                            const objectid = obj.addFeatureResults[0].objectId
                            this.addrets2 = objectid
                            return
                        }
                        catch(err){
                            console.log(err)
                        }
                    },
                    async handleCreateTool() {
                        if (this.isCreateEnabled === true) {
                            this.isCreateEnabled = !this.isCreateEnabled;
                            const newPointGraphic = await createtool(sketchWidgetcreate, createretssym);
                            // Process the newPointGraphic as needed
                            this.isCreateEnabled = !this.isCreateEnabled;
                            return newPointGraphic
                            
                        } else {
                            sketchWidgetcreate.cancel();
                            this.isCreateEnabled = !this.isCreateEnabled;
                        }
                        
                        
                       
                    },
                    handleSelectTool() { 
                        //this.handleKeyDown(event);

                        //this.handleKeyUp(event);

                        if (this.isSelectEnabled === true ){
                            selecttool(this.isSelectEnabled, sketchWidgetselect, this.clearSelection, graphics, this.shiftKey);
                            this.isSelectEnabled =! this.isSelectEnabled
                        }
                        else{
                            sketchWidgetselect.cancel()
                            this.isSelectEnabled =! this.isSelectEnabled
                        }
                        
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
                        this.isLegendVisible =! this.isLegendVisible
                        if(this.isLegendVisible === true){
                            legendWidget.visible = true;
                        }
                        else{
                            legendWidget.visible = false;
                        }
                    
                     },

                     handleSettingsTool(){
                        this.settingsstatus = !this.settingsstatus;
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
                    },

                    toggledarkmode(){
                        
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
    #containersettings{
        position: absolute;
        width: 400px;
        bottom: 10rem;
        left: 50%;
        z-index: 9999;
    }
    #settingsheader{
        position: relative;
        left: 10px;
        font-size: 20px;
    }
    #headerfont{

        left: 10px;
        font-size: 18px;
        
        
    }
    #separator{
        border: 0;
        border-bottom: 1px solid ;
        margin: 0 auto;
        width: 23rem;
        
    }

    #darkmodeitem{
        position: relative;
        bottom: 2px;
        left: 25px;
        font-size: 20px;
    }

    #darkmodetogglefont{
        position: relative;
        font-size: 14px;
        left: 1rem;
        bottom: -2px;

        
    }
    #notificationsitems{
        position: relative;
        left: 10px;
        font-size: 20px;
        height: 25rem;
    }
    #notificationsfont{
        position: absolute;
        top: 5px;
        font-size: 18px;
    }
    #notificationssub{
        position: absolute;
        font-size: 14px;
        top: 40px;
        left: 40px;
    }
    #viewDiv{
        top: 0px;
        bottom: 0px;
        left: 0px;
        width: 100%;
        }


      
</style>