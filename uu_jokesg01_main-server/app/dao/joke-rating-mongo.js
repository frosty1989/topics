"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeRatingMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, jokeId: 1, uuIdentity: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByJokeIdAndUuIdentity(awid, jokeId, uuIdentity) {
    return await super.findOne({ awid, jokeId, uuIdentity });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async deleteByJokeId(awid, jokeId) {
    await super.deleteMany({ awid, jokeId });
  }
}

module.exports = JokeRatingMongo;
