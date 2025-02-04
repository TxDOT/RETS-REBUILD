<template>
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
       
        <v-card-item  style="height: 50px;">
            <v-btn @click="toggledarkgrey(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont" > Dark Grey </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item style="height: 45px;">
            <v-btn @click="togglelightgrey(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont"> Light Grey </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item style="height: 45px;">
            <v-btn @click="togglestandard(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont"> Standard TxDOT </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item style="height: 45px;">
            <v-btn @click="toggleosm(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont"> OSM </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item style="height: 45px;">
            <v-btn @click="togglegoogle(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont"> Google </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item style="height: 45px;">
            <v-btn @click="togglehybrid(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont"> Hybrid </v-card-title>
            </v-btn>
        </v-card-item>
        <v-card-item style="height: 45px;">
            <v-btn @click="toggleimagery(); basemapcard = false" flat density="compact" style="height: 100%;">
                <v-card-title id="basemapfont"> Imagery </v-card-title>
            </v-btn>
        </v-card-item>
    </v-card>
    <v-card id="jumptotoggle" max-width="400" hover @mouseleave="mouseleavejumpto" v-if = "jumptocard" >
       
       <v-card-item style="height: 45px;">
           <v-btn @click="handleJumpToToolGoogle()" density="compact" style="height: 100%;">
               <v-card-title id="jumptofont" > Jump to Google </v-card-title>
           </v-btn>
       </v-card-item>
       <v-card-item style="height: 45px;">
           <v-btn @click="handleJumpToToolSPM()" density="compact" style="height: 100%;">
               <v-card-title id="jumptofont"> Jump to SPM </v-card-title>
           </v-btn>
       </v-card-item>

   </v-card>
   <v-card id = "containersettings" height = "615" v-show = "settingsstatus">
    <v-card-item>
        <span class="banner-txt">Settings</span>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        <span id='releaseNotes' :style="{color: releaseNotesColor, fontSize: '13px'}" @mouseover="releaseNotesColor = 'white'" @mouseleave="releaseNotesColor = '#D9D9D9'" @click="isReleaseNotes = true">Version {{ store.retsVersion }}</span>
    </v-card-item>
        <hr id = "separator"/>
        <!-- <v-card-item id = "darkmodeitem" >
            <div id = "darkmodeswitch">
                <v-switch  v-model="switchValueDark" label="Dark Mode" color="primary" :style="{color: fontColor}" @change="newSwitchTurnedOn" disabled></v-switch>
            </div>
            
        </v-card-item> -->
        <v-card-item class = "topSettings" >
            <div style="height: 40px;">
                <v-switch v-model="store.autozoomtest"   class="autozoom-switch" color="primary" :style="{color: fontColor}" @change="newSwitchTurnedOn()" density="compact" >
                    <template #prepend >
                        <v-label>
                            Automatically zoom when I change filters
                        </v-label>
                    </template>
                </v-switch>
            </div>
                <v-label style="font-size: 10px; color: #D9D9D9; margin-left: 10px;">Display selected basemap on load</v-label>
                <v-select style="width: 22rem; margin-left: 10px; margin: top 0; margin-bottom: 0;" class="basemap-select" variant="underlined" density="compact" v-model=store.basemaptest :items=basemapArray></v-select>
        </v-card-item>
        <hr id = "separator" />
            <v-btn @click ="activateFeedback()" color="#4472C4" rounded  style="position: absolute; right: 25px; top: 172px; z-index: 99999;">
                <span style="font-weight: 100;">Feedback</span>
            </v-btn>
        <v-card-item id = "notificationsitems" >
            <v-card-title id="notificationsfont">Notifications</v-card-title>
            <v-card-subtitle id = "notificationssub">
            <div id="notis">
                Send notifications for: <br>
                <div id="notiswitches">
                    <v-card-item v-for="(item, index) in switches" :key="index" :id="'switch-container-' + index" class="switch-item">
                        <v-switch v-model="item.value" color="primary" :style="switchStyle(item.fontColor)" @change="switchTurnedOn(index)" disabled>
                            <template #prepend >
                                <v-label >
                                    {{ item.label }}
                                </v-label>
                            </template>
                        </v-switch>
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
                    <v-btn style="float: right;" variant="outlined" size="small" class="main-button-style" @click=" handleactiveclass(); saveSettings()">save</v-btn>
                    <v-btn style="float: right;" variant="plain" size="small" class="secondary-button"  @click="handleactiveclass(); cancelSettings()">CANCEL</v-btn>
                    
                    
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
        
        <v-checkbox class="small-checkbox" label="I prefer to remain anonymous" v-model="isAnonymous" style="margin-left: -40px; margin-top: -20px;"></v-checkbox>
        <div style="margin-right: 10px;">
            <v-btn style="float: right;" variant="outlined" size="small" class="main-button-style" @click="submitFeedback" :disabled=feedbackSubmitStatus >SUBMIT</v-btn>
            <v-btn style="float: right;" variant="plain" size="small" class="secondary-button" @click="cancelFeedback" >CANCEL</v-btn>
        </div>
    </v-card>
    <v-card id="releasenotesSection" v-if="isReleaseNotes" height="630" width="400" style="border-radius: 0;">
        <v-card-title style="font-weight: 400;">Release Notes</v-card-title>
        <hr id = "separator"  />
        <div style="height: 525px; width: 370px; margin: auto; left: 0; right: 0; overflow-y: auto; ">
         
            <v-list v-model:opened="openedVlist">
  <!-- New Updates Section -->
  <v-list-group value="New Updates" class="release-notes">
    <template v-slot:activator="{ props }">
      <v-list-item 
        v-bind="props" 
        :key="0" 
        :title="latestReleaseNotes[0][0]">
      </v-list-item>
    </template>
    
    <!-- Bulleted Items -->
    <v-list-item 
      v-for="(value, i) in latestReleaseNotes[0].slice(1)" 
      :key="`latest-item-${i}`" 
      class="wrap-text"
      :disabled="true" >
      <div style="border-width: 2px;">
        <v-list-item-title class="bullet-item">
          <v-icon small class="mr-2">mdi-circle-small</v-icon> <!-- Bullet -->
          {{ value }}
        </v-list-item-title>
    </div>
    </v-list-item>
  </v-list-group>
  
  <!-- Previous Release Notes Section -->
  <template v-for="([version, ...changelog], i) in previousReleaseNotes" :key="i">
    <v-list-group class="release-notes" v-model="expandedGroups[i]">
      <template v-slot:activator="{ props }">
        <v-list-item 
          v-bind="props" 
          :title="version" 
          class="wrap-text"
          >
        </v-list-item>
      </template>
      
      <!-- Bulleted Items -->
      <v-list-item 
        v-for="(log, j) in changelog" 
        :key="j" 
        class="wrap-text"
        :disabled="true" >
          <v-list-item-title class="bullet-item">
            <v-icon small class="mr-2">mdi-circle-small</v-icon> <!-- Bullet -->
            {{ log }}
          </v-list-item-title>
      </v-list-item>
    </v-list-group>
  </template>
