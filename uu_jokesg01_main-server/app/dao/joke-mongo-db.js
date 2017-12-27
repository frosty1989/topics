"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex(
      {
        awid: 1,
        _id: 1
      },
      { unique: true }
    );
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, _id: id });
  }

  async update(filter, uuObject) {
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async remove(awid, id) {
    return await super.deleteOne({ awid, id: id });
  }

  async list(awid, pageInfo = {}, sort = {}) {
    return await super.find(
      {
        awid
      },
      pageInfo,
      sort
    );
  }

  async listCategoryJokes(awid, id) {
    return await super.find({
      awid,
      id: id
    });;
  }

  async listByIds(awid, jokeIds = []) {
    return await super.find({
      awid,
      _id: {
        $in: jokeIds
      }
    });
  }
}

module.exports = JokeMongoDB;
