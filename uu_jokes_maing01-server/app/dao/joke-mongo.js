"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");
const { DbConnection } = require("uu_appg01_datastore");

class JokeMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, topicList: 1 });
  }

  async create(uuObject) {
    if (uuObject.topicList) {
      uuObject.topicList = uuObject.topicList.map(topicId => new ObjectId(topicId));
    }
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async getCountByTopicId(awid, topicId) {
    return await super.count({
      awid,
      topicList: ObjectId.isValid(topicId) ? new ObjectId(topicId) : topicId
    });
  }

  async update(uuObject) {
    if (uuObject.topicList) {
      uuObject.topicList = uuObject.topicList.map(topicId => new ObjectId(topicId));
    }
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async updateVisibility(awid, id, visibility) {
    return await this.update({ awid, id, visibility });
  }

  async removeTopic(awid, topicId) {
    let db = await DbConnection.get(this.customUri);
    await db
      .collection(this.collectionName)
      .updateMany(
        { awid },
        { $pull: { topicList: ObjectId.isValid(topicId) ? new ObjectId(topicId) : topicId } }
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

  async listByTopicIdList(awid, topicIdList, sortBy, order, pageInfo) {
    let sort = {
      [sortBy]: order === "asc" ? 1 : -1
    };
    return await super.find(
      {
        awid,
        topicList: {
          $in: topicIdList.map(id => {
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
