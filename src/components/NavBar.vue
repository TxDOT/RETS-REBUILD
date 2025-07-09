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
            <v-list-item id="popoutitems" class="iconList-item" v-for="(tool, i) in retsToolsBottom" :key="i" :value="tool" @mouseover="tool.hover(tool.title)" @mouseleave="tool.hoverout(tool.title)" @click="tool.action()" :active="tool.isActive" :active-class="tool.name !== 'Jump To' || tool.name !== 'Basemaps' ? 'btn-left-brder' : ''" >
                <template v-if="tool.name !== 'Basemaps' && tool.name !== 'Jump To' && tool.name !=='Multi-Select' ">
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
                         <template v-if="tool.name == 'Multi-Select'">
                                    <v-badge location="end" color="#4472C4" :content="store.roadHighlightObj.size" id="badge"> 
                                        <v-icon class="topIcon" size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>
                                </v-badge>
                            </template>
                            <template v-else>
                                <v-icon class="topIcon" size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'"></v-icon>

                            </template>
                        
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
   
   <v-list id='Selecticons' hover @mouseleave="mouseleaveselect" v-if = "selecttoggle" >
        <v-list-item  v-for="(tool, i) in multiselectOptions" :key="i" :value="tool" @click="tool.action()":active="tool.isActive" style="margin: 0; padding: 0 !important;  width:39px; height: 39px; justify-items: center;">    
                <v-tooltip location="right bottom" :text=tool.name >
                    <template v-slot:activator="{ props}">
                        <v-icon size="20" :icon="tool.icon" :color="tool.color" :name="tool.name" v-bind="props" @mouseover="tool.color='#FFFFFF'" @mouseleave="tool.color='#D9D9D9'" style="justify-items: center; align-self: center;"></v-icon>
                    </template>
                </v-tooltip>
                
            </v-list-item>
        </v-list>
   <v-card id = "containersettings" height = "655" v-show = "settingsstatus">
    <v-card-item>
        <span class="banner-txt">Settings</span>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        <span id='releaseNotes' :style="{color: releaseNotesColor, fontSize: '13px'}" @mouseover="releaseNotesColor = 'white'" @mouseleave="releaseNotesColor = '#D9D9D9'" @click="isReleaseNotes = true">Version {{ store.retsVersion }}</span>
    </v-card-item>
        <v-card-item class = "topSettings" >
                <v-switch v-model="store.autozoomtest"   class="autozoom-switch" color="primary" :style="{color: fontColor}" density="compact" >
                    <template #prepend >
                        <v-label>
                            Automatically zoom when I change filters
                        </v-label>
                    </template>
                </v-switch>
                <v-switch v-model="store.autozoomextent"   class="autozoom-switch" color="primary" :style="{color: fontColor}" density="compact" >
                    <template #prepend >
                        <v-label>
                            Automatically filter the activity feed based on the map extent
                        </v-label>
                    </template>
                </v-switch>

                <v-label style="font-size: 10px; color: #D9D9D9; margin-left: 10px;">Display selected basemap on load</v-label>
                <v-select style="width: 22rem; margin-left: 10px; margin: top 0; margin-bottom: 0;" class="basemap-select" variant="underlined" density="compact" v-model=store.basemaptest :items=basemapArray></v-select>
        </v-card-item>
            <v-btn @click ="activateFeedback()" color="#4472C4" rounded  style="position: absolute; right: 25px; top: 212px; z-index: 99999;">
                <span style="font-weight: 100;">Feedback</span>
            </v-btn>
        <v-card-item id = "notificationsitems" >
            <v-card-item class="banner-txt" style="padding-left: 7px; padding-top: 0; padding-bottom: 0;"><span>Notifications</span></v-card-item>
            <v-card-subtitle id = "notificationssub">Send notifications for:</v-card-subtitle>
           <div id="notis">
                <v-card-item v-for="(item, index) in switches" :key="index"  class="switch-item">
                    <div style="height: auto;">
                        <v-switch :model-value="item.value" color="primary"  @update:modelValue="item.value= $event" :disabled="isDisabled(index)"  :style="{color: fontColor, height: '50px', marginTop : '20px'}"   >
                        <template #prepend >
                            <v-label @mouseover="testfunction(index) " >
                                {{ item.label }}
                                
                            </v-label>
                        <template v-if="item.label === 'No activty in ______ days'">
                            <v-select :items="noActivityDays" class="daysDropdown" base-color="transparent" bg-color="transparent" :center-affix=true chips density="compact" variant="plain" max-width="20px" v-model="item.value3"></v-select>
                        </template>


                        </template>
                    </v-switch>

                    <v-select :key="index" v-if="addDropdown(index)" density="compact" variant="underlined" class="switchDropdown" v-model="item.value2" multiple :items=statuses  >
                        <template #prepend>
                            <v-label >
                                Applies to: 
                            </v-label>
                        </template>
                    </v-select> 
                    </div>
                    
                </v-card-item>  
            </div>
            
        </v-card-item>
        <v-card-item id="bottomitems">
            <div style="width: 100%; position: relative; height: 100%;">
                <div style="width: 100%; position: relative;">
                    <v-btn variant="plain" size="small" class="secondary-button"  prepend-icon="mdi-power" @click="logoutMethod()" >LOGOUT</v-btn>
                    <v-btn style="float: right;" variant="outlined" size="small" class="main-button-style" @click=" handleactiveclass(); saveSettings()">save</v-btn>
                    <v-btn style="float: right;" variant="plain" size="small" class="secondary-button"  @click="handleactiveclass(); cancelSettings()">CANCEL</v-btn>
                </div>
            </div>
        </v-card-item>

    </v-card>
    <v-card id="suggestionsSection" height="360px" width="350" style="border-radius: 0;" v-if="feedbackStatus">
        <v-card-title class="feedbackHeader">
            Provide Feedback
        </v-card-title>
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
        <div style="margin-right: 10px; margin-bottom: 0px; height: 40px;">
            <v-btn style="float: right;" variant="outlined" size="small" class="main-button-style" @click="submitFeedback" :disabled=feedbackSubmitStatus >SUBMIT</v-btn>
            <v-btn style="float: right;" variant="plain" size="small" class="secondary-button" @click="cancelFeedback" >CANCEL</v-btn>
        </div>
    </v-card>
    <v-card id="releasenotesSection" v-if="isReleaseNotes" height="655" width="400" style="border-radius: 0;">
        <v-card-title style="font-weight: 400;">Release Notes</v-card-title>
        <div  class="releaseNotesItems">
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
                    <v-list-item v-for="(value, i) in latestReleaseNotes[0].slice(1)" :key="`latest-item-${i}`"  class="wrap-text" :disabled="true" >
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
                            <v-list-item  v-bind="props" :title="version" class="wrap-text"></v-list-item>
                        </template>
                    
                        <!-- Bulleted Items -->
                        <v-list-item 
                            v-for="(log, j) in changelog"  :key="j" class="wrap-text":disabled="true" >
                            <v-list-item-title class="bullet-item">
                                <v-icon small class="mr-2">mdi-circle-small</v-icon> <!-- Bullet -->
                                {{ log }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </template>
            </v-list>      
        </div>
        <v-btn  style="float: right; margin-top: 0; margin-right: 20px;" variant="outlined" size="small" class="main-button-style" @click="isReleaseNotes = false">CLOSE</v-btn>
    </v-card>
</template>

<script>

    import { appConstants } from '../common/constant.js';
    import { graphics, createretssym, view, legendWidget, sketchWidgetcreate, sketchWidgetselect } from '../components/map-Init.js';
    import { createtool, selecttool, togglemenu, logoutUser, applyDarkGrey, applyLightGrey, applyStandard, applyImagery, applyHybrid, applyGoogle, applyOSM, home, restoreExtent, getUserOBJECTID} from '../components/utility.js';
    import { vuetify } from '../main.js';
    import { addSettings } from './crud.js';
    import { store } from './store';
    import { defineAsyncComponent } from 'vue'
    import { setDefExpRets } from './login.js';
      import { shallowRef } from 'vue'

    export default{
        name: "NavBar",
        components:{
            RetsDetailPage: defineAsyncComponent(()=>import('./RetsDetail.vue')),
            detailsAlert: defineAsyncComponent(()=>import('./detailsAlert.vue'))
        },
        data(){
            return{
                favorites : shallowRef([]),
                toggle: store.toggleFeed,
                openedVlist: ['New Updates'],
                isNewReleaseOpen: true,
                expandedIndex: null,
                expandedGroups: [],
                isReleaseNotes: false,
                mountedAutoZoom: null,
                selectfunction : {},
                store,
                selecttoggle: false,
                basemapArray: ['Dark Grey', 'Light Grey', 'Standard TxDOT', 'Open Street Map', 'Hybrid', 'Google', 'Imagery'],
                shiftmap: false,
                fontColor: '#D9D9D9',
                releaseNotesColor: '#D9D9D9',
                switchValueDark: true,
                switchValue : false,
                isAutoZoom: null,
                isAutoZoomExtent: null,
                userSettings: JSON.parse(appConstants.defaultUserValue[0].settings) || {},
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
                notificationValue: false,
                currentSwitchValue: [],
                statuses: ['In my district(s)', 'Assigned to me', "I'm tagged in ", 'Created by me', 'Any association with me (incl. history items)'],
                showDropdown: false,
                noActivityDays: [30,60,90],
                numberOfDays: null,
                noActivityAppliesTo: 0,
                deleteAppliesTo: 0,
                statusAppliesTo: 0,
                testvmodel:null,
                multiselectTool: 'rectangle',
                latestReleaseNotes: [
                    [
                        `Latest Release Version ${store.retsVersion}`,'User Story 110: Multi Select Tool: Lasso', 'User Story 357: Card return to previous in feed pane', 'Bug 360: Selected features counter on the select button increases when opening a selected point', 
                        'Bug 359: Jump to SPM button opens a blank map', 'Bug 344: User filter returning results outside the scope of that filter', 'Bug 337: Route and subtitle overlap', 
                        'Bug 338: Save enabled with no description', 
                    ]
                ],
                previousReleaseNotes: [
                    [
                        `Release 2.7.1`,'User Story 226: Add Lat/Long searching','User Story 230: Transition to prod create portal','User Story 119: Add links/URL to a comment in History',
                        'User Story 256: History items should expand to fit all text',
                        'User Story 62: Add Setting to filter feed based on map extent','User Story 139: Update default filter  (to show all RETS with your name associated with it, anywhere)',
                        'Bug 219: Settings button activates the basemap button', 'Bug 271: Subtitle has blue highlight when editing', 'Bug 272: Custom query and map zoom interaction',
                        'Bug 302: Multi select activates basemap button'
                    ],
                    ['Release 2.7','User Story 96: Version and Release Notes',
                        'User Story 157: RETS Labels turn on sooner',
                        'User Story 193: Add option to disable automatic zoom',
                        'User Story 204: Add setting to change the default basemap on load',
                        'User Story 212: Move legend icon down and basemap button up', 
                        'Bug 229: Date Filter overlaps with buttons','Bug 227: Interaction between feed and details tab not working properly',
                        'Bug 228: Update the format of the RETS number in the browser tab','Bug 232: Date Filter','Bug 233: Custom Query/ filter interaction',
                        'Bug 255: Filter: Date sorting reverts'

                    ],
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
                 'Bug 178: Activity feed detail pane selection interaction', 'Bug 192: Changing status duplicates job feed', 'Bug 176: 1969 date corrupting history update in card footer',
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
                            { label: "New RETS in my district(s)", value: false},
                            { label: "RETS assigned to me", value: false},
                            { label: "Someone tags me", value: false},
                            { label: "RETS marked high priority", value: false},
                            { label: "No activty in ______ days", value: false, value2: null, value3: this.numberOfDays},
                            { label: "A RETS is deleted", value: false, value2: null},
                            { label: "Status changes to", value: false, value2: null},
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

                                    action: () => 
                                        {
                                            return
                                        },
                                    hover:(i) => 
                                        {
                                            if (i === "Basemap")
                                                {
                                                    this.basemapcard = true
                                                }
                                        },
                                    hoverout: (i) => 
                                        {
                                            const myDiv = document.getElementById("basemaptoggle")
                                            if (myDiv.matches(':hover') === false){
                                                this.basemapcard = false
                                            }
                                        }
                                    
                                },
                               {title:"JumpTo", icon: 'mdi-run', color: "#D9D9D9", name: "Jump To", isActive: false,
                                    action: () =>
                                        {
                                            return
                                        },
                                    hover:(i) => 
                                        { 
                                            if (i === "JumpTo")
                                                {
                                                    this.jumptocard = true

                                                }
                                        },
                                    hoverout: (i) => 
                                        {
                                            const myDiv = document.getElementById("jumptotoggle")
                                            if (myDiv.matches(':hover') === false)
                                            {
                                                this.jumptocard = false
                                            }
                                        }
                                },
                                {title:"Select", icon: 'mdi-select-multiple', color: "#D9D9D9", name: "Multi-Select", isActive: false,
                                    action: () =>
                                        {
                                            if(store.isSelectEnabled)
                                                {

                                                    sketchWidgetselect.cancel()                           
                                                    this.retsToolsBottom[2].isActive = false
                                                    this.multiselectOptions[0].isActive = false
                                                    this.multiselectOptions[1].isActive = false
                                                }
                                            else
                                                {
                                                    this.handleSelectTool(this.multiselectTool);
                                                }

                                            store.isSelectEnabled = !store.isSelectEnabled
                                            
                                        },
                                    setActive: () => {
                                        return true
                                    },
                                    hover:(i) => 
                                        {
                                            this.selecttoggle = true;
                                        },
                                    hoverout: (i) => 
                                        {
                                            const myDiv = document.getElementById("Selecticons")
                                            if (myDiv.matches(':hover') === false)
                                                {
                                                    this.selecttoggle = false
                                                }
                                        }
                                },
                               {
                                title:"Legend", icon: 'mdi-format-list-bulleted-type', color: "white", name: "Legend", 
                                    action: () =>
                                        {
                                            this.handleLegendTool();
                                            this.retsToolsBottom[3].isActive = !this.retsToolsBottom[3].isActive
                                        },
                                    hover:() => 
                                        {
                                            return
                                        },
                                    hoverout: (i) => 
                                        {
                                                return
                                        }
                                
                               },
                               {title:"Settings", icon: 'mdi-cog', color: "#D9D9D9", name: "Settings",
                                    action: () =>
                                        {
                                            this.handleSettingsTool();
                                            this.retsToolsBottom[4].isActive = !this.retsToolsBottom[4].isActive;
                                        },
                                    hover:(i) => 
                                        {
                                            return
                                        },
                                    hoverout: (i) => 
                                        {
                                            return
                                        }
                                }
                            ],

                multiselectOptions: [ {title:"Rectangle", icon: 'mdi-rectangle-outline', color: "#D9D9D9", name: "Multi-Select - Rectangle", class:"topIcon3", isActive: false,
                               action: () => {
                                this.handleSelectTool('rectangle');
                                if (this.multiselectOptions[1].isActive == true) {   
                                    this.multiselectOptions[1].isActive = false; 
                                }
                            
                                return
                               },
                            
                                },
                               {title:"Lasso", icon: 'mdi-vector-polygon', color: "#D9D9D9", name: "Multi-Select - Lasso", class:"topIcon2", isActive: false,
                               action: () =>{
                                this.handleSelectTool('selecttoolfreehand');
                                if (this.multiselectOptions[0].isActive == true) {   
                                    this.multiselectOptions[0].isActive = false; 
                                }
                                
                                return
                               },
                            
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
            this.setAutozoomExtentSwitch()
            this.setNotifications()
            this.updateuserSettings()

        },
        
        methods: {
                    updateSwitchValue2(item, value2){
                        console.log(item)
                        console.log(value2)
                        console.log(this.switches)

                        for (let index = 0; index < this.switches.length; index++) {
                            if (item === this.switches[index].label ){
                                console.log("match")
                                this.switches[index].value2 = value2

                            }
                            
                        }

                    },
            testfunction(index){
                if (index === 4){
                this.showDropdown = !this.showDropdown
                return true
                }
                
            },
            addDays(index){
                if (index === 2){
                    return true

                        }
                        else{
                            return false
                        }
                    },
                    addDropdown(index){
                        if (index > 3){
                            return true
                        }
                        else{
                            return false
                        }
                    },
                    updateuserSettings(){
                        store.userSettings = this.userSettings
                    },
                    setNotifications(){
                        const { notifications } = this.userSettings
                        if (notifications != null){
                            for (let i = 0; i< notifications.length; i++ ){
                                this.switches[i].value = notifications[i].value
                            }
                        }
                       
                    },
                    isDisabled(index){
                        return
                        if (index > 0){
                            return true
                        }
                        return false
                    },
                    setAutozoomExtentSwitch(){
                        const { autoZoomExtent } = this.userSettings;
                        if (autoZoomExtent != null){
                            store.autozoomextent = autoZoomExtent
                        }
                        else{
                            store.autozoomextent = false
                        }
                        return
                    },
                    setAutozoomSwitch(){
                        const { autoZoom } = this.userSettings;
                        if (autoZoom != null){
                            store.autozoomtest = autoZoom
                        }
                        else{
                            store.autozoomtest = true
                        }
                        return
                    },
                    async saveSettings(){
                        store.settings = {
                            autoZoom : store.autozoomtest,
                            autoZoomExtent: store.autozoomextent,
                            basemap: store.basemaptest,
                            notifications: this.switches
                        } 
                        console.log(this.switches)

                        for (let index = 0; index < this.switches.length; index++) {
                            const element = this.switches[index];
                            console.log(element)
                            
                        }

                        this.isAutoZoom = store.autozoomtest
                        this.isAutoZoomExtent = store.autozoomextent
                        const settingsObject = {attributes: {OBJECTID : appConstants.defaultUserValue[0].objectid, SETTINGS : JSON.stringify(store.settings)}}
                        // await addSettings(settingsObject)
                    //    console.log(store.settings)

                const userOBJECTID = await getUserOBJECTID(store.loggedInUser)
                this.userSettings = JSON.parse(userOBJECTID.SETTINGS)
                store.userSettings = this.userSettings


                if (store.updateRetsSearch.length != store.retspointlength && store.autozoomextent == false){
                    if (store.CREATE_DT){
                        await store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", `${store.CREATE_DT.filter} ${store.CREATE_DT.sortType}, PRIO`)
                    }
                    else{
                        await store.getRetsLayer(store.loggedInUser, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
                    }
                    return  
                }
                
                

            },
            cancelSettings(){
                const { autoZoom, autoZoomExtent, notifications } = this.userSettings;
                store.autozoomtest = this.isAutoZoom ?? autoZoom ?? true;
                store.autozoomextent = this.isAutoZoomExtent ?? autoZoomExtent ?? false;
        
                if (!notifications){
                    return
                }
                for (let i =0; i < this.switches.length; i++){
                    this.switches[i].value = notifications[i].value

                }

                return
            },
            shiftDiv(){
                const viewSurface = document.querySelector('.esri-view');
                viewSurface.classList.toggle('translateX-500px');
                return
            },
            // newSwitchTurnedOn() {
            //     if (this.switchValue) {
            //         this.fontColor = '#FFFFFF';
                    
            //     } else {
            //         this.fontColor = "#D9D9D9";
            //     }
            // },
            // switchTurnedOn(index) {
            //     if (this.switches[index].value) {
            //         this.switches[index].fontColor = '#FFFFFF';
            //     } 
            //     else {
            //         this.switches[index].fontColor = '#D9D9D9';
            //     }
                
            //     },
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
            mouseleaveselect(){
                this.selecttoggle = false;
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
            handleSelectTool(tooltype) { 
                if ((tooltype === sketchWidgetselect.activeTool) || (tooltype === 'selecttoolfreehand' && sketchWidgetselect.activeTool === 'polygon')) {
                    sketchWidgetselect.cancel();
                    this.retsToolsBottom[2].isActive = false
                    this.multiselectOptions[0].isActive = false
                    this.multiselectOptions[1].isActive = false
                    return
                }
                if (sketchWidgetselect.state === "active"){
                    sketchWidgetselect.cancel()
                    }
                this.retsToolsBottom[2].isActive = true
                if (tooltype === "rectangle"){
                    
                    selecttool(true, sketchWidgetselect, graphics, "rectangle","freehand")
                    this.multiselectTool = "rectangle"
                    this.multiselectOptions[0].isActive = true

                }
                else if (tooltype === "selecttoolfreehand"){
                    
                    selecttool(true, sketchWidgetselect, graphics, "polygon","freehand")
                    this.multiselectTool = "selecttoolfreehand"
                    this.multiselectOptions[1].isActive = true
                    

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
                window.open("https://www.txdot.gov/apps/statewide_mapping/StatewidePlanningMap.html?map=txdot&coords="+lat+","+lon+","+level);
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
                if (this.settingsstatus){
                    this.cancelSettings()
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
                this.feedbackSubmitStatus = true
                let url = `https://gis-batch-dev.txdot.gov/fmejobsubmitter/TPP/TPP_DEV_RETS_Emailer.fmw?FEEDBACK=${feedbackString}&USERNAME=${user}&opt_showresult=false&opt_servicemode=sync&token=27a9777b0f14467fcfc09b854466559d14c24e43`
                try{
                    const response = await fetch(url)
                    if (!response.ok){
                    }
                    else{
                        this.feedbackStatus = false
                        this.settingsstatus = true
                        this.feedbackText = ""
                        this.isAnonymous = false
                        store.alertTextInfo = {"text": "Thank you for your feedback!", "color": "#70ad47", "type":"success", "toggle": true}
                        store.isAlert = true
                        this.feedbackSubmitStatus = false

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

      .topIcon3{
        position: absolute;
        top: 75%;
        left: 70%;
        font-size: 20px;
        transform: translate(-25%, -25%);
         }
    
    .topIcon2{
        position: absolute;
        top: 20%;
        left: 70%;
        font-size: 20px;
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
    #basemaptoggle{
        position: absolute;
        width: 158px;
        height: 330px;
        bottom: 18.3%;
        left: 37px;
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
        left: 37px;
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
        /* height: 655px; */
        height: 655px;
    }

    #headerfont{
        left: 10px;
        /* font-size: 18px; */
        
        
    }
    #darkmodeitem{
        position: relative;
        bottom: 2px;
        left: 25px;
        font-size: 20px;
        height: 4rem;
        
    }
    .topSettings{
       border-bottom : 1px solid ;
       border-top: 1px solid ;
       justify-self: center;
       width: 23rem;
       padding-right: 0;
       padding-left: 0;


        }      
            
            
    #notificationsitems{
        border-bottom : 1px solid ;
        justify-self: center;
        width: 23rem;
        padding-right: 0;
        padding-left: 0;
        padding-bottom: 0;
        overflow-y: hidden;


    }


    #notificationsfont{
        position: relative;
        font-size: 18px;
        left: 5px;
    }
    #notificationssub{
        font-size: 14px;
        position: relative;
        left: 10px;
        padding-top: 3px;

    }
  
    .switch-item{
        /* height: 42px; */
        padding-top: 0;
        padding-bottom: 0;
        max-height: 50px;
        padding-right: 0;
        

    }
    #notis{
        /* display: block; */
        /* flex-wrap: wrap; */
        position: relative;
        width: 370px;
        height: 300px;
        overflow-y: auto;
        
        
    }

    #bottomitems{
        position: absolute;
        bottom: 5px;
        width: 25rem;
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
    .autozoom-switch{
        width: 22.5rem;
        height: 40px;
    }
    .topSettings .autozoom-switch .v-input__control{
        justify-self: end;
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

    #Selecticons{
        width: fit-content;
        top: 81.8%;
        padding: 0;
        left: 37px;
        z-index: 9999;
        border-radius: 0px;
        
    }


    .releaseNotesItems{
        height: 555px; 
        width: 23rem; 
        justify-self: center;
        overflow-y: auto; 
        border-top: 1px solid;
        border-bottom: 1px solid;
        padding-bottom: 5px;
        margin-bottom: 12px;

    }

    .switchDropdown{
        position: relative;
        /* left: -200px; */
        /* width: 200px; */
        margin-left: 20px;
        margin-top: 0;
        height: 32px;
        top: -15px;
    }
    
    .switchDropdown .v-field__input{
        height: 20px;
        width: 300px !important;
        font-size: 10px;
                        overflow-x: hidden;

        
    }

    .switchDropdown .v-field{
        width: 190px;
        left: -50px;
        height: 33px;
        /* padding-bottom: 20px; */




    }


    .switchDropdown .v-input__prepend{
        /* position: relative;
        padding: 0 !important */
    }

    .switchDropdown .v-chip__content{
        font-size: 9px;
    }

    .daysDropdown{
        position: absolute;
       height: 1px;
        /*width: 0px; */
        top: 204px;
        left: 83px;
        border-radius: 0;
    }

    .daysDropdown .v-chip__content{
        position: relative;
        font-size: 10px;
        /* top: 3.5px; */
    }

    .daysDropdown .v-field__append-inner{
        color: transparent;
        left: -40px;
        position: relative;
    }

    .daysDropdown .v-input__control{
        /* width: 28px; */
        
    }

    .daysDropdown .v-field__overlay{
        color: transparent;

    }

    .daysDropdown .v-field .v-chip {
        background-color: rgba(128,128,128,0)  !important;
        border-radius: 2px;
        height: 14px;
        top: 3px;
    }

    .daysDropdown .v-field__append-inner{
        left: -38px;
    }
 
     .daysDropdown .v-select--active-menu  {
        width: 10px !important;
    }

    
    
   
    
</style>