import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import {retsLayer} from './map-Init.js'

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
        .then((x) => console.log(x)) //already signed in
        .catch(() => signIn()) //not signed in; proceed to sign in 
}

async function signIn(){ 
  const userId = await getUserId()
  retsLayer.definitionExpression = `GIS_ANALYST = '${userId}'`
}

export async function getUserId(){
  const user = await esriId.getCredential(authen.portalUrl + "/sharing/rest",{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}