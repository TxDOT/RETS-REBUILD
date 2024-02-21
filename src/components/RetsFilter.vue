<template>
    <div class="cardDiv">
        <v-card id="filterFeed">
            <v-card-title>Filter Activity Feed</v-card-title>
            <v-select :items="filterSort" item-title="title" style="position: relative; margin: 10px;" density="compact" label="Sort" variant="underlined"></v-select>
            <v-select :items="filterSort" item-title="title"  density="compact" label="Job Type" chips closable-chips variant="underlined" class="cardDiv"></v-select>
            <v-select label="Date" chips closable-chips variant="underlined" density="compact" class="cardDiv"></v-select>
            <v-select label="Activity" chips closable-chips variant="underlined" density="compact" class="cardDiv"></v-select>
            <v-select label="District" chips closable-chips variant="underlined" density="compact" class="cardDiv"></v-select>
            <v-select label="County" chips closable-chips variant="underlined" density="compact" class="cardDiv"></v-select>
            <v-select label="Users" chips closable-chips variant="underlined" density="compact" class="cardDiv"></v-select>
            <v-card-text><u>Custom SQL Query</u></v-card-text>
            <v-textarea label="Custom SQL Query" class="cardDiv"></v-textarea>
            <div>
                <btn>

                </btn>
            </div>
        </v-card>
    </div>
</template>

<script>
    export default{
        name: "Filter",
        data(){
            return{
                filterSort: [
                             {title: "Date: Newest to Oldest", sortType: "asc", append:}, 
                             {title: "Date: Oldest to Newest", sortType: "desc"},
                             {title: "Status: Ascending", sortType: "asc"}, 
                             {title: "Status: Descending", sortType: "desc"}
                            ]
            }
        }
    }
</script>

<style scoped>
    #filterFeed{
        position: absolute;
        height: 85vh !important;
        width: 20%;
        left: calc(74px + 50vh);
        overflow-y: auto;
        border-radius: 0%;
    }
</style>
