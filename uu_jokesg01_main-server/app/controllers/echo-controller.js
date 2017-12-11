"use strict";
const EchoModel = require("../models/echo-model.js");

class EchoController {
  echo(ucEnv) {
    return EchoModel.echo(ucEnv.uri.awid, ucEnv.parameters);
  }
}

module.exports = new EchoController();
