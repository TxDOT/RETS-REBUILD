<template>
    <div class="color-picker" v-if="store.flagClickedId === store.flagRETSID" v-click-outside="closeFlagDiv">
        <v-icon style="font-size: 13.5px;" v-for="i in 7" :icon="swatchColor[i] === '#FFFFFF' ? 'mdi-flag-outline' : 'mdi-flag'" :color="swatchColor[i]" @click="assignColorToFlag(swatchColor[i])" ></v-icon>
    </div>
</template>

<script>
    import {postFlagColor} from '../components/crud.js'
    import {store} from './store'

    export default{
        name: "FlagDropdown",
        data(){
            return{
                flagClickedId: "",
                swatchColor: ['', '#FF0000', '#FF7F00', '#FFFF00', '#008000', '#4472C4', '#B75CFF', '#FFFFFF'],
                isColorPicked: false,
                store
            }
        },
        methods:{
            closeFlagDiv(){
                store.flagClickedId = ""
                store.isColorPicked = false
                return
            },
            assignColorToFlag(clr){
                const rets = store.updateRetsSearch.find(rd => rd.attributes.RETS_ID === this.flagClickedId)
                rets.attributes.flagColor.FLAG = clr
                postFlagColor(rets)
                store.isColorPicked = false;
                return
            },
        }
    }
</script>

<style scoped>
.color-picker{
    position: absolute;
    background-color: black;
    left: 496px;
    top: 2.7rem;
    width: 19px;
    /* top right bottom left */
    padding: 0rem 0px 0rem 0px;
    height: 6.7rem;
    display: flex;
    flex-direction: column;
    z-index: 9999;
    float: right;
}
</style>