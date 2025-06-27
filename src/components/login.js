import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { view, retsUserRole, retsLayer} from './map-Init.js'
import {getDomainValues, getDistinctAttributeValues, getUniqueQueryValues, queryFlags, getRetsLayerView, getHistoryView, getTxDotRdWayLayerView, home, getUserOBJECTID, filterMapActivityFeed, setFilterProperties} from './utility.js'
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

let routeParam = null

function checkURL(){
  router.afterEach((to, from)=>{
    if(to.params.retsid){
      routeParam = to.params.retsid
      window.sessionStorage.setItem("retsParam", to.params.retsid)
      return
    }
  })
  return
}

export function login(){
  checkURL()
  esriId.registerOAuthInfos([authen]);
  esriId.checkSignInStatus(`${authen.portalUrl}/sharing/rest`)
    .then((x) => alreadySignedIn(x.userId)) //already signed in
    .catch(() => generateLogin()) //not signed in; proceed to sign in 
}

function generateLogin(){
  esriId.getCredential(`${authen.portalUrl}/sharing/rest`, {
    oAuthPopupConfirmation: false 
  })
  .then(() => {
    console.log(esriId)
    let getSession = window.sessionStorage.getItem("retsParam")
    esriId.setOAuthRedirectionHandler(() => window.location = `${import.meta.env.BASE_URL}map/${getSession}`)
    signIn()
  })
}

async function signIn(){
  await getUniqueQueryValues(retsUserRole, appConstants.userRoles)
  const userId = await getUserId()
  
  await queryFlags(userId)
  await setDefExpRets(userId)
  //store.getRetsLayer(userId, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
  store.savedFilter = store.savedFilter.replace(/''/g, `'${userId}'`)
  if (store.CREATE_DT){
    await store.getRetsLayer(userId, store.savedFilter, "retsLayer", `${store.CREATE_DT.filter} ${store.CREATE_DT.sortType}, PRIO`)

  }
  else{
      await store.getRetsLayer(userId, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
  }

  appConstants.userQueryField = appConstants.queryField[appConstants.userRoles.find(x => x.value === userId).type]
  let getSession = window.sessionStorage.getItem("retsParam")
  router.push({name: "Map", params: {retsid: getSession}})
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
    //getHistoryView()
    //home(true)
    home(true)


  })
  
  return
}

function alreadySignedIn(){
  signIn()
}

export const setDefExpRets = async (userId) => {
  if(appConstants.defaultUserValue.length ) return
  const userOBJECTID = await getUserOBJECTID(userId)
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`, "objectid" : userOBJECTID.OBJECTID, "webhook" : userOBJECTID.WEBHOOK, "email" : userOBJECTID.EMAIL, "filters" : userOBJECTID.FILTERS, "settings" : userOBJECTID.SETTINGS})
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

