"use strict";
const {UuObjectDao} = require("uu_appg01_server").ObjectStore;

class JokeMongoDB extends UuObjectDao {
  createSchema() {
    super.createIndex({
      awid: 1,
      _id: 1
    }, {unique: true});
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  get(awid, id) {
    return super.findOne({ awid, _id: id });
  }

  update(uuObject) {
    let filter = { awid: uuObject.awid, _id: uuObject.id };

    return super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  delete(awid, id) {
    return super.deleteOne({ awid, _id: id });
  }

  list(awid, pageInfo = {}, sort = {}) {
    return super.find({
      awid
    }, pageInfo, sort);
  }

  listByIds(awid, jokeIds = []) {
    return super.find({
      awid,
      _id: {
        $in: jokeIds
      }
    })
  }
}

module.exports = JokeMongoDB;
