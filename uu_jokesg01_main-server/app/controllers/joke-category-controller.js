"use strict";

const JokeCategoryModel = require("../models/joke-category-model.js");

class JokeCategoryController {
  addJokeCategory(ucEnv) {
    return JokeCategoryModel.addJokeCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  removeJokeCategory(ucEnv) {
    return JokeCategoryModel.removeJokeCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  listCategoryJokes(ucEnv) {
    return JokeCategoryModel.listCategoryJokes(ucEnv.uri.awid, ucEnv.parameters);
  }
}

module.exports = new JokeCategoryController();
