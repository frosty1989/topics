"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeCategoryMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, categoryId: 1 });
    await super.createIndex({ awid: 1, jokeId: 1 });
    await super.createIndex({ awid: 1, jokeId: 1, categoryId: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByJokeAndCategory(awid, jokeId, categoryId) {
    return await super.findOne({ awid, jokeId, categoryId });
  }

  async remove(awid, id) {
    return await super.deleteOne({ awid, id });
  }

  async deleteByCategory(awid, categoryId) {
    return await super.deleteMany({ awid, categoryId });
  }

  async deleteByJoke(awid, jokeId) {
    return await super.deleteMany({ awid, jokeId });
  }

  async deleteByJokeAndCategory(awid, jokeId, categoryId) {
    return await super.deleteOne({ awid, jokeId, categoryId });
  }

  async listByCategory(awid, categoryId) {
    return await super.find({ awid, categoryId });
  }

  async listByJoke(awid, jokeId) {
    return await super.find({ awid, jokeId });
  }
}

module.exports = JokeCategoryMongo;