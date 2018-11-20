"use strict";

const JokeModel = require("../models/joke-model.js");

class JokeController {
  create(ucEnv) {
    return JokeModel.create(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
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
