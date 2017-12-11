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
    return super.findOne({awid, id});
  }

  remove(awid, id) {
    return super.deleteOne({id, awid});
  }

  list(awid, pageInfo = {}, sort = {}) {
    return super.find({
      awid
    }, pageInfo, sort);
  }

  update(filter, uuObject) {
    return super.findOneAndUpdate(filter, uuObject, "NONE");
  }
}

module.exports = JokeMongoDB;
