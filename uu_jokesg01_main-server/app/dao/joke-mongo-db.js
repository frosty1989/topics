"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");

class JokeMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ _id: id, awid: awid });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };

    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async remove(awid, id) {
    return await super.deleteOne({ awid, id });
  }

  async list(awid, pageInfo = {}, sortBy = {}, order = {}) {
    return await super.find({ awid }, pageInfo, sortBy, order);
  }

  async listByIds(awid, jokeIds = []) {
    return await super.find({ awid, _id: { $in: jokeIds.map(x => new ObjectId(x)) }});
  }
}

module.exports = JokeMongoDB;
