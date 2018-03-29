"use strict";

const JokeCategoryModel = require("../models/joke-category-model.js");

class JokeCategoryController {
  addJokeCategory(ucEnv) {
    return JokeCategoryModel.addJokeCategory(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  removeJokeCategory(ucEnv) {
    return JokeCategoryModel.removeJokeCategory(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  listCategoryJokes(ucEnv) {
    return JokeCategoryModel.listCategoryJokes(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = new JokeCategoryController();
