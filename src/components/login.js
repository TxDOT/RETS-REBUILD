import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { view, retsUserRole, retsLayer} from './map-Init.js'
import {getDomainValues, getDistinctAttributeValues, getUniqueQueryValues, queryFlags, getRetsLayerView, getTxDotRdWayLayerView, 
        home, getUserOBJECTID, filterMapActivityFeed, setFilterProperties, enableFilterMapByExtent} from './utility.js'
import { appConstants } from "../common/constant.js";
import router from '../router/index.js'
import {store} from './store.js'

const authen = new OAuthInfo({
  appId: "vnsviwIoWbrwbnw8",
  popup: false,
  expiration: 10080,
  preserveUrlHash: true,
  portalUrl: "https://maps.txdot.gov/create"
})

export function login(){
  // checkURL()
  esriId.registerOAuthInfos([authen]);
  esriId.checkSignInStatus(`${authen.portalUrl}/sharing/rest`)
    .then((x) => alreadySignedIn()) //signed in
    .catch(() => console.log("re-login"))// generateLogin() not signed in; proceed to sign in 
}

// function generateLogin(){
//   esriId.getCredential(`${authen.portalUrl}/sharing/rest`, {
//     oAuthPopupConfirmation: false
//   })
//   .then(() => signIn())
// }

async function signIn(){
  try{
    await getUniqueQueryValues(retsUserRole, appConstants.userRoles)
    const userId = await getUserId()
    await queryFlags(userId)
    await setDefExpRets(userId)
    //store.getRetsLayer(userId, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
    store.savedFilter = store.savedFilter.replace(/''/g, `'${userId}'`)

    let sortFilter = store.CREATE_DT.filter ?? "EDIT_DT"
    let sortType = store.CREATE_DT.sortType ?? "DESC"

    await store.getRetsLayer(userId, store.savedFilter, "retsLayer", `${sortFilter} ${sortType}, PRIO`)

    appConstants.userQueryField = appConstants.queryField[appConstants.userRoles.find(x => x.value === userId).type]
    let getSession = localStorage.getItem("retsParam")

    !getSession ? router.push({name: "Maps"}) : router.push({name: "Map", params: {retsid: getSession}})
  
    //needs to be worked on//
    view.when(() => {
      [{name: 'JOB_TYPE', prop: "jobTypeDomainValues"},{name: 'STAT', prop: "statDomainValues"}, {name: 'DIST_NM', prop: "districtDomainValues"}, {name: 'CNTY_NM', prop: "countyDomainValues"}].forEach((layer) => {
        getDomainValues(layer.name).codedValues.forEach((x) => {
          appConstants[layer.prop].push({"name" : x.name, "value": x.code})
        })
      })
      ///////////////INSERT HERE/////////////////////////////////
      appConstants.districtDomainValues.sort((a,b) => a.name.localeCompare(b.name))
      appConstants.userRoles.sort((a,b) => a.name.localeCompare(b.name))

      getDistinctAttributeValues('ACTV')
      getRetsLayerView()
      getTxDotRdWayLayerView()
      enableFilterMapByExtent()
      // getHistoryView()
      //home(true)
      home(true)
    })
    return
  }
  catch(err){
    router.push({name: "ErrorPage"})
    console.log(err)
  }
}

function alreadySignedIn(){
  let getSession = localStorage.getItem("retsParam")
  esriId.setOAuthRedirectionHandler(() => window.location = `${import.meta.env.BASE_URL}map/${getSession}`)
  signIn()
  return
}

export const setDefExpRets = async (userId) => {
  if(appConstants.defaultUserValue.length ) return
  const userOBJECTID = await getUserOBJECTID(userId)
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`, "objectid" : userOBJECTID.OBJECTID, "webhook" : userOBJECTID.WEBHOOK, "email" : userOBJECTID.EMAIL, "filters" : userOBJECTID.FILTERS, "settings" : userOBJECTID.SETTINGS, "labels": userOBJECTID.LABEL})
  if (userOBJECTID.FILTERS === null){
    retsLayer.definitionExpression = store.savedFilter = appConstants['defaultQuery'](userId)

    store.USER = [appConstants.userRoles.find(usr => usr.value === appConstants.defaultUserValue[0].value)]
    return
  }

  const parsedUSEROBJECTID = JSON.parse(userOBJECTID.FILTERS)
  store.userFilters = parsedUSEROBJECTID
  filterMapActivityFeed(parsedUSEROBJECTID, true, userId)
  setFilterProperties(parsedUSEROBJECTID)
  return
}

export async function getUserId(){
  console.warn(`VERSION: ${store.retsVersion} -- dev status: ${store.devStatus}`)
  const user = await esriId.getCredential(`${authen.portalUrl}/sharing/rest`,{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}

