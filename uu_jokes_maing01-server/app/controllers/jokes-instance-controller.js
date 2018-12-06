"use strict";

const JokesInstanceModel = require("../models/jokes-instance-model.js");

class JokesInstanceController {
  static init(ucEnv) {
    return JokesInstanceModel.init(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static load(ucEnv) {
    return JokesInstanceModel.load(ucEnv.uri.getAwid(), ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return JokesInstanceModel.update(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = JokesInstanceController;
