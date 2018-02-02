"use strict";

const JokeModel = require("../models/joke-model.js");

class JokeController {
  createJoke(ucEnv) {
    return JokeModel.createJoke(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  updateJoke(ucEnv) {
    return JokeModel.updateJoke(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  deleteJoke(ucEnv) {
    return JokeModel.deleteJoke(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  getJoke(ucEnv) {
    return JokeModel.getJoke(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  listJokes(ucEnv) {
    return JokeModel.listJokes(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = new JokeController();
