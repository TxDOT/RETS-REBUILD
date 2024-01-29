<template>
    <v-navigation-drawer width="200" height="100" permanent color="black">
        <v-list height="100%" id="icons-top" >
            <v-list-item v-for="(tool, i) in retsToolsTop" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" :active="tool.isActive">  
                <template v-slot:prepend>
                    <v-icon size="30" :icon="tool.icon" :color="tool.color"></v-icon>
                </template>
            </v-list-item>
        </v-list>
        <v-list id="icons-bottom">
            <v-list-item v-for="(tool, i) in retsToolsBottom" :key="i" :value="tool" @click="tool.action()" active-class="btn-left-brder" >
                <template v-slot:prepend>
                    <v-icon size="30" :icon="tool.icon" :color="tool.color" start></v-icon>
                </template>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
    
    <RetsCards/>

</template>

<script>
    import RetsCards from '../components/RetsFeedCards.vue'

    export default{
        components: {RetsCards},
        name: "RetsFeed",
        data(){
            return{
                tester: false,
                retsToolsTop: [
                               {title:"Test", icon: 'mdi-menu', color: "white", action: () =>{
                                    this.isActive = !this.tester
                                    document.getElementById("container").style.width = document.getElementById("container").style.width === "0%" ? "25%" : "0%"
                                    document.getElementById("feed-banner").style.padding = document.getElementById("container").style.width  === "0%" ? "0px" : "10px"
                                }, isActive: this.tester
                               },  
                               {title:"Test", icon: 'mdi-map-marker-outline', color: "#4472C4", action: () =>{
                                console.log("Hey2")
                               }, isActive: false},
                               {title:"Test", icon: 'mdi-chart-pie', color: "white", action: () =>{
                                console.log("Hey3")
                               }, isActive: false},
                               {title:"Test", icon: 'mdi-currency-btc', color: "white", action: () =>{
                                console.log("Hey4")
                               }, isActive: false},
                               {title:"Test", icon: 'mdi-filter', color: "white", action: () =>{
                                console.log("Hey5")
                               }, isActive: false},
                               {title:"Test", icon: 'mdi-bell-outline', color: "white", action: () =>{
                                console.log("Hey6")
                               }, isActive: false}
                            ],
 

                retsToolsBottom: [
                               {title:"Test", icon: 'mdi-run', color: "white", action: () =>{
                                console.log("Hey7")
                               }},
                               {title:"Test", icon: 'mdi-menu', color: "white", action: () =>{
                                console.log("Hey8")
                               }},
                               {title:"Test", icon: 'mdi-map-search', color: "white", action: () =>{
                                console.log("Hey9")
                               }},
                               {title:"Test", icon: 'mdi-cog', color: "white", action: () =>{
                                console.log("Hey10")
                               }}
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
        }
    }
</script>

<style>

    .v-list > .v-list-item{
        padding-bottom: 3rem !important;
        height: 2.3rem;
        /* font-size: 1.5rem; */
    }

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
</style>