"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class CategoryMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, name: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async getByName(awid, name) {
    return await super.findOne({ awid, name });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, pageInfo) {
    return await super.find({ awid }, pageInfo);
  }

  async listBycategoryIdList(awid, categoryIdList, pageInfo) {
    return await super.find({ awid, id: { $in: categoryIdList } }, pageInfo);
  }
}

module.exports = CategoryMongo;
