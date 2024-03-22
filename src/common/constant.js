
export const appConstants = {
    RetsStatus: ['Not Started', 'On Hold', 'In Progress'],
    CardColorMap:{
        '1': '#FF00C5',
        '2': '#FFAA00',
        '3': '#55FF00',
        '4': 'Red',
        '5': 'Red'
    },
    
    pointSymbol:{
        type: "simple-marker",
        color: '#FF00C5',
        outline:{
            color: [255, 255, 255], // White
             width: 1
        }
    },

    statDomainValues: [],
    districtDomainValues: [],
    countyDomainValues:[],
    userDomainValues:[],
    jobTypeDomainValues:[],
    defaultStatValues: [{ name: "Not Started", value: 1 },{ name: "In Progress", value: 2 }],
    defaultUserValue:[],
    activityList: [],
    userRoles: [],
}
