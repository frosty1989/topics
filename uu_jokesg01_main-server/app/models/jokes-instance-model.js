"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
const { UseCaseError } = require("uu_appg01_core-appserver");
const Path = require("path");
const Errors = require("../errors/jokes-instance-error");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  }
};

class JokesInstanceModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "jokes-instance-types.js"));
    this.dao = DaoFactory.getDao("jokesInstance");
    this.DEFAULT_STATE = "underConstruction";
    this.DEFAULT_NAME = "uuJokes";
  }

  async init(awid, dtoIn) {
    //HDS 1
    let jokeInstance = await this.dao.getByAwid(awid);
    //A1
    if (jokeInstance) {
      throw new Errors.Init.JokesInstanceAlreadyInitialized({});
    }

    //HDS 2
    let validationResult = this.validator.validate("jokesInstanceInitDtoInType", dtoIn);
    //A2, A3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );
    dtoIn.state = dtoIn.state || this.DEFAULT_STATE;
    dtoIn.name = dtoIn.name || this.DEFAULT_NAME;
    dtoIn.awid = awid;

    //HDS 3
    await Promise.all([
      this.dao.createSchema(),
      DaoFactory.getDao("joke").createSchema(),
      DaoFactory.getDao("jokeRating").createSchema(),
      DaoFactory.getDao("category").createSchema()
    ]);

    let stuff;
    try {
      //HDS 4
      stuff = await SysProfileModel.setProfile(awid, { code: "Authorities", roleUri: dtoIn.uuAppProfileAuthorities });
    } catch (e) {
      //A4
      if (e instanceof UseCaseError) {
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
      }
      throw e;
    }

    //HDS 5
    if (dtoIn.logo) {
      let binary;
      try {
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: "logo" });
      } catch (e) {
        //A5
        if (e instanceof UseCaseError) {
          throw new Errors.Init.CreateBinaryFailed({ uuAppErrorMap }, {}, e);
        }
        throw e;
      }
      //HDS 6
      dtoIn.logo = binary.code;
    }

    //HDS 7
    try {
      jokeInstance = await this.dao.create(dtoIn);
    } catch (e) {
      //A6
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.JokesInstanceDaoCreateFailed({ uuAppErrorMap }, {}, e);
      }
      throw e;
    }

    //HDS 8
    jokeInstance.uuAppErrorMap = uuAppErrorMap;
    return jokeInstance;
  }
}

module.exports = new JokesInstanceModel();
