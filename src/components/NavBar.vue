<template style="overflow-y:hidden;">
    <v-navigation-drawer width="200" height="100" permanent color="black">
        <v-list height="100%" id="icons-top" class="iconList">
            <v-list-item class="iconList-item"  id="popoutitems" v-for="(tool, i) in retsToolsTop" :key="i" :value="tool" @click="tool.action()" >    
                <v-tooltip location="right bottom" :text=tool.name >
                    <template v-slot:activator="{ props}">
                        <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>
                    </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>
        <v-list id="icons-bottom" class="iconList">
            <v-list-item id="popoutitems" class="iconList-item" v-for="(tool, i) in retsToolsBottom" :key="i" :value="tool" @mouseover="tool.hover(tool.title)" @click="tool.action()" :active-class="tool.name !== 'Jump To' && tool.name !== 'Basemaps' ? 'btn-left-brder' : ''" >
                <template v-if="tool.name != 'Basemaps' && tool.name != 'Jump To'">
                    <v-tooltip location="right" :text="tool.name">
                            <template v-slot:activator="{ props }">
                                <div id="iconcontent">
                                    <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>
                                </div>
                            </template>
                        
                    </v-tooltip>
                </template>
                <template v-else>
                        <v-icon size="30" :icon="tool.icon" :color="tool.color" :name="tool.name" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>
                </template>
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
            <div id = "darkmodeswitch">
                <v-switch  v-model="switchValueDark" label="Dark Mode" color="primary" :style="{color: fontColor}" @change="newSwitchTurnedOn" disabled></v-switch>
            </div>
             
        </v-card-item>
            <hr id = "separator" />
        <v-card-item id = "notificationsitems" >
            <v-card-title id="notificationsfont">Notifications</v-card-title>
            <v-card-subtitle id = "notificationssub">
            <div id="notis">
                Send notifications for: <br>
                <div id="notiswitches">
                    <v-card-item v-for="(item, index) in switches" :key="index" :id="'switch-container-' + index" class="switch-item">
                        <v-switch  v-model="item.value" :label="item.label" color="primary" :style="switchStyle(item.fontColor)" @change="switchTurnedOn(index)" disabled></v-switch>
                    </v-card-item>
                </div>
                
            </div>
            </v-card-subtitle>
            
        </v-card-item>
            <hr id = "separator" />
        <v-card-item id="bottomitems">
            <v-btn-group density="compact">
                <v-btn size="small" class="secondary-button"  prepend-icon="mdi-power" @click="logoutMethod()" >LOGOUT</v-btn>
            </v-btn-group>
            <v-btn-group id = "savebutton" density="compact">
                <v-btn size="small" class="secondary-button"  @click="handleSettingsTool();handleactiveclass()">CANCEL</v-btn>
               
                <v-btn size="small" class="main-button-style" @click="handleSettingsTool();handleactiveclass()">SAVE</v-btn>
            
                
            </v-btn-group>
            

        </v-card-item>

    </v-card>

 
    

</template>

