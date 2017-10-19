/**
 * Server calls of application client.
 */
import {Uri} from "uu_appg01_core"
import {Client} from "uu_appg01"
import * as UU5 from "uu5g04"

let Calls = {

  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/tid-awid/". */
  APP_BASE_URI: location.protocol + "//" + location.host + document.querySelector("base").getAttribute("data-uu-app-base"),

  call(method, url, dtoIn, headers) {
    Client[method](url, dtoIn.data || null, headers).then(
      response => dtoIn.done(response.data),
      response => dtoIn.fail(response)
    );
  },

  loadDemoContent(dtoIn) {
    let commandUri = Calls.getCommandUri("loadDemoContent");
    Calls.call("get", commandUri, dtoIn);
  },


  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/config/uu5-environment-dev.json
  for example:
   {
     "gatewayUri": "https://uuos9.plus4u.net",
     "tid": "84723877990072695",
     "awid": "b9164294f78e4cd51590010882445ae5",
     "vendor": "uu",
     "app": "demoappg01",
     "subApp": "main"
   }
   */
  getCommandUri(aUseCase) { // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    // NOTE Using string concatenation instead of UriBuilder to support also URLs
    // that don't conform to uuUri specification.
    let targetUriStr = Calls.APP_BASE_URI + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    let env = UU5.Environment;
    if (env.tid || env.awid || env.vendor || env.app) {
      let uriBuilder = Uri.UriBuilder.parse(targetUriStr);
      if (env.tid || env.awid) {
        if (env.gatewayUri) uriBuilder.gateway = env.gatewayUri;
        if (env.tid) uriBuilder.tid = env.tid;
        if (env.awid) uriBuilder.awid = env.awid;
      }
      if (env.vendor || env.app) {
        if (env.vendor) uriBuilder.vendor = env.vendor;
        if (env.app) uriBuilder.app = env.app;
        if (env.subApp) uriBuilder.subApp = env.subApp;
      }
      targetUriStr = uriBuilder.toUri().toString();
    }

    return targetUriStr;
  }

};

export default Calls;
