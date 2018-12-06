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

  static delete(ucEnv) {
    return CategoryModel.delete(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static list(ucEnv) {
    return CategoryModel.list(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = CategoryController;
