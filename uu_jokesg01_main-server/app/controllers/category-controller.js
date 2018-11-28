"use strict";

const CategoryModel = require("../models/category-model.js");

class CategoryController {
  create(ucEnv) {
    return CategoryModel.create(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  get(ucEnv) {
    return CategoryModel.get(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = new CategoryController();
