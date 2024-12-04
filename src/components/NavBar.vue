<template>
    <v-alert v-if="feedbackAlert" width="250px" tile density="compact" color="success" style="margin: auto; left: 250px;">Thank you for your feeedback!</v-alert>
    <v-navigation-drawer permanent color="black" rail width="10">
        <v-list height="95%" id="icons-top" class="iconList">
            <v-list-item class="iconList-item"  id="popoutitems" v-for="(tool, i) in retsToolsTop" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" :active="store.toggleFeed === tool.value" :disabled="tool.disabled">    
                <v-tooltip location="right bottom" :text=tool.name >
                    <template v-slot:activator="{ props}">
                        <v-icon class="topIcon" size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'" ></v-icon>
                    </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>
        <v-list id="icons-bottom" class="iconList">
            <v-list-item id="popoutitems" class="iconList-item" v-for="(tool, i) in retsToolsBottom" :key="i" :value="tool" @mouseover="tool.hover(tool.title)" @click="tool.action()" :active="tool.isActive" :active-class="tool.name !== 'Jump To' || tool.name !== 'Basemaps' ? 'btn-left-brder' : ''" >
                <template v-if="tool.name !== 'Basemaps' && tool.name !== 'Jump To'">
                    <v-tooltip location="right" :text="tool.name">
                            <template v-if="tool.name !== 'Multi-Select'" v-slot:activator="{ props }">
                                    <v-icon class="topIcon" size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'" ></v-icon>
                            </template>
                            <template v-else  v-slot:activator="{ props }">           
                                <v-badge location="end" color="#4472C4" :content="store.roadHighlightObj.size" id="badge"> 
                                    <v-icon class="topIcon" size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>
                                </v-badge>
                            </template>
                    </v-tooltip>
                </template>
                <template v-else>
                        <v-icon class="topIcon" size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>
                </template>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
    <v-card id="basemaptoggle" max-width="400" hover @mouseleave="mouseleavebasemap" v-if = "basemapcard" >
       
        <v-card-item >
            <v-btn @click="toggledarkgrey" flat>
                <v-card-title id="basemapfont" > Dark Grey </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item>
            <v-btn @click="togglelightgrey" flat>
                <v-card-title id="basemapfont"> Light Grey </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="togglestandard" flat>
                <v-card-title id="basemapfont"> Standard TxDOT </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="toggleimagery" flat>
                <v-card-title id="basemapfont"> Imagery </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="togglehybrid" flat>
                <v-card-title id="basemapfont"> Hybrid </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="togglegoogle" flat>
                <v-card-title id="basemapfont"> Google </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item >
            <v-btn @click="toggleosm" flat>
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
   <v-card id = "containersettings" height = "585" v-if = "settingsstatus">
        <v-card-item>
            <span class="banner-txt">Settings</span>            
        </v-card-item>
        <hr id = "separator"/>
        <v-card-item id = "darkmodeitem" >
            <div id = "darkmodeswitch">
                <v-switch  v-model="switchValueDark" label="Dark Mode" color="primary" :style="{color: fontColor}" @change="newSwitchTurnedOn" disabled></v-switch>
            </div>
            

        </v-card-item>
       
        <hr id = "separator" />
            <v-btn @click ="activateFeedback()" color="#4472C4" rounded  style="position: absolute; right: 25px; top: 96px;">
                <span style="font-weight: 100;">Feedback</span>
            </v-btn>
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

        <!-- <v-btn-toggle density="compact" id="trigger-buttons"> -->
            <div style="width: 100%; position: relative; height: 100%;">
                <div style="width: 100%; position: relative;">
                    <v-btn variant="plain" size="small" class="secondary-button"  prepend-icon="mdi-power" @click="logoutMethod()" >LOGOUT</v-btn>
                    <v-btn style="float: right;" variant="outlined" size="small" class="main-button-style" @click=" handleactiveclass();">save</v-btn>
                    <v-btn style="float: right;" variant="plain" size="small" class="secondary-button"  @click="handleactiveclass();">CANCEL</v-btn>
                    
                    
                </div>


            </div>
            
            
        <!-- </v-btn-toggle> -->
            

        </v-card-item>

    </v-card>
    <v-card id="suggestionsSection" height="370px" width="350" style="border-radius: 0;" v-if="feedbackStatus">
        <v-card-title>Provide Feedback</v-card-title>
        <hr id = "separator" style="width: 320px !important; " />
        <v-card-text >
            We appreciate your feedback, let us know what you think.
        </v-card-text>
        <v-textarea v-model="feedbackText" class="feedbackTextbox" no-resize variant="outlined"  maxlength="1000" placeholder="Spill your guts...">
            <template #counter>
                <span >
                    {{ feedbackText.length }} / 1000
                </span>
            </template>
        </v-textarea>
        <!-- <v-combobox variant="underlined" clearable label="Name" v-model="feedbackName" :items=this.userNames :disabled="isAnonymous" style="width: 320px; margin: auto; left: 0; right: 0; margin-top: -20px !important;" ></v-combobox> -->
        <v-checkbox class="small-checkbox" label="I prefer to remain anonymous" v-model="isAnonymous" style="margin-left: -40px; margin-top: -20px;"></v-checkbox>
        <div style="margin-right: 10px;">
            <v-btn style="float: right;" variant="outlined" size="small" class="main-button-style" @click="submitFeedback" :disabled=feedbackSubmitStatus >SUBMIT</v-btn>
            <v-btn style="float: right;" variant="plain" size="small" class="secondary-button" @click="cancelFeedback" >CANCEL</v-btn>

        </div>
                    
                    


    </v-card>

 
    

