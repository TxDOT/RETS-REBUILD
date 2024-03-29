import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { retsLayer} from './map-Init.js'
import { view } from "./map-Init.js";
import {getDomainValues, getDistinctAttributeValues} from './utility.js'
import { appConstants } from "../common/constant.js";

const authen = new OAuthInfo({
  appId: "qzqSMtBVUMsAt2Is",
  popup: false,
  expiration: 10080,
  preserveUrlHash: true,
  portalUrl: "https://testportal.txdot.gov/create"
})

export function login(){
  esriId.registerOAuthInfos([authen]);

  esriId.checkSignInStatus(authen.portalUrl)
    .then((x) => setDefExpRets(x.userId)) //already signed in
    .catch(() => signIn()) //not signed in; proceed to sign in 
}

async function signIn(){ 
  const userId = await getUserId()
  setDefExpRets(userId)
  retsLayer
    .when(() => {

      [{name: 'JOB_TYPE', prop: "jobTypeDomainValues"},{name: 'STAT', prop: "statDomainValues"}, {name: 'DIST_NM', prop: "districtDomainValues"}, {name: 'CNTY_NM', prop: "countyDomainValues"}].forEach((layer) => {
        getDomainValues(layer.name).codedValues.forEach((x) => {
          appConstants[layer.prop].push({"name" : x.name, "value": x.code})
        })
      })
      getDistinctAttributeValues('ACTV')
      return retsLayer.queryExtent();
    })
    .then((response) => {
      view.goTo(response.extent);
    });
}

const setDefExpRets = (userId) => {
  if(appConstants.defaultUserValue.length) return
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`})
  retsLayer.definitionExpression = `(GIS_ANALYST = '${userId}') AND (STAT = 1 OR STAT = 2 OR STAT = 4)`
  return
}

export async function getUserId(){
  const user = await esriId.getCredential(authen.portalUrl + "/sharing/rest",{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}

