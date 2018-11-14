"use strict";

const AppModel = require("../models/jokes-instance-model.js");

class JokesInstanceController {
  init(ucEnv) {
    return AppModel.init(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = new JokesInstanceController();