</template>

<script>

    import { appConstants } from '../common/constant.js';
import { imageryBasemap, darkVTBasemap, map,lightVTBasemap, standardVTBasemap, googleVTBasemap, OSMVTBasemap, graphics, createretssym, view, legendWidget, sketchWidgetcreate, sketchWidgetselect, retsLabelclass, roadwaysRenderer, TxDOTRoadways, hybridBasemap} from '../components/map-Init.js';
    import { createtool, selecttool, togglemenu, logoutUser } from '../components/utility.js';
    import { vuetify } from '../main.js';
    import { store } from './store';
    import { defineAsyncComponent } from 'vue'

    export default{
        name: "NavBar",
        components:{
            RetsDetailPage: defineAsyncComponent(()=>import('./RetsDetail.vue')),
        },
        data(){
            return{
                toggle: store.toggleFeed,
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
                userNames: Array.from(appConstants.userRoles, user => user.name),
                isAnonymous: false,
                feedbackStatus: false,
                feedbackText: "",
                feedbackSubmitStatus: true,
                feedbackAlert: false,
                feedbackName: "",
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
                                value: 0,
                                action: () =>{
                                    document.getElementById("card-container").style.display = document.getElementById("card-container").style.display === "none" ? "flex" : "none",
                                    //this.resizemap();
                                    this.shiftDiv();
                                }, 
                                isActive: this.tester,
                                disabled: false
                               },
                               {
                                title: "Activity Pane",
                                icon: "mdi-map-marker-outline",
                                name: "Activity Feed",
                                value: 1,
                                action: ()=>{
                                    //open feed

                                    store.isCard = true
                                    store.isDetailsPage = false
                                    this.toggle = 1
                                    store.toggleFeed = 1
                                },
                                disabled: false
                               },
                               {
                                title: "Details Pane",
                                icon: "mdi-clipboard-text-outline",
                                color: "#D9D9D9",
                                name: "Details",
                                value: 2,
                                props:{},
                                action: ()=>{
                                    //open details pane
                                    store.isDetailsPage = true
                                    store.isCard = false
                                    this.toggle = 2
                                    store.toggleFeed = 2
                                },
                                disabled: true
                               }
                            ],
 
                retsToolsBottom: [
                               {title:"Select", icon: 'mdi-select-multiple', color: "#D9D9D9", name: "Multi-Select", isActive: false,
                               action: () =>{
                                store.isSelectEnabled = !store.isSelectEnabled
                                this.retsToolsBottom[0].isActive = !this.retsToolsBottom[0].isActive
                                this.handleSelectTool();
                               },
                               setActive: () => {
                                return true
                               },
                               hover:(i) => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                },
                               {title:"JumpTo", icon: 'mdi-run', color: "#D9D9D9", name: "Jump To", isActive: false,
                               action: () =>{
                                return
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
                               {title:"Legend", icon: 'mdi-format-list-bulleted-type', color: "white", name: "Legend", 
                               action: () =>{
                                this.handleLegendTool();
                                this.retsToolsBottom[2].isActive = !this.retsToolsBottom[2].isActive
                               },
                               hover:() => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
                                    }
                                },
                               {title:"Basemap", icon: 'mdi-map-legend', color: "#D9D9D9", name: "Basemaps", isActive: false,
                               action: () => {
                                return
                               },
                                hover:(i) => { 
                                    if (i === "Basemap")
                                        {
                                            this.jumptocard = false;
                                            this.basemapcard = true
                                        }
                                    }
                                },
                               {title:"Settings", icon: 'mdi-cog', color: "#D9D9D9", name: "Settings",
                               action: () =>{
                                this.handleSettingsTool();
                                this.retsToolsBottom[4].isActive = !this.retsToolsBottom[4].isActive
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
                   'store.toggleFeed':{
                        handler: function(){
                            this.retsToolsTop[store.toggleFeed].action()
                        },
                        immediate: true
                   },
                   'store.activityBanner':{
                    handler: function(){
                        if(store.activityBanner !== "Activity Feed" ){
                            this.retsToolsTop[2].disabled = false
                            return
                        }
                    
                        this.retsToolsTop[2].disabled = true
                        return
                    },
                    immediate: true
                   },
                   'feedbackText':{
                    handler: function(){
                        if (this.feedbackText.length){
                            this.feedbackSubmitStatus = false
                        }
                        else{
                            this.feedbackSubmitStatus = true
                        }
                    }
                   },
                   'isAnonymous':{
                    handler: function(){
                        if (this.isAnonymous){
                            this.feedbackName = ""
                        }
                    }
                   }
                },
                mounted() {
                    

                },
                
                methods: {
                    shiftDiv(){
                        const viewSurface = document.querySelector('.esri-view');
                        viewSurface.classList.toggle('translateX-500px');
                        const settingspopup = document.querySelector('#containersettings')
                        if(settingspopup){
                            settingspopup.classList.toggle('translatesettings')

                        }
                        

                    },
                    newSwitchTurnedOn() {
                        if (this.switchValue) {
                            this.fontColor = '#FFFFFF';
                            
                        } else {
                            this.fontColor = "#D9D9D9";
                        }
                    },
                    switchTurnedOn(index) {
      
                            if (this.switches[index].value) {
                                this.switches[index].fontColor = '#FFFFFF';
                            } 
                            else {
                                this.switches[index].fontColor = '#D9D9D9';
                            }
                        
                        },
                    switchStyle(fontColor) {
                        return { color: fontColor };
                    },
                    handleactiveclass(){
                        this.settingsstatus = false
                        this.retsToolsBottom[4].isActive = false
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
                        if (store.isSelectEnabled === true ){
                            this.selectfunction = selecttool(store.isSelectEnabled, sketchWidgetselect, graphics);
                        }
                        else{
                            sketchWidgetselect.cancel()
                            //this.selectfunction.remove()
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
                        TxDOTRoadways.labelsVisible = false
                        TxDOTRoadways.renderer.symbol.width = 0
                        this.basemapcard = false;

                    },
                    togglelightgrey(){
                        map.basemap = lightVTBasemap
                        lightVTBasemap.visible = true
                        this.basemapcard = false;
                        retsLabelclass.symbol.color = "black"                        
                        retsLabelclass.symbol.haloSize = 0
                        TxDOTRoadways.labelsVisible = false,
                        TxDOTRoadways.renderer.symbol.width = 0
                        this.basemapcard = false;


                    },
                    togglestandard(){
                        map.basemap = standardVTBasemap;
                        this.basemapcard = false;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloSize = 0
                        TxDOTRoadways.labelsVisible = false,
                        TxDOTRoadways.renderer.symbol.width = 0
                        this.basemapcard = false;

                    },  
                    toggleimagery(){
                        map.basemap = imageryBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloColor = "gray"
                        retsLabelclass.symbol.haloSize = 1
                        TxDOTRoadways.labelsVisible = false,
                        TxDOTRoadways.renderer.symbol.width = 0
                        this.basemapcard = false;
                    },
                    togglehybrid(){
                        map.basemap = hybridBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloColor = "gray"
                        retsLabelclass.symbol.haloSize = 1
                        TxDOTRoadways.labelsVisible = true,
                        TxDOTRoadways.renderer.symbol.width = 8
                        this.basemapcard = false;
                    },
                    togglegoogle(){
                        map.basemap = googleVTBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloSize = 0
                        TxDOTRoadways.labelsVisible = false,
                        TxDOTRoadways.renderer.symbol.width = 0
                        this.basemapcard = false;
                    },
                    toggleosm(){
                        map.basemap = OSMVTBasemap;
                        retsLabelclass.symbol.color = "black"
                        retsLabelclass.symbol.haloSize = 0
                        TxDOTRoadways.labelsVisible = false,
                        TxDOTRoadways.renderer.symbol.width = 0
                        this.basemapcard = false;
                    },

                    toggledarkmode(){
                        vuetify.theme.defaultTheme = 'light';

                    },
                    cancelFeedback(){
                        this.feedbackStatus = false
                        this.settingsstatus = true
                        this.feedbackText = ""
                        this.isAnonymous = false

                    },
                    activateFeedback(){
                        this.feedbackStatus = true
                        this.settingsstatus = false
                    },
                    submitFeedback(){
                        if (!this.isAnonymous){
                            console.log(this.feedbackText , "\n from: ", store.loggedInUser)
                        }
                        else{
                            console.log(this.feedbackText , "\n from: Anonymous ")
                        }
                        this.feedbackStatus = false
                        this.settingsstatus = true
                        this.feedbackAlert = true
                        this.feedbackText = ""
                        this.isAnonymous = false

                        setTimeout(() => {
                            this.feedbackAlert = false

                        }, 2500);
                    }

                    
                },
    }
</script>

<style>
     .btn-left-brder{
        border-left: 6px solid #4472C4 !important;
    }
    .btn-left-brder i {
        position: absolute;
        top: 35%;
        left: 29% !important;
        transform: translate(-25%, -25%);
    }

    .topIcon{
        position: absolute;
        top: 35%;
        left: 40%;
        transform: translate(-25%, -25%);
    }
    
    .v-list-item:hover{
        cursor: pointer;
        background-color: rgba(128,128,128,.3);
    }
    #popoutitems{
       bottom: 0px;
       margin: 0px !important;
       min-height: 39px !important;
    }
    #iconcontent  {
        position: absolute;
        width: 320px !important;
        top: 9px;
    }
    #iconcontent i {
        right: 5px;
    }
    #icons-bottom{
        position: relative;
        bottom: 170px;
        left: 12%;
    }
    #icons-top{
        bottom: 10px;
    }
    .v-navigation-drawer{
        overflow-y: hidden !important;
        height: 100% !important;
        width: 38px !important;
        color: black;
        border: 0;
    }

    .v-navigation-drawer__content{
        overflow-y: hidden !important;
    }

    .v-color-picker-swatches{
        overflow-y: hidden !important;
    }
    #basemaptoggle{
        position: absolute;
        width: 165px;
        height: 330px;
        bottom: 5%;
        left: 38px;
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
        left: 38px;
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
        width: 40px;
        left: 0px !important;
    }
    .iconList-item{
        position: relative;
        right: 5%;
        width: 39px;
        margin: 0px !important;
    }

    .esri-view {
        width: calc(100% - 484px) !important;
        transform: translate(484px);
        transition: transform 0.3s ease;
    }

    .translateX-500px {
        left: 0px !important;
        width: 100% !important;
        transform: translate(0px) 
    }
    .translatesettings{
        transform: translate(-200px) 
    }
    #badge {
        position: absolute;
        top: 15px;
        right: 25px;
        height: 100% !important;
    }

    #badge .v-badge__badge{
        position: absolute;
        top: -4px !important;
        left: 6px !important;
        margin-right: 14px;
        padding-right: 5px !important;
        padding-bottom: 4px !important;
    }

    #suggestionsSection{
        position:absolute;
        margin: auto;
        left: 500px;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .feedbackTextbox{
        margin:auto;
        left: 0;
        right:0;
        width: 320px;
        height: 150px;
    }
    .feedbackTextbox .v-field {
        border-radius: 0 ;
    }
    .small-checkbox {
        transform: scale(0.75); 
    }
    .small-checkbox .v-label {
        font-size: 15px !important; 
    }
    
    
</style>
