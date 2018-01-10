"use strict";

const JokeModel = require("../models/joke-model.js");

class JokeController {
  createJoke(ucEnv) {
    return JokeModel.createJoke(ucEnv.uri.awid, ucEnv.parameters);
  }

  updateJoke(ucEnv) {
    return JokeModel.updateJoke(ucEnv.uri.awid, ucEnv.parameters);
  }

  deleteJoke(ucEnv) {
    return JokeModel.deleteJoke(ucEnv.uri.awid, ucEnv.parameters);
  }

  getJoke(ucEnv) {
    return JokeModel.getJoke(ucEnv.uri.awid, ucEnv.parameters);
  }

  listJokes(ucEnv) {
    return JokeModel.listJokes(ucEnv.uri.awid, ucEnv.parameters);
  }
}

module.exports = new JokeController();
