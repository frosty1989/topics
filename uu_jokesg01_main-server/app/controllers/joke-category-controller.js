"use strict";

const JokeCategoryModel = require("../models/joke-category-model.js");

class JokeCategoryController {
  create(ucEnv) {
    return JokeCategoryModel.addJokeCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  remove(ucEnv) {
    return JokeCategoryModel.removeJokeCategory(
      ucEnv.uri.awid,
      ucEnv.parameters
    );
  }
}

module.exports = new JokeCategoryController();
