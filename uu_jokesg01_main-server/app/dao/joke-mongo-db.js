"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };

    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async remove(awid, id) {
    return await super.deleteOne({ awid, id });
  }

  async list(awid, pageInfo = {}, sort = {}, order = {}) {
    return await super.find({ awid }, pageInfo, sort, order);
  }

  async listByIds(awid, jokeIds = []) {
    return await super.find({ awid, id: { $in: jokeIds } });
  }
}

module.exports = JokeMongoDB;
