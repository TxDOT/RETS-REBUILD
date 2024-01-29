import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";

export function login(){
    const authen = new OAuthInfo({
        appId: "qzqSMtBVUMsAt2Is",
        popup: false,
        expiration: 10080,
        preserveUrlHash: true,
        popupCallbackUrl: "http:localhost:5173",
        portalUrl: "https://testportal.txdot.gov/create"
    })
    
    esriId.registerOAuthInfos([authen]);
    
    console.log(authen)
    esriId.checkSignInStatus(authen.portalUrl)
        .then((x) => console.log(x))
        .catch(() => signIn(authen)) 
}


function signIn(auth){ 
    esriId.getCredential(auth.portalUrl + "/sharing/rest",{
      oAuthPopupConfirmation: false,
      authorizedCrossOriginDomains:['http://127.0.0.1:5173']
    }).then((x)=>{
      console.log(x)
    })
}
