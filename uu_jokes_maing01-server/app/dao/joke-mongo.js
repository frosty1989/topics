"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");
const { DbConnection } = require("uu_appg01_datastore");

class JokeMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, newspaperList: 1 });
  }

  async create(uuObject) {
    if (uuObject.newspaperList) {
      uuObject.newspaperList = uuObject.newspaperList.map(newspaperId => new ObjectId(newspaperId));
    }
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async getCountByNewspaperId(awid, newspaperId) {
    return await super.count({
      awid,
      newspaperList: ObjectId.isValid(newspaperId) ? new ObjectId(newspaperId) : newspaperId
    });
  }

  async update(uuObject) {
    if (uuObject.newspaperList) {
      uuObject.newspaperList = uuObject.newspaperList.map(newspaperId => new ObjectId(newspaperId));
    }
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async updateVisibility(awid, id, visibility) {
    return await this.update({ awid, id, visibility });
  }

  async removeNewspaper(awid, newspaperId) {
    let db = await DbConnection.get(this.customUri);
    await db
      .collection(this.collectionName)
      .updateMany(
        { awid },
        { $pull: { newspaperList: ObjectId.isValid(newspaperId) ? new ObjectId(newspaperId) : newspaperId } }
      );
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, sortBy, order, pageInfo) {
    let sort = {
      [sortBy]: order === "asc" ? 1 : -1
    };
    return await super.find({ awid }, pageInfo, sort);
  }

  async listByNewspaperIdList(awid, newspaperIdList, sortBy, order, pageInfo) {
    let sort = {
      [sortBy]: order === "asc" ? 1 : -1
    };
    return await super.find(
      {
        awid,
        newspaperList: {
          $in: newspaperIdList.map(id => {
            if (!ObjectId.isValid(id)) return id;
            return new ObjectId(id);
          })
        }
      },
      pageInfo,
      sort
    );
  }
}

module.exports = JokeMongo;