</v-list>      
        </div>
        <hr id = "separator" style="margin-bottom: 13px;" />
        <v-btn  style="float: right; margin-top: 0; margin-right: 20px;" variant="outlined" size="small" class="main-button-style" @click="isReleaseNotes = false">CLOSE</v-btn>


    </v-card>
</template>

<script>

    import { appConstants } from '../common/constant.js';
    import { imageryBasemap, darkVTBasemap, map,lightVTBasemap, standardVTBasemap, googleVTBasemap, OSMVTBasemap, graphics, createretssym, view, legendWidget, sketchWidgetcreate, sketchWidgetselect, retsLabelclass, roadwaysRenderer, TxDOTRoadways, hybridBasemap, retsLayer} from '../components/map-Init.js';
    import { createtool, selecttool, togglemenu, logoutUser, outlineFeedCards, retsLayerView, applyDarkGrey, applyLightGrey, applyStandard, applyImagery, applyHybrid, applyGoogle, applyOSM } from '../components/utility.js';
    import { vuetify } from '../main.js';
import { addSettings } from './crud.js';
    import { store } from './store';
    import { defineAsyncComponent } from 'vue'

    export default{
        name: "NavBar",
        components:{
            RetsDetailPage: defineAsyncComponent(()=>import('./RetsDetail.vue')),
            detailsAlert: defineAsyncComponent(()=>import('./detailsAlert.vue'))
        },
        data(){
            return{
                toggle: store.toggleFeed,
                openedVlist: ['New Updates'],
                isNewReleaseOpen: true,
                expandedIndex: null,
                expandedGroups: [],
                isReleaseNotes: false,
                mountedAutoZoom: null,
                selectfunction : {},
                store,
                basemapArray: ['Dark Grey', 'Light Grey', 'Standard TxDOT', 'Open Street Map', 'Hybrid', 'Google', 'Imagery'],
                shiftmap: false,
                fontColor: '#D9D9D9',
                releaseNotesColor: '#D9D9D9',
                switchValueDark: true,
                switchValue : false,
                isAutoZoom: null,
                currAutoZoomValue: null,
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
                feedbackName: "",
                latestReleaseNotes: [
                    [
                        `Latest Release Version ${store.retsVersion}`,
                        'User Story 96: Version and Release Notes',
                        'User Story 157: RETS Labels turn on sooner',
                        'User Story 193: Add option to disable automatic zoom',
                        'User Story 204: Add setting to change the default basemap on load',
                        'User Story 212: Move legend icon down and basemap button up', 
                        'Bug 229: Date Filter overlaps with buttons'
                    ]
                ],
                previousReleaseNotes: [
                ['Release 2.6',
                 'User Story 83: Imagery/Roadway Hyrbrid Basemap',
                 'User Story 169: Add ability to double-click to open a RETS point from the map pane', 
                 'User Story 185: Expand search on Activity Feed to search all history items, especially comments',
                 'User Story 188: Add a feedback option to the Settings menu for users to send idea',
                 'User Story 199: Add RETS number to browser tab Title Bar text',
                 'User Story 200: Add attachment icon to Activity Feed cards',
                 'User Story 9: Filters: styling updates',
                 'User Story 10: Job Detail Pane: Update 2',
                 "Bug 122: Search isn't respected after opening a card then closing it",
                 'Bug 6: Save issues when changing District Analyst',
                 'Bug 11: Messages for field change triggers incorrect',
                 'Bug 12: Remove counter from Details Pane header',
                 'Bug 217: Description field validation missing when adding a new point',
                 'Bug 220: New, Proposed check box in wrong place'


                ],
                ['Release 2.5', ' User Story 95: Add a count to the header', 'User Story 111: Use most recent history item in the card footer ', 'User Story 133: Filter: Add Custom Filter option',
                'User Story 146: Job Detail Pane: Update', 'User Story 171: Resize app','User Sory 150: Add ability to save custom filters', 'User Story 170: Add update triggers for all updates made to a RETS',
                'User Story 195: Add time-gated limiter to triggers to prevent 3 or more comments being added when new RETS is created', 'User Story 205: Update tables and filter for multiple district users',
                'User Story 230: Transition to prod create portal', 'Bug 178: Activity feed detail pane selection interaction', 'Bug 192: Changing status duplicates job feed', 'Bug 176: 1969 date corrupting history update in card footer',
                'Bug 180: New job cards are not at the top of the feed', 'Bug 181: No route check box not checked for new jobs', 'Bug 123: Map Pane Search still not working properly for Minute Orders'],
                ['Release 2.4', 'User Story 146: Job Detail Pane: Update', ' Bug 158: Selection not respected when JD pane is open', 'Bug 172: RETS number and subtitle too close'],
                ['Release 2.3', 'User Story 107: Create tab buttons for Activity Feed and Details', 'User Story 108: Cancel button warning popup for unsaved changes', 'User Story 137: Add "Created" by info to metadata tab',
                'User Story 146: Job Detail Pane: Update', 'User Story 148: Update trigger for history items to reflect username instead of RETSBOT','User Story 156: Add right click to get coordinates function',
                'Bug 120: Flags not persisting', 'Bug 161: Assigned to default incorrect', 'Bug 210: Search: Value that does not exist zooms to random street', 'Bug 221: Double Click of RETS doesnt ask to save/discard changes on RETS',
                'Bug 223: Discard popup appears when right click while details pane is open'],
                ['Release 2.2', 'User Story 79: Related RETS Interaction', 'User Story 109: Add Activity and Detail Pane tabs', 'User Story 144: Job Detail Pane: Disable GEM task icon',
                'User Story 149: Set up a test environment', 'User Story 139: Update default filter (to show all RETS with your name associated with it, anywhere)', 'Bug 116: Activity feed/Filter interaction',
                'Bug 117: Card Selection', 'Bug 86: Add new point spinner is off center for certain screen sizes', 'Bug 93: Save not enabled after changes', 'Bug 97: Add attachment issues','Bug 98: Filter: User drop down not sorted',
                'Bug 99: Filter: Count bubble', 'Bug 100: Add new point: New points show at bottom of feed', 'Bug 101: DFO field: Limit to 3 decimal places', 'Bug 102: Add new point: Orange route remains',
                'Bug 145: Detail Pane Save button errors', 'Bug 125: Invalid route data and description lost when making new point', 'Bug 127: Date Picker in Detail Pane cant be closed unless a date is picked',
                'Bug 114: Marking a RETS as Complete still shows in feed even if that filter is off', 'Bug 115: Center map on Texas when no cards are loaded in the feed (not off the coast of Africa)',
                'Bug 118: "Add" comment button does not scroll to the entry location', 'Bug 121: Left Nav Bar: Icons shift when activated', 'Bug 124: Cursor in Map Pan still shows as pointer when hovering over a road in some circumstances',
                'Bug 126: Points remain selected in the map after cards are unselected/closed','Bug 129: Filter popup dropdowns close method', 'Bug 132: Filter: Calendar allows too many dates to be selected',
                'Bug 141: Form field validation bugs', 'Bug 128: Filter: Count doesnt reset','Bug 134: Form Validation: MO/TxDOT Connect number', 'Bug 135: Form Validation: Number field can not be NULL',
                'Bug 136: Route field editable','Bug 140: Setting', 'Bug 142: Show Selected: Feed does not return when selection is cleared', 'Bug 143: Show Selected: Clears selection when diactivated',
                'Bug 151: Activity Feed does not refresh after making a change to a RETS that would exclude that card from the feed based on the current filters', 'Bug 189: Linework is not aligning with basemap in RETS'],
                ['Release 2.1','User Story 41: Map Pane', 'User Story 42: Initial Schema','User Story 44: Activity Feed Pane','User Story 45: Left Nav Menu Bar','User Story 46: Job Detail Pane',
                'User Story 47: Add New Job Point','User Story 50: UI: Style Guide','User Story 52: Filter','User Story 55: Form Field Validations','User Story 58: Triggers','User Story 60: Show Selected',
                'User Story 61: History','User Story 65: History Enhancements','User Story 66: Settings','User Story 74: RETS Subtitle','User Story 76: Archive RETS jobs','User Story 77: Move existing point',
                'Bug 84: Filter: Cancel button doesnt cancel and count doesnt reset','Bug 87: DFO error notification','Bug 88: MO link greyed out','Bug 89: Home button zooms to wrong location',
                'Bug 91: Default deadline date','Bug 103: Map pane: Home button, filter interaction zoom', 'Bug 104: Route Name field validation and auto-update' ],  
                ['Release 2.0','RETS V2 first release'],  
                ],
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
                               {
                                title:"Legend", icon: 'mdi-format-list-bulleted-type', color: "white", name: "Legend", 
                               action: () =>{
                                this.handleLegendTool();
                                this.retsToolsBottom[3].isActive = !this.retsToolsBottom[3].isActive
                               },
                               hover:() => 
                                    {
                                        this.basemapcard = false;
                                        this.jumptocard= false;
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
                created() { 
                    this.expandedGroups = this.previousReleaseNotes.map(() => false); 
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
                        if(store.activityBanner !== "Activity Feed"){
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
                   },
                },
                mounted() {
                    this.setAutozoomSwitch()

                },
                
                methods: {
                    toggleGroup(index) { this.$set(this.expandedGroups, index, !this.expandedGroups[index])},
                    setAutozoomSwitch(){
                        if (JSON.parse(appConstants.defaultUserValue[0].settings) == null){
                            store.autozoomtest = true
                            
                        }
                        else{
                            store.autozoomtest = JSON.parse(appConstants.defaultUserValue[0].settings).autoZoom
                        }
                    },
                    async saveSettings(){
                        store.settings = {
                            autoZoom : store.autozoomtest,
                            basemap: store.basemaptest
                        } 
                        this.isAutoZoom = store.autozoomtest
                        const settingsObject = {attributes: {OBJECTID : appConstants.defaultUserValue[0].objectid, SETTINGS : JSON.stringify(store.settings)}}
                        await addSettings(settingsObject)

                    },
                    cancelSettings(){
                        if (JSON.parse(appConstants.defaultUserValue[0].settings) == null && this.isAutoZoom == null){
                            store.autozoomtest = true
                        }
                        else if (JSON.parse(appConstants.defaultUserValue[0].settings).autoZoom == null && this.isAutoZoom != null){
                            store.autozoomtest = this.isAutoZoom
                        }
                        else if (JSON.parse(appConstants.defaultUserValue[0].settings).autoZoom != null && this.isAutoZoom == null){
                            store.autozoomtest = JSON.parse(appConstants.defaultUserValue[0].settings).autoZoom
                        }
                        else if (JSON.parse(appConstants.defaultUserValue[0].settings).autoZoom != null && this.isAutoZoom != null){
                            store.autozoomtest = this.isAutoZoom
                        }
                       
                    },
                    shiftDiv(){
                        const viewSurface = document.querySelector('.esri-view');
                        viewSurface.classList.toggle('translateX-500px');
                        const settingspopup = document.querySelector('#containersettings')
                        // if(settingspopup){
                        //     settingspopup.classList.toggle('translatesettings')

                        // }
                        

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
                        if (this.feedbackStatus){
                            this.feedbackStatus = false
                            this.settingsstatus = false
                            return
                        }
                        this.settingsstatus = !this.settingsstatus;

                     },
                    toggledarkgrey(){
                       applyDarkGrey()
                    },
                    togglelightgrey(){
                       applyLightGrey()
                    },
                    togglestandard(){
                        applyStandard()

                    },  
                    toggleimagery(){
                        applyImagery()
                    },
                    togglehybrid(){
                        applyHybrid()
                    },
                    togglegoogle(){
                        applyGoogle()
                    },
                    toggleosm(){
                        applyOSM()
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
                    async sendWebhookRequest(feedbackString, user){
                        let url = `https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_RETS_Emailer.fmw?FEEDBACK=${feedbackString}&USERNAME=${user}&opt_showresult=false&opt_servicemode=sync&token=27a9777b0f14467fcfc09b854466559d14c24e43`
                        try{
                            const response = await fetch(url)
                            if (!response.ok){
                               return
                            }
                            else{
                                this.feedbackStatus = false
                                this.settingsstatus = true
                                this.feedbackText = ""
                                this.isAnonymous = false
                                store.alertTextInfo = {"text": "Thank you for your feedback!", "color": "#70ad47", "type":"success", "toggle": true}
                                store.isAlert = true

                                setTimeout(() => {
                                    store.isAlert = false

                                }, 10000);
                            }
                        }
                        catch(error){
                            console.log(error)
                        }
                    },
                    submitFeedback(){
                        this.isAnonymous ? this.sendWebhookRequest(this.feedbackText, 'Anonymous') : this.sendWebhookRequest(this.feedbackText, store.loggedInUser)
                       
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
        width: 158px;
        height: 330px;
        bottom: 18.3%;
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
        height: 90px;
        bottom: 14%;
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
        z-index: 999;
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
    #topSettings{
        font-size: 20px;
        width: 23rem;
        right: 0;
        left: 0;
        margin: auto;
        border: solid red;
        border-width: 2px;
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
        height: 23rem;
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
        height: 350px;
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
        margin-top: -20px;
    }
    #bottomitems{
        position: absolute;
        bottom: 5px;
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
        left: 0;
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
    #showAlert{
        position: absolute;
        left: 37%;
        border-radius: 0% !important;
    }
    #releaseNotes{
        cursor: pointer;
    }
    #releasenotesSection{
        position:absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 99999;
    }
    .switch-item .v-input__control{
        justify-self: end;
        margin-right: 16.5px;
    }
    .topSettings .autozoom-switch .v-input__control{

        justify-self: end;
        margin-right: 5.5px;
    }
    .basemap-seelct{
        z-index: 1;
    }

    .wrap-text .v-list-item-title {
        white-space: normal; 
        overflow: visible;
        line-height: 1.5;
        
        
    }

    .release-notes .v-list-group__items{
        background-color: #252525;
        margin-left: -20px;
        
        
    }
    .release-notes .v-list-group__items .v-list-item{
        height: auto;
        max-height: 10000px !important;

    }
    .bullet-item{
        display: flex;
        align-items: left;
        
    }

    
   
    
</style>
