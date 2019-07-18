"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
const Path = require("path");
const fs = require("fs");
const Errors = require("../errors/jokes-instance-error");
const FileHelper = require("../helpers/file-helper");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  setLogoUnsupportedKeys: {
    code: `${Errors.SetLogo.UC_CODE}unsupportedKeys`
  },
  getProductLogoUnsupportedKeys: {
    code: `${Errors.GetProductLogo.UC_CODE}unsupportedKeys`
  },
  getProductLogoLogoDoesNotExists: {
    code: `${Errors.GetProductLogo.UC_CODE}logoDoesNotExists`
  },
  getUveMetaDataUnsupportedKeys: {
    code: `${Errors.GetUveMetaData.UC_CODE}unsupportedKeys`
  },
  getUveMetaDataDataDoesNotExists: {
    code: `${Errors.GetUveMetaData.UC_CODE}dataDoesNotExists`
  }
};

const DEFAULTS = {
  metaData: {
    "favicon": {
      type: "image/x-icon",
      file: "../../public/assets/meta/favicon.ico"
    },
    "favicon-16": {
      type: "image/png",
      file: "../../public/assets/meta/favicon-16x16.png",
    },
    "favicon-32": {
      type: "image/png",
      file: "../../public/assets/meta/favicon-32x32.png",
    },
    "favicon-96": {
      type: "image/png",
      file: "../../public/assets/meta/favicon-96x96.png",
    },
    "favicon-194": {
      type: "image/png",
      file: "../../public/assets/meta/favicon-194x194.png",
    },

    "manifest": {
      type: "image/png",
      file: "../../public/assets/meta/manifest.json",
    },
    "touchicon-57": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-57x57.png",
    },
    "touchicon-60": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-60x60.png",
    },
    "touchicon-2": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-72x72.png",
    },
    "touchicon-76": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-76x76.png",
    },
    "touchicon-114": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-114x114.png",
    },
    "touchicon-120": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-120x120.png",
    },
    "touchicon-144": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-144x144.png",
    },
    "touchicon-152": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-152x152.png",
    },
    "touchicon-180": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-180x180.png",
    },
    "touchicon-512": {
      type: "image/png",
      file: "../../public/assets/meta/apple-touch-icon-512x512.png",
    },

    "tilecolor": "#014ca4",
    "browserconfig": {
      type: "text/xml",
      file: "../../public/assets/meta/browserconfig.xml"
    },
    "tile-144": {
      type: "image/png",
      file: "../../public/assets/meta/mstile-144x144.png",
    },
    "tile-150": {
      type: "image/png",
      file: "../../public/assets/meta/mstile-150x150.png",
    },
    "tile-310-150": {
      type: "image/png",
      file: "../../public/assets/meta/mstile-310x150.png",
    },
    "tile-310": {
      type: "image/png",
      file: "../../public/assets/meta/mstile-310x310.png",
    },
    "safari-pinned-tab": {
      type: "image/png",
      file: "../../public/assets/meta/safari-pinned-tab.svg",
    }
  },
  name: "uuJokes",
  description: "Database of jokes in which users can create and update jokes, manage them, rate them and sort them into categories.",
  logoType: "16x9",
  ttl: 3600
};

const logger = LoggerFactory.get("UuJokes.Models.JokesInstanceModel");

const AUTHORITIES = "Authorities";
const EXECUTIVES = "Executives";
const STATE_ACTIVE = "active";
const STATE_UNDER_CONSTRUCTION = "underConstruction";
const STATE_CLOSED = "closed";

