import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { view, retsUserRole, retsLayer} from './map-Init.js'
import {getDomainValues, getDistinctAttributeValues, getUniqueQueryValues, queryFlags, getRetsLayerView, getHistoryView, getTxDotRdWayLayerView, home, getUserOBJECTID, filterMapActivityFeed, setFilterProperties} from './utility.js'
import { appConstants } from "../common/constant.js";
import router from '../router/index.js'
import {store} from './store.js'

const authen = new OAuthInfo({
  appId: "qzqSMtBVUMsAt2Is",
  popup: false,
  expiration: 10080,
  preserveUrlHash: true,
  portalUrl: "https://testportal.txdot.gov/create"
})

export function login(){
    esriId.registerOAuthInfos([authen]);
    esriId.checkSignInStatus(`${authen.portalUrl}/sharing/rest`)
      .then((x) => alreadySignedIn(x.userId)) //already signed in
      .catch(() => generateLogin()) //not signed in; proceed to sign in 
}

function generateLogin(){
  esriId.getCredential(`${authen.portalUrl}/sharing/rest`, {
    oAuthPopupConfirmation: false
  })
  .then(() => signIn())
}

async function signIn(){

  await getUniqueQueryValues(retsUserRole, appConstants.userRoles)
  const userId = await getUserId()
  await queryFlags(userId)
  await setDefExpRets(userId)
  store.getRetsLayer(userId, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")
  appConstants.userQueryField = appConstants.queryField[appConstants.userRoles.find(x => x.value === userId).type]
  //needs to be worked on//
  router.push({name: "Map"})
  
  view.when(() => {

    [{name: 'JOB_TYPE', prop: "jobTypeDomainValues"},{name: 'STAT', prop: "statDomainValues"}, {name: 'DIST_NM', prop: "districtDomainValues"}, {name: 'CNTY_NM', prop: "countyDomainValues"}].forEach((layer) => {
      getDomainValues(layer.name).codedValues.forEach((x) => {
         appConstants[layer.prop].push({"name" : x.name, "value": x.code})
      })
    })
    appConstants.districtDomainValues.sort((a,b) => a.name.localeCompare(b.name))
    appConstants.userRoles.sort((a,b) => a.name.localeCompare(b.name))

    getDistinctAttributeValues('ACTV')
    getRetsLayerView()
    getTxDotRdWayLayerView()
    //getHistoryView()
    home(true)

  })

  return
}

function alreadySignedIn(){
  signIn()
}


const setDefExpRets = async (userId) => {
  if(appConstants.defaultUserValue.length) return
  const userOBJECTID = await getUserOBJECTID(userId)
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`, "objectid" : userOBJECTID.OBJECTID, "webhook" : userOBJECTID.WEBHOOK, "email" : userOBJECTID.EMAIL, "filters" : userOBJECTID.FILTERS})
  if (userOBJECTID.FILTERS === null){
    retsLayer.definitionExpression = store.savedFilter = appConstants['defaultQuery'](userId)
    store.USER = [appConstants.userRoles.find(usr => usr.value === appConstants.defaultUserValue[0].value)]
    return
  }
  const parsedUSEROBJECTID = JSON.parse(userOBJECTID.FILTERS)

  store.userFilters = parsedUSEROBJECTID
  filterMapActivityFeed(parsedUSEROBJECTID)
  setFilterProperties(parsedUSEROBJECTID)

  return
}

export async function getUserId(){
  console.warn(`VERSION: 2.0.20 -- dev status: ${store.devStatus}`)
  const user = await esriId.getCredential(`${authen.portalUrl}/sharing/rest`,{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}

