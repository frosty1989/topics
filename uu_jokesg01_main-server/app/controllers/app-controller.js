"use strict";

const AppModel = require("../models/app-model.js");

class AppController {
  init() {
    return AppModel.init();
  }
}

module.exports = new AppController();
