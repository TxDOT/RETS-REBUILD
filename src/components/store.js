import { reactive } from 'vue';

export const store = reactive({
        count: 0,
        isCloseDetail: false,
        taskGem: 0,
        alertInfo: null,
        statDomainValues: [],
        districtDomainValues: [],
        countyDomainValues:[],
        userDomainValues:[],
        jobTypeDomainValues:[],
        defaultStatValues: [{ name: "Not Started", value: 1 },{ name: "In Progress", value: 2 }],
        defaultUserValue:[],
        activityList: [],
        initRetsResults: "",
        addInitQuery(val){
            this.initRetsResults = val
        },
        retsFilters: {"CREATE_DT": {title: "Date: Newest to Oldest", sortType: "DESC", filter: "CREATE_DT"}, "JOB_TYPE": null, "EDIT_DT": null, "STAT": "", 
        "ACTV": null, "DIST_NM" : null, "CNTY_NM": null, "GIS_ANALYST": "", 
        "filterTotal": 2},

        toggleCloseDetail(val){
            this.isCloseDetail = val
        },
        addGISAnalyst(val){
            this.retsFilters.GIS_ANALYST = val
        },
        addStat(val){
            this.retsFilters.STAT = val
        },

    
})