<script>

    import { imageryBasemap, darkVTBasemap, map,lightVTBasemap, standardVTBasemap, googleVTBasemap, OSMVTBasemap, graphics, createretssym, view, legendWidget, sketchWidgetcreate, sketchWidgetselect, retsLabelclass, roadwaysRenderer} from '../components/map-Init.js';
    import { createtool, selecttool, togglemenu, logoutUser } from '../components/utility.js';
    import { vuetify } from '../main.js';
    import { store } from './store';

    export default{
        name: "NavBar",
        data(){
            return{
                selectfunction : {},
                store,
                shiftmap: false,
                fontColor: '#D9D9D9',
                switchValueDark: true,
                switchValue : false,
                isActOpen: true,
                shift: 200,
                basemapcard: false,
                jumptocard:false,
                tester: false,
                isLegendVisible: false,
                clearSelection: false,
                isCreateEnabled: true,
                settingsstatus: false,
                shiftKey: false,
                switches: [
                            { label: "RETS I Create", value: false, fontColor: "#D9D9D9" },
                            { label: "RETS I'm tagged in", value: false, fontColor: "#D9D9D9" },
                            { label: "High Priority RETS", value: false, fontColor: "#D9D9D9" },
                            { label: "RETS assigned to me that have been inactive for 30 days", value: false, fontColor: "#D9D9D9" },
                            { label: "New RETS assigned to me", value: false, fontColor: "#D9D9D9" },
                            { label: "Status changed to", value: false, fontColor: "#D9D9D9" },
                            { label: "My RETS are archived", value: false, fontColor: "#D9D9D9" },
                            // Add more switches as needed
                        ],
                darkmodeswitch: [
                            { label: "Dark Mode", value: false, fontColor: "#D9D9D9" },
                ],
                retsToolsTop: [
                               {
                                title:"Toggle",
                                icon: 'mdi-menu', 
                                color: "#D9D9D9", 
                                name: "Menu", 
                                action: () =>{
                                    document.getElementById("card-container").style.display = document.getElementById("card-container").style.display === "none" ? "flex" : "none",
                                    //this.resizemap();
                                    this.shiftDiv();
                                }, 
                                isActive: this.tester,
                               },  
                            ],
 
                retsToolsBottom: [
                               {title:"Select", icon: 'mdi-select-multiple', color: "#D9D9D9", name: "Multi-Select", action: () =>{
                                this.handleSelectTool();
                               },
                               hover:(i) => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                },
                               {title:"JumpTo", icon: 'mdi-run', color: "#D9D9D9", name: "Jump To", action: () =>{
    
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

                               },
                               hover:(i) => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                },
                               {title:"Basemap", icon: 'mdi-map-legend', color: "#D9D9D9", name: "Basemaps", action: () => {
                            
                               },
                                hover:(i) => { 
                                    if (i === "Basemap")
                                        {
                                            this.jumptocard = false;
                                            this.basemapcard = true
                                        }
                                    }
                                },
                               {title:"Test", icon: 'mdi-cog', color: "#D9D9D9", name: "Settings", action: () =>{
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
        
                computed:{

                },
                watch: {
                   
                },
                mounted() {
                
                    

                },
                
                methods: {
                    shiftDiv(){
                        // console.log(this.isActOpen)
                        // this.shiftmap = this.isActOpen
                        //const elements = document.getElementsByClassName('esri-view-root');
                        


                        //elements[0].classList.toggle('esri-view-surface');
                        const viewSurface = document.querySelector('.esri-view');
                        viewSurface.classList.toggle('translateX-500px');
                        const settingspopup = document.querySelector('#containersettings')
                        if(settingspopup){
                            settingspopup.classList.toggle('translatesettings')

                        }
                        

                    },
                    newSwitchTurnedOn() {
                        if (this.switchValue) {
                            // New switch is turned on, do something
                            this.fontColor = '#FFFFFF';
                            
                        } else {
                            // New switch is turned off, do something else
                            this.fontColor = "#D9D9D9";
                        }
                    },
                    switchTurnedOn(index) {
      
                            if (this.switches[index].value) {
                                // Switch is turned on, change font color to green
                                this.switches[index].fontColor = '#FFFFFF';
                            } 
                            else {
                                // Switch is turned off, change font color to red
                                this.switches[index].fontColor = '#D9D9D9';
                            }
                        
                        },
                    switchStyle(fontColor) {
                        return { color: fontColor };
                    },
                    handleactiveclass(){
                        if (this.settingsstatus = true){
                            
                            const classList = document.querySelectorAll('.btn-left-brder');
                            classList.forEach(element => {
                            element.classList.toggle('btn-left-brder'); // Remove each element individually
                            });

                        const classList2 = document.querySelectorAll('.v-list-item__overlay');
                            classList2.forEach(element => {
                            element.classList.remove('v-list-item__overlay'); // Remove each element individually
                            });

                            this.settingsstatus = false
                        }
                       
                        //this.settingsstatus != this.settingsstatus
                        
                       

                    },
                    logoutMethod(){
                        logoutUser();
                        location.reload()
                    },
                    resizemap(){
                        togglemenu(this.isActOpen, this.shift);
                        this.isActOpen =! this.isActOpen
                    },
                    mouseleavebasemap(){
                        this.basemapcard = false;
                    },
                    mouseleavejumpto(){
                        this.jumptocard = false;
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
                        if (store.isSelectEnabled === false ){
                            store.isSelectEnabled = !store.isSelectEnabled
                            this.selectfunction = selecttool(store.isSelectEnabled, sketchWidgetselect, graphics);
                        }
                        else{
                            sketchWidgetselect.cancel()
                            this.selectfunction.remove()
                            store.isSelectEnabled = !store.isSelectEnabled
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
                        retsLabelclass.symbol.color = "white"
                        retsLabelclass.symbol.haloSize = 0
                    },
                    togglelightgrey(){
                        map.basemap = lightVTBasemap
                        lightVTBasemap.visible = true
                        this.basemapcard = false;
                        retsLabelclass.symbol.color = "black"                        
                        retsLabelclass.symbol.haloSize = 0

                    },
                    togglestandard(){
                        map.basemap = standardVTBasemap;
                        this.basemapcard = false;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloSize = 0

                    },  
                    toggleimagery(){
                        map.basemap = imageryBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloColor = "gray"
                        retsLabelclass.symbol.haloSize = 1
                        this.basemapcard = false;
                    },
                    togglegoogle(){
                        map.basemap = googleVTBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloSize = 0
                        this.basemapcard = false;
                    },
                    toggleosm(){
                        map.basemap = OSMVTBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloSize = 0
                        this.basemapcard = false;
                    },

                    toggledarkmode(){
                        vuetify.theme.defaultTheme = 'light';

                    }

                    
                },
    }
</script>

<style>
    .v-list-item:hover{
        cursor: pointer;
        background-color: rgba(128,128,128,.3);
    }

    #popoutitems .v-list-item__overlay {
        color: transparent;
    }
   #iconcontent  {
    position: absolute;
    width: 30px !important;
    top: 9px;
    left: 29%;
   }
    #icons-bottom{
        position: relative;
        bottom: 15.5rem;
        left: 10%;
    }
    #icons-top{
        left: 10%;
        top: -7px;
    }
    .v-navigation-drawer{
        overflow-y: hidden !important;
        height: 100% !important;
        width: 58px !important;
        color: black;
        border: 0;
    }

    .v-navigation-drawer__content{
        overflow-y: hidden !important;
    }

    template{
        overflow-y: hidden;
    }

    .btn-left-brder .v-list-item__overlay{
        opacity: 1 !important;
        position: absolute;
        /* border-left: 10px solid #4472C4 !important; */
        width: 10px !important;
        color:   #4472C4 !important;
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
        left: 51px;
        z-index: 9999;
        border-radius: 0px;

    }
    #basemapfont{
        font-size: 13px;
    }
    #jumptotoggle{
        position: absolute;
        width: 165px;
        height: 120px;
        bottom: 15.5%;
        left: 51px;
        z-index: 9999;
        border-radius: 0px;

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
        margin:auto;
        top: 0;
        bottom: 0;
        left: 0;;
        right: 0;
        width: 400px;
        left: 509px; 
        z-index: 9999;
        border-radius: 0px;
        

    }
    #settingsheader{
        position: relative;
        left: 10px;
        font-size: 20px;
    }
    #headerfont{

        left: 10px;
        /* font-size: 18px; */
        
        
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
        height: 4rem;
        
    }
    .font-class{
        color: aqua !important;
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
        left: 18px;
        height: 500px;
    }
    #viewDiv{
        top: 0px;
        bottom: 0px;
        left: 0px;
        width: 100%;
    }
    #darkmodeswitch{
        margin-left: 1px; 
        margin-bottom: -55px;
        margin-top: 0px;
        left: 5px;;
    }    
    .switch-item{
        /* position: absolute; */
        margin-left: 1px; 
        margin-bottom: -55px;
        margin-top: 0px;
        /* flex: 1 1 auto; */

    }
    #notis{
        /* display: block; */
        /* flex-wrap: wrap; */
        position: relative;
        width: 400px;

    }
    #notiswitches{
        position: relative;
        left: -15px;
    }
    #bottomitems{
        position: absolute;
        bottom: 10px;
        width: 25rem;
        
    }
    #logoutbutton{
        position: absolute;
        text-align: start;
    }
    #savebutton{
        position: absolute;
        right: 6px;
    }
    #darkmodeswitch{
        position: absolute;
        bottom: 2.3rem;
    }
    #save{
        border: 1px solid ;
        border-radius: 9%;
        
    }
    .iconList{
        position: relative;
        width: 58px ;
        left:0px !important;
    }
    .iconList-item{
        position: relative;
        left: -5%;
    }

    .esri-view {
        width: calc(100% - 555px) !important;
        transform: translate(555px);
        transition: transform 0.1s ease;
        left: 0px;
    }

    .translateX-500px {
        left: 0px !important;
        width: 100% !important;
        transform: translate(0px) 
    }
    .translatesettings{
        transform: translate(-200px) 
    }


 


      
</style>