class JokesInstanceModel{
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "jokes-instance-types.js"));
    this.dao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
    // redeclare some constants, so they can be used from other models
    this.STATE_ACTIVE = STATE_ACTIVE;
    this.STATE_UNDER_CONSTRUCTION = STATE_UNDER_CONSTRUCTION;
    this.AUTHORITIES = AUTHORITIES;
    this.EXECUTIVES = EXECUTIVES;
    this.metaDataCache = {}
  }

  async init(awid, dtoIn) {
    // hds 1
    let jokeInstance = await this.dao.getByAwid(awid);
    // A1
    if (jokeInstance) {
      throw new Errors.Init.JokesInstanceAlreadyInitialized();
    }

    // hds 2
    let validationResult = this.validator.validate("jokesInstanceInitDtoInType", dtoIn);
    // A2, A3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );
    dtoIn.state = dtoIn.state || STATE_UNDER_CONSTRUCTION;
    dtoIn.name = dtoIn.name || DEFAULTS.name;
    dtoIn.awid = awid;

    // hds 3
    await Promise.all([
      this.dao.createSchema(),
      DaoFactory.getDao("joke").createSchema(),
      DaoFactory.getDao("jokeRating").createSchema(),
      DaoFactory.getDao("category").createSchema()
    ]);

    try {
      // hds 4
      await SysProfileModel.setProfile(awid, { code: AUTHORITIES, roleUri: dtoIn.uuAppProfileAuthorities });
    } catch (e) {
      // A4
      throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
    }

    // hds 5
    if (dtoIn.logo) {
      let binary;
      try {
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: DEFAULTS.logoType });
      } catch (e) {
        // A5
        throw new Errors.Init.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
      // hds 6
      dtoIn.logos = [DEFAULTS.logoType];
      delete dtoIn.logo;
    }

    // hds 7
    try {
      jokeInstance = await this.dao.create(dtoIn);
    } catch (e) {
      // A6
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.JokesInstanceDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 8
    jokeInstance.uuAppErrorMap = uuAppErrorMap;
    return jokeInstance;
  }

  async load(awid, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await this.checkInstance(
      awid,
      Errors.Load.JokesInstanceDoesNotExist,
      Errors.Load.JokesInstanceNotInProperState
    );
    // A3
    let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      jokesInstance.state === STATE_UNDER_CONSTRUCTION &&
      !authorizedProfiles.includes(AUTHORITIES) &&
      !authorizedProfiles.includes(EXECUTIVES)
    ) {
      throw new Errors.Load.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    }

    // hds 2
    jokesInstance.categoryList = (await this.categoryDao.list(awid)).itemList;

    // hds 3
    jokesInstance.authorizedProfileList = authorizedProfiles;

    // HDS 4
    return jokesInstance;
  }

  async update(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("jokesInstanceUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    let jokesInstance;
    try {
      dtoIn.awid = awid;
      jokesInstance = await this.dao.updateByAwid(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Update.JokesInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    jokesInstance.uuAppErrorMap = uuAppErrorMap;
    return jokesInstance;
  }

  async setLogo(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("setLogoDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setLogoUnsupportedKeys.code,
      Errors.SetLogo.InvalidDtoIn
    );
    
    
    //check if stream or base64  
    if (dtoIn.logo.readable) {
      //check if the stream is valid         
      let {valid: isValidStream, stream} = await FileHelper.validateImageStream(dtoIn.logo);
      if (!isValidStream) {
        throw new Errors.SetLogo.InvalidPhotoContentType({ uuAppErrorMap });
      }
      dtoIn.logo = stream;
    } else {
      //check if the base64 is valid
      let binaryBuffer = FileHelper.getBufferFromBase64UrlImage(dtoIn.logo);
      if (!FileHelper.validateImageBuffer(binaryBuffer).valid) {
        throw new Errors.SetLogo.InvalidPhotoContentType({ uuAppErrorMap });
      }
      
      dtoIn.logo = FileHelper.toStream(binaryBuffer);
    }
    
    // hds 2, hds 2.1, A3, A4
    let jokesInstance = await this.checkInstance(
      awid,
      Errors.SetLogo.JokesInstanceDoesNotExist,
      Errors.SetLogo.JokesInstanceNotInProperState
    );

    // hds 3
    let type = dtoIn.type ? dtoIn.type : DEFAULTS.logoType;
    let binary;
    if (!jokesInstance.logos || !jokesInstance.logos.includes(type)) {
      // hds 3.1
      try {
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: type });
      } catch (e) {
        // A5
        throw new Errors.SetLogo.UuBinaryCreateFailed(uuAppErrorMap, e);
      }
    } else {
      // hds 3.2
      try {
        binary = await UuBinaryModel.updateBinaryData(awid, { data: dtoIn.logo, code: type, revisionStrategy: "NONE" });
      } catch (e) {
        // A6
        throw new Errors.SetLogo.UuBinaryUpdateBinaryDataFailed(uuAppErrorMap, e);
      }
    }

    // hds 4
    if (!jokesInstance.logos) jokesInstance.logos = [];
    jokesInstance.logos.push(type);
    jokesInstance.awid = awid;

    try {
      jokesInstance = await this.dao.updateByAwid(jokesInstance);
    } catch (e) {
      if (e instanceof ObjectStoreError) { // A7
        throw new Errors.SetLogo.JokesInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 5
    jokesInstance.uuAppErrorMap = uuAppErrorMap;
    return jokesInstance;
  }

  async getProductInfo(awid) {
    // hds 1
    let jokesInstance = await this.dao.getByAwid(awid);
    // hds 2
    return {
      name: jokesInstance ? jokesInstance.name : DEFAULTS.name,
      uuAppErrorMap: {}
    };
  }

  async getProductLogo(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("getProductLogoDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getProductLogoUnsupportedKeys.code,
      Errors.GetProductLogo.InvalidDtoIn
    );

    // hds 2
    let type = dtoIn.type ? dtoIn.type : DEFAULTS.logoType;
    let dtoOut = {};
    let jokesInstance = await this.dao.getByAwid(awid);
    if (jokesInstance && jokesInstance.logos && jokesInstance.logos.includes(type)) {
      try {
        dtoOut = await UuBinaryModel.getBinaryData(awid, { code: type });
      } catch (e) {
        // A3
        if (logger.isWarnLoggable()) {
          logger.warn(`Unable to load uuBinary logo ${type} for jokes instance ${awid}. Error: ${e} `);
        }
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.getProductLogoLogoDoesNotExists.code,
          {
            type: type
          }
        );
      }
    }

    // hds 2.1
    if (!dtoOut.stream) {
      let filePath = Path.resolve(__dirname, `../../public/assets/logos/${type}.png`);
      dtoOut.contentType = "image/png";
      dtoOut.stream = fs.createReadStream(filePath);
    }

    // hds 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }


  async getUveMetaData(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("getUveMetaDataDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUveMetaDataUnsupportedKeys.code,
      Errors.GetUveMetaData.InvalidDtoIn
    );

    // hds 2
    let now = Date.now();
    let dtoOut = {};
    let uveMetaData;
    if (this.metaDataCache[awid] && now - this.metaDataCache[awid].ttl <= DEFAULTS.ttl) {
      uveMetaData = this.metaDataCache[awid];
    } else {
      let jokesInstance = await this.dao.getByAwid(awid);
      uveMetaData = jokesInstance.uveMetaData ? jokesInstance.uveMetaData : {};
      this.metaDataCache[awid] = uveMetaData;
      this.metaDataCache[awid].ttl = now;
    }

    if (uveMetaData && uveMetaData[dtoIn.type]) {
      try {
        dtoOut = await UuBinaryModel.getBinaryData(awid, { code: jokesInstance.uveMetaData[dtoIn.type] });
      } catch (e) {
        // A3
        if (logger.isWarnLoggable()) {
          logger.warn(`Unable to load uuBinary meta data ${type} for jokes instance ${awid}. Error: ${e} `);
        }
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.getUveMetaDataDataDoesNotExists.code,
          {
            type: type
          }
        );
      }
    }

    // hds 2.1
    if (!dtoOut.stream) {
      let filePath = Path.resolve(__dirname, DEFAULTS.metaData[dtoIn.type].file);
      dtoOut.contentType = DEFAULTS.metaData[dtoIn.type].type;
      dtoOut.stream = fs.createReadStream(filePath);
    }

    // hds 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }


  async getIndex(awid, uri) {

    let readFilePromise = new Promise((resolve, reject) => {
      return fs.readFile(Path.resolve(`./public/index.html`), "utf8", (err, contents) => {
        if (err) throw new Errors.GetIndex.UnableToReadHtmlFile(err);
        resolve(contents);
      });
    });


    let indexHtml = await readFilePromise;


    let now = Date.now();
    let uveMetaData;
    if (this.metaDataCache[awid] && now - this.metaDataCache[awid].ttl <= DEFAULTS.ttl) {
      uveMetaData = this.metaDataCache[awid];
    } else {
      let jokesInstance = await this.dao.getByAwid(awid);
      uveMetaData = (jokesInstance && jokesInstance.uveMetaData) ? jokesInstance.uveMetaData : {};
      uveMetaData.name = jokesInstance ? jokesInstance.name : DEFAULTS.name;
      uveMetaData.description = (jokesInstance && jokesInstance.description) ? jokesInstance.description : DEFAULTS.description;
      this.metaDataCache[awid] = uveMetaData;
      this.metaDataCache[awid].ttl = now;
    }

    let metatags = `
    <title>${uveMetaData.name}</title>
    <meta name="description" content="${uveMetaData.description}" />
    <meta property="og:title" content="${uveMetaData.name}" />
    <meta property="og:image" content="${uri.getBaseUri()}/getProductLogo?type=${DEFAULTS.logoType}" />
    <meta property="og:image:type" content="image/jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:description" content="${uveMetaData.description}" />
    <meta property="og:url" content="${uri.getBaseUri()}/" />
    
    <link rel="icon" href="${uri.getBaseUri()}/getUveMetaData?type=favicon-32"/>
    <link rel="icon" type="image/png" sizes="16x16" href="${uri.getBaseUri()}/getUveMetaData?type=favicon-16"/>
    <link rel="icon" type="image/png" sizes="32x32" href="${uri.getBaseUri()}/getUveMetaData?type=favicon-32"/>
    <link rel="icon" type="image/png" sizes="96x96" href="${uri.getBaseUri()}/getUveMetaData?type=favicon-96"/>
    <link rel="icon" type="image/png" sizes="194x194" href="${uri.getBaseUri()}/getUveMetaData?type=favicon-194"/>
    
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="${uveMetaData.name}">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <link rel="manifest" href="${uri.getBaseUri()}/getUveMetaData?type=manifest"/>
    
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-57"/>
    <link rel="apple-touch-icon-precomposed" sizes="60x60" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-60"/>
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-72"/>
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-76"/>
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-114"/>
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-120"/>
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-144"/>
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-152"/>
    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-180"/>
    <link rel="apple-touch-icon-precomposed" sizes="512x512" href="${uri.getBaseUri()}/getUveMetaData?type=touchicon-512"/>
    
    <meta name="application-name" content="${uveMetaData.name}">
    <meta name="msapplication-TileColor" content="${uveMetaData["tilecolor"] ? uveMetaData["tilecolor"] : DEFAULTS.metaData["tilecolor"]}"/>
    <meta name="msapplication-config" content="${uri.getBaseUri()}/getUveMetaData?type=browserconfig"/>
    
    <link rel="mask-icon" href="${uri.getBaseUri()}/getUveMetaData?type=safari-pinned-tab" color="#d81e05"/>
    `;

    indexHtml = indexHtml.replace("<meta name=\"uuapp-meta-template\">", metatags);

    return indexHtml;
  }

  /**
   * Checks whether jokes instance exists and that it is not in closed state.
   * @param {String} awid Used awid
   * @param {Error} notExistError Error thrown when jokes instance does not exist
   * @param {Error} closedStateError Error thrown when jokes instance is in closed state
   * @returns {Promise<{}>} jokes instance
   */
  async checkInstance(awid, notExistError, closedStateError) {
    let jokesInstance = await this.dao.getByAwid(awid);
    if (!jokesInstance) {
      throw new notExistError();
    }
    if (jokesInstance.state === STATE_CLOSED) {
      throw new closedStateError(
        {},
        {
          state: jokesInstance.state,
          expectedStateList: [STATE_ACTIVE, STATE_UNDER_CONSTRUCTION]
        }
      );
    }
    return jokesInstance;
  }
  
  
}

module.exports = new JokesInstanceModel();
