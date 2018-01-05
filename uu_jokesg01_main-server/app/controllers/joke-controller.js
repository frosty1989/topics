"use strict";

const JokeModel = require("../models/joke-model.js");

class JokeController {
  create(ucEnv) {
    return JokeModel.create(ucEnv.uri.awid, ucEnv.parameters);
  }

  update(ucEnv) {
    return JokeModel.update(ucEnv.uri.awid, ucEnv.parameters);
  }

  remove(ucEnv) {
    return JokeModel.remove(ucEnv.uri.awid, ucEnv.parameters);
  }

  get(ucEnv) {
    return JokeModel.get(ucEnv.uri.awid, ucEnv.parameters);
  }

  list(ucEnv) {
    return JokeModel.list(ucEnv.uri.awid, ucEnv.parameters);
  }
}

module.exports = new JokeController();
