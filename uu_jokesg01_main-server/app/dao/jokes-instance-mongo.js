"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokesInstanceMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  create(jokeInstance) {
    return super.insertOne(jokeInstance);
  }

  getByAwid(awid) {
    return super.findOne({ awid });
  }

  updateByAwid(awid, jokeInstance) {
    return super.findOneAndUpdate({ awid }, jokeInstance, "NONE");
  }
}

module.exports = JokesInstanceMongo;
