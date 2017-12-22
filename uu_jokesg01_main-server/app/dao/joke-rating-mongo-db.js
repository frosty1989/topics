"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeRatingMongoDB extends UuObjectDao {
  createSchema() {
    super.createIndex(
      {
        awid: 1,
        _id: 1
      },
      {
        unique: true
      }
    );
    super.createIndex({
      awid: 1,
      jokeId: 1
    });
    super.createIndex(
      {
        awid: 1,
        jokeId: 1,
        uuIdentity: 1
      },
      {
        unique: true
      }
    );
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  getByJokeAndIdentity(awid, jokeId, uuIdentity) {
    return super.findOne({
      awid,
      jokeId,
      uuIdentity
    });
  }

  update(uuObject) {
    let filter = { awid: uuObject.awid, _id: uuObject.id };

    return super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  deleteByJoke(awid, jokeId) {
    return super.deleteMany({
      awid,
      jokeId
    });
  }
}

module.exports = JokeRatingMongoDB;
