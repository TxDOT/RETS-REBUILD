import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { retsLayer, view, retsUserRole, retsRole} from './map-Init.js'
import {getDomainValues, getDistinctAttributeValues, getUniqueQueryValues, queryFlags, getRetsLayerView, getHistoryView, getTxDotRdWayLayerView, home} from './utility.js'
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
  if (store.savedFilter){ //update the feed 
    store.getRetsLayer(userId, store.savedFilter, "retsLayer", "EDIT_DT DESC, PRIO")

  }
  else{
    store.getRetsLayer(userId, appConstants['defaultQuery'](userId), "retsLayer", "EDIT_DT DESC, PRIO")

  }
  appConstants.userQueryField = appConstants.queryField[appConstants.userRoles.find(x => x.value === userId).type]
  store.USER = [appConstants.userRoles.find(usr => usr.value === appConstants.defaultUserValue[0].value)]
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


export function getFields (){ //function to extract the last filter (if available) from the FILTERS field
  
  const query = retsRole.createQuery();
  setTimeout(() => {
    query.where = `USERNAME = '${store.loggedInUser}'`;

  }, 1000);
  query.returnGeometry = false; 
  query.outFields = ['FILTERS'];  

  return retsRole.queryFeatures(query)
    .then((result) => {
      if (result.features.length > 0) {

        const filtersString = result.features[0].attributes.FILTERS;

      const filtersArray = filtersString.split(',');
      store.lastQuery = filtersArray[filtersArray.length - 1].trim();  

      return store.lastQuery;
      } else {
        console.log('No FILTERS found');
        return false;  
      }
    })
    .catch((error) => {
      console.error('Error querying the feature layer:', error);
      return false;
    });
}
const setDefExpRets = async (userId) => {
  if(appConstants.defaultUserValue.length) return
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`})
  store.savedFilter = await getFields()

  //retsLayer.definitionExpression = store.savedFilter = appConstants['defaultQuery'](userId)
  if (store.savedFilter) {
    retsLayer.definitionExpression = store.savedFilter;
  } else {
    retsLayer.definitionExpression = appConstants['defaultQuery'](userId);
  }
  return
}

export async function getUserId(){
  console.warn(`VERSION: 2.0.15 -- dev status: ${store.devStatus}`)
  const user = await esriId.getCredential(`${authen.portalUrl}/sharing/rest`,{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}