"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeRatingMongoDB extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, jokeId: 1 });
    await super.createIndex(
      { awid: 1, jokeId: 1, uuIdentity: 1 },
      { unique: true }
    );
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByJokeAndIdentity(awid, jokeId, uuIdentity) {
    return await super.findOne({ awid, jokeId, uuIdentity });
  }

  async update(uuObject) {
    let filter = { awid: uuObject.awid, id: uuObject.id };

    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async deleteByJoke(awid, jokeId) {
    return await super.deleteOne({ awid, jokeId });
  }
}

module.exports = JokeRatingMongoDB;
