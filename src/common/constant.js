export const appConstants = {
    retsPtDev: "https://testportal.txdot.gov/createags/rest/services/TPP_RETS/FeatureServer/0",
    retsPtProd: "https://testportal.txdot.gov/createags/rest/services/RETS/FeatureServer/0",
    retsCMNTDev: "https://testportal.txdot.gov/createags/rest/services/TPP_RETS_CMNT/FeatureServer/0",
    retsCMNTProd: "https://testportal.txdot.gov/createags/rest/services/RETS_CMNT/FeatureServer/0",
    retsUserRoleDev: "https://testportal.txdot.gov/createags/rest/services/RETS_SUPPORT_UAT/FeatureServer/1",
    retsUserRoleProd: "https://testportal.txdot.gov/createags/rest/services/RETS_SUPPORT/FeatureServer/1",
    retsFlagColorDev: "https://testportal.txdot.gov/createags/rest/services/RETS_SUPPORT_UAT/FeatureServer/3",
    retsFlagColorProd: "https://testportal.txdot.gov/createags/rest/services/RETS_SUPPORT/FeatureServer/3",
    RetsStatus: ['Not Started', 'On Hold', 'In Progress'],
    CardColorMap:{
        '1': '#FF00C5',
        '2': '#FFAA00',
        '3': '#55FF00',
        '4': '#686868',
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
    queryField:{
        1: "GIS_ANALYST",
        2: "GRID_ANALYST",
        3: "DIST_ANALYST"
    },
    statDomainValues: [],
    districtDomainValues: [],
    countyDomainValues:[],
    userDomainValues:[],
    jobTypeDomainValues:[],
    defaultStatValues: [{ name: "Not Started", value: 1 },{ name: "In Progress", value: 2 }, { name: "On Hold", value: 4 }],
    defaultUserValue:[],
    defaultJobtypeValues: [{ name: "Geometry", value: 1 },{ name: "Asset", value: 2 }],
    activityList: [],
    userRoles: [],
    defaultQuery : (userId) => {
        return `(${appConstants.queryField[appConstants.userRoles.find(x => x.value === userId).type]} = '${userId}' OR ASSIGNED_TO = '${userId}') AND (STAT = 1 OR STAT = 2 or STAT = 4) AND (JOB_TYPE = 1 OR JOB_TYPE = 2)`
    },
    userQueryField: [],
    defineCMNT: {
        0 : (uName, date) => {
            return `Comment added by ${appConstants?.userRoles?.find(name => name?.value === uName)?.name ?? uName} ${new Date(date).toLocaleString('en-US')} `         
        },
        1 : (uName, date) => {
            return `Created by ${appConstants?.userRoles?.find(name => name?.value === uName)?.name ?? uName} ${new Date(date).toLocaleString('en-US')} `         
        },
        2 : (uName, date) => {
            return `Status changed by ${appConstants?.userRoles?.find(name => name?.value === uName)?.name ?? uName} ${new Date(date).toLocaleString('en-US')} `         
        },
        3 : (uName, date) => {
            return `Activity changed by ${appConstants?.userRoles?.find(name => name?.value === uName)?.name ?? uName} ${new Date(date).toLocaleString('en-US')} `         
        },
        4 : (uName, date) => {
            return `Assigned to changed by ${appConstants?.userRoles?.find(name => name?.value === uName)?.name ?? uName} ${new Date(date).toLocaleString('en-US')} `         
        },
        5 : (uName, date) => {
            return `Point moved by ${appConstants?.userRoles?.find(name => name?.value === uName)?.name ?? uName} ${new Date(date).toLocaleString('en-US')} `         
        }
    }
}