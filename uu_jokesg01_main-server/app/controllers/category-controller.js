"use strict";

const CategoryModel = require("../models/category-model.js");

class CategoryController {
  static create(ucEnv) {
    return CategoryModel.create(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static get(ucEnv) {
    return CategoryModel.get(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static update(ucEnv) {
    return CategoryModel.update(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = CategoryController;
