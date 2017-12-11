"use strict";

const AppModel = require("../models/app-model.js");

class AppController {

  init(ucEnv) {
    return AppModel.init(ucEnv.uri.awid, ucEnv.parameters);
  }

  addJokeCategory(ucEnv) {
    return AppModel.addJokeCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  removeJokeCategory(ucEnv) {
    return AppModel.removeJokeCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new AppController();
