import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import { retsLayer} from './map-Init.js'
import { view } from "./map-Init.js";
import Home from "@arcgis/core/widgets/Home.js";



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
    .then((x) => console.log(x)) //already signed in
    .catch(() => signIn()) //not signed in; proceed to sign in 
}

async function signIn(){ 
  const userId = await getUserId()
  retsLayer.definitionExpression = `(GIS_ANALYST = '${userId}')  AND (STAT = 1 OR STAT = 2 OR STAT = 3)`
  //`(GIS_ANALYST = '') AND (STAT = 1 OR STAT = 2)`
  retsLayer, view
    .when(() => {
      return retsLayer.queryExtent();
    })
    .then((response) => {
      view.goTo(response.extent);
      
    });
  

}

export async function getUserId(){
  const user = await esriId.getCredential(authen.portalUrl + "/sharing/rest",{
    oAuthPopupConfirmation: false,
  })

  return user.userId
}

