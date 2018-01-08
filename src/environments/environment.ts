// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCU-oq5v8QzbkN3LHxYmyCbGoyI4GeayRw",
    authDomain: "nhcchiro123.firebaseapp.com",
    databaseURL: "https://nhcchiro123.firebaseio.com",
    projectId: "nhcchiro123",
    storageBucket: "",
    messagingSenderId: "541314828998"
    /*
    apiKey: "AIzaSyDvBEdmdt51nTMgSxnk6J-AaBL6F21OGE8",
    authDomain: "nhccpage.firebaseapp.com",
    databaseURL: "https://nhccpage.firebaseio.com",
    projectId: "nhccpage",
    storageBucket: "nhccpage.appspot.com",
    messagingSenderId: "1034156714224"*/
  }
};
//Google
//CLIENT_ID: 541314828998-m7lpp330i53uc8mj8lcmbn8be3mev6sr.apps.googleusercontent.com
//API_KEY: AIzaSyD_OPRVFpTUJ-FnkteFqiiCM2WWYTpDhJ8

/* facebook stuff
window.fbAsyncInit = function() {
  FB.init({
    appId      : '{your-app-id}',
    cookie     : true,
    xfbml      : true,
    version    : '{latest-api-version}'
  });

  FB.AppEvents.logPageView();

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 
 FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});



function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
 */