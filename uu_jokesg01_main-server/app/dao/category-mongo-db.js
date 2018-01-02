"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class CategoryMongoDB extends UuObjectDao {
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
    await super.createIndex(
      {
        awid: 1,
        name: 1
      },
      {
        unique: true
      }
    );
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id: id });
  }

  async getByName(awid, name) {
    return await super.findOne({ awid, name });
  }

  async list(awid, pageInfo = {}) {
    return await super.find({ awid }, pageInfo);
  }

  async update(filter, uuObject) {
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async remove(awid, id) {
    return await super.deleteOne({ awid, id });
  }
}

module.exports = CategoryMongoDB;
