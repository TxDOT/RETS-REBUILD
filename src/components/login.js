import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { retsLayer, view, retsUserRole} from './map-Init.js'
import {getDomainValues, getDistinctAttributeValues, returnHistory, getUniqueQueryValues, queryFlags} from './utility.js'
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
  try{
    esriId.registerOAuthInfos([authen]);
    esriId.checkSignInStatus(authen.portalUrl)
      .then((x) => setDefExpRets(x.userId)) //already signed in
      .catch(() => signIn()) //not signed in; proceed to sign in 
  }
  catch(err){
    console.log(err)
  }

  // try{
  //   return setDefExpRets(getUserId.userId)
  // } 
  // catch{
  //   signIn()

  // }
    //.then((x) => setDefExpRets(x.userId)) //already signed in
    //.catch(() => signIn()) //not signed in; proceed to sign in 
}

async function signIn(){ 
  await getUniqueQueryValues(retsUserRole, appConstants.userRoles)
  const userId = await getUserId()
  await queryFlags(userId)
  store.getRetsLayer(userId)
  setDefExpRets(userId)
  appConstants.userQueryField = appConstants.queryField[appConstants.userRoles.find(x => x.value === userId).type]
  store.USER = [appConstants.userRoles.find(usr => usr.value === appConstants.defaultUserValue[0].value)]
  retsLayer
    .when(() => {

      [{name: 'JOB_TYPE', prop: "jobTypeDomainValues"},{name: 'STAT', prop: "statDomainValues"}, {name: 'DIST_NM', prop: "districtDomainValues"}, {name: 'CNTY_NM', prop: "countyDomainValues"}].forEach((layer) => {
        getDomainValues(layer.name).codedValues.forEach((x) => {
          appConstants[layer.prop].push({"name" : x.name, "value": x.code})
        })
      })
      appConstants.districtDomainValues.sort((a,b) => a.name.localeCompare(b.name))

      getDistinctAttributeValues('ACTV')
      return retsLayer.queryExtent();
    })
    .then((response) => {
      router.push('/apps/statewide_mapping/rets_rebuild/map')
      view.when(function(){
        view.goTo(response.extent)
      })
      

    });
}

const setDefExpRets = (userId) => {
  if(appConstants.defaultUserValue.length) return
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`})
  retsLayer.definitionExpression = appConstants['defaultQuery'](userId)
  return
}

export async function getUserId(){
  console.warn('VERSION: 2.1.5')
  const user = await esriId.getCredential(authen.portalUrl + "/sharing/rest",{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}