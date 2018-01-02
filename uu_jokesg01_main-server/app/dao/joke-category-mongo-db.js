"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeCategoryMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex(
      {
        awid: 1,
        _id: 1
      },
      {
        unique: true
      }
    );
    await super.createIndex({
      awid: 1,
      categoryId: 1
    });
    await super.createIndex({
      awid: 1,
      jokeId: 1
    });
    await super.createIndex(
      {
        awid: 1,
        jokeId: 1,
        categoryId: 1
      },
      {
        unique: true
      }
    );
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByJokeAndCategory(awid, jokeId, categoryId) {
    return await super.findOne({ awid, jokeId, categoryId });
  }

  async listByCategory(awid, categoryId) {
    //TODO: revise it after BA's anser
    // return await super.find({ awid, categoryId });
    return await super.find({
      awid: awid,
      categoryList: { $in: [categoryId] }
    });
  }

  async listByJoke(awid, jokeId) {
    return await super.find({ awid, jokeId });
  }

  async delete(awid, id) {
    return await super.deleteOne({ awid, _id: id });
  }

  async deleteByCategory(awid, categoryId) {
    return await super.deleteMany({ awid, categoryId });
  }

  async deleteByJoke(awid, jokeId) {
    return await super.deleteMany({ awid, jokeId });
  }

  async deleteByJokeAndCategory(awid, jokeId, categoryListId = []) {
    return await super.deleteMany({
      awid,
      jokeId,
      categoryId: {
        $in: categoryListId
      }
    });
  }
}

module.exports = JokeCategoryMongoDB;
