"use strict";

const JokeModel = require("../models/joke-model.js");

class JokeController {

  create(ucEnv) {
    return JokeModel.createJoke(ucEnv.uri.awid, ucEnv.parameters);
  }

  addRating(ucEnv) {
    return JokeModel.addRating(ucEnv.uri.awid, ucEnv.parameters);
  }

  get(ucEnv) {
    return JokeModel.getJoke(ucEnv.uri.awid, ucEnv.parameters);
  }

  list(ucEnv) {
    return JokeModel.listJokes(ucEnv.uri.awid, ucEnv.parameters);
  }

  listCategoryJokes(ucEnv) {
    return JokeModel.listCategoryJokes(ucEnv.uri.awid, ucEnv.parameters);
  }

  update(ucEnv) {
    return JokeModel.update(ucEnv.uri.awid, ucEnv.parameters);
  }

  delete(ucEnv) {
    return JokeModel.delete(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new JokeController();
