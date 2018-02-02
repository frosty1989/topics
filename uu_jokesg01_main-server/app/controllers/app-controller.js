"use strict";

const AppModel = require("../models/app-model.js");

class AppController {
  init(ucEnv) {
    return AppModel.init(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = new AppController();
