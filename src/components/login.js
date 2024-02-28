import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import {retsLayer} from './map-Init.js'
import { view } from "./map-Init.js";
import {getDomainValues} from './utility.js'
import { appConstants } from "../common/constant.js";


const authen = new OAuthInfo({
  appId: "qzqSMtBVUMsAt2Is",
  popup: false,
  expiration: 10080,
  preserveUrlHash: true,
  popupCallbackUrl: "http://l-ds755x3.dot.state.tx.us:5173",
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
  //`(GIS_ANALYST = '') AND (STAT = 1 OR STAT = 2)`
  retsLayer
    .when(() => {

      [{name: 'STAT', prop: "statDomainValues"}, {name: 'DIST_NM', prop: "districtDomainValues"}, {name: 'CNTY_NM', prop: "countyDomainValues"}].forEach((layer) => {
        getDomainValues(layer.name).codedValues.forEach((x) => {
          appConstants[layer.prop].push({"name" : x.name, "value": x.code})
        })
      })
  
      return retsLayer.queryExtent();
    })
    .then((response) => {
      view.goTo(response.extent);
    });
}

const setDefExpRets = (userId) => {
  appConstants.defaultUserValue.push({"name": "Username", "value": `${userId}`})
  retsLayer.definitionExpression = `(GIS_ANALYST = '${userId}') AND (STAT = 1 OR STAT = 2)`
}

export async function getUserId(){
  const user = await esriId.getCredential(authen.portalUrl + "/sharing/rest",{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}











// import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
// import esriId from "@arcgis/core/identity/IdentityManager.js";
// import { retsLayer } from "./map-Init";

// export function login(){
//     const authen = new OAuthInfo({
//         appId: "qzqSMtBVUMsAt2Is",
//         popup: false,
//         expiration: 10080,
//         preserveUrlHash: true,
//         popupCallbackUrl: "http://l-ds755x3.dot.state.tx.us:5173/",//"http:localhost:5173",
//         portalUrl: "https://testportal.txdot.gov/create"
//     })
    
//     esriId.registerOAuthInfos([authen]);
    
//     console.log(authen)
//     esriId.checkSignInStatus(authen.portalUrl)
//         .then((x) => console.log(x))
//         .catch(() => signIn(authen)) 




// }


// function signIn(auth){ 
//     esriId.getCredential(auth.portalUrl + "/sharing/rest",{
//       oAuthPopupConfirmation: false,
//       authorizedCrossOriginDomains:['http://127.0.0.1:5173']
//     }).then((x)=>{
//       console.log(x.userId)
//       retsLayer.definitionExpression = `GIS_ANALYST = 'DPROSACK'`
//       retsLayer.minScale = 200
//     })
// }


