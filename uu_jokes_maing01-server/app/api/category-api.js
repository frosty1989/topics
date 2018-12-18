"use strict";

const CategoryAbl = require("../abl/category-abl.js");

class CategoryApi {
  static create(ucEnv) {
    return CategoryAbl.create(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static get(ucEnv) {
    return CategoryAbl.get(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return CategoryAbl.update(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static delete(ucEnv) {
    return CategoryAbl.delete(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static list(ucEnv) {
    return CategoryAbl.list(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }
}

module.exports = CategoryApi;
