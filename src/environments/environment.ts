// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDvBEdmdt51nTMgSxnk6J-AaBL6F21OGE8",
    authDomain: "nhccpage.firebaseapp.com",
    databaseURL: "https://nhccpage.firebaseio.com",
    projectId: "nhccpage",
    storageBucket: "nhccpage.appspot.com",
    messagingSenderId: "1034156714224"
  }
};
