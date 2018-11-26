"use strict";

const JokeModel = require("../models/joke-model.js");

class JokeController {
  create(ucEnv) {
    return JokeModel.create(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  get(ucEnv) {
    return JokeModel.get(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  update(ucEnv) {
    return JokeModel.update(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  updateVisibility(ucEnv) {
    return JokeModel.updateVisibility(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  delete(ucEnv) {
    return JokeModel.delete(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }
}

module.exports = new JokeController();
