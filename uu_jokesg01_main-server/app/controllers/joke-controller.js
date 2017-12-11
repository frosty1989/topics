"use strict";

const JokeModel = require("../models/app-model.js");

class JokeController {

  create(ucEnv) {
    return JokeModel.create(ucEnv.uri.awid, ucEnv.parameters);
  }

  addRating(ucEnv) {
    return JokeModel.addRating(ucEnv.uri.awid, ucEnv.parameters);
  }

  get(ucEnv) {
    return JokeModel.get(ucEnv.uri.awid, ucEnv.parameters);
  }

  list(ucEnv) {
    return JokeModel.list(ucEnv.uri.awid, ucEnv.parameters);
  }

  listByCategory(ucEnv) {
    return JokeModel.listByCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  update(ucEnv) {
    return JokeModel.update(ucEnv.uri.awid, ucEnv.parameters);
  }

  delete(ucEnv) {
    return JokeModel.delete(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new JokeController();
