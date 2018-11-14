"use strict";

const JokesInstanceModel = require("../models/jokes-instance-model.js");

class JokesInstanceController {
  init(ucEnv) {
    return JokesInstanceModel.init(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  load(ucEnv){
    return JokesInstanceModel.load(ucEnv.uri.getAwid(), ucEnv.getAuthorizationResult());
  }
}

module.exports = new JokesInstanceController();
