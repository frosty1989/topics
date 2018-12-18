"use strict";

const JokesInstanceAbl = require("../abl/jokes-instance-abl.js");

class JokesInstanceApi {
  static init(ucEnv) {
    return JokesInstanceAbl.init(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static load(ucEnv) {
    return JokesInstanceAbl.load(ucEnv.uri.getAwid(), ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return JokesInstanceAbl.update(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = JokesInstanceApi;
