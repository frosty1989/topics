const path = require("path");
const fs = require("fs");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const JOKES_INSTANCE_INIT = "jokesInstance/init";
const JOKES_INSTANCE_LOAD = "jokesInstance/load";
const JOKES_INSTANCE_UPDATE = "jokesInstance/update";
const JOKES_INSTANCE_SET_LOGO = "jokesInstance/setLogo";
const JOKES_INSTANCE_SET_ICONS = "jokesInstance/setIcons";
const JOKES_INSTANCE_GET_UVE_META_DATA = "jokesInstance/getUveMetaData";
const JOKE_CREATE = "joke/create";
const JOKE_GET = "joke/get";
const JOKE_UPDATE = "joke/update";
const JOKE_UPDATE_VISIBILITY = "joke/updateVisibility";
const JOKE_DELETE = "joke/delete";
const JOKE_LIST = "joke/list";
const JOKE_ADD_RATING = "joke/addRating";
const CATEGORY_CREATE = "topic/create";
const CATEGORY_GET = "topic/get";
const CATEGORY_UPDATE = "topic/update";
const CATEGORY_DELETE = "topic/delete";
const CATEGORY_LIST = "topic/list";
const MONGO_ID = "012345678910111213141516";

const getImageStream = () => {
  return fs.createReadStream(path.resolve(__dirname, "image.png"));
};

const mockDaoFactory = () => {
  // this mock ensures that all of the abl can be required
  jest.spyOn(DaoFactory, "getDao").mockImplementation(() => {
    let dao = {};
    dao.createSchema = () => {};
    return dao;
  });
};

const getSessionMock = uuIdentity => {
  let identity = {
    getUuIdentity: () => uuIdentity,
    getName: () => {}
  };
  return {
    getIdentity: () => identity
  };
};

const getAuthzResultMock = () => {
  return {
    getAuthorizedProfiles: () => []
  };
};

module.exports = {
  JOKES_INSTANCE_INIT,
  JOKES_INSTANCE_LOAD,
  JOKES_INSTANCE_UPDATE,
  JOKES_INSTANCE_SET_LOGO,
  JOKES_INSTANCE_SET_ICONS,
  JOKES_INSTANCE_GET_UVE_META_DATA,
  JOKE_CREATE,
  JOKE_GET,
  JOKE_UPDATE,
  JOKE_UPDATE_VISIBILITY,
  JOKE_DELETE,
  JOKE_LIST,
  JOKE_ADD_RATING,
  CATEGORY_CREATE,
  CATEGORY_GET,
  CATEGORY_UPDATE,
  CATEGORY_DELETE,
  CATEGORY_LIST,
  MONGO_ID,
  getImageStream,
  mockDaoFactory,
  getSessionMock,
  getAuthzResultMock
};
