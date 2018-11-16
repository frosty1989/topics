"use strict";

const UuJokesError = require("./uu-jokes-error");
const JOKES_INSTANCE_ERROR_PREFIX = `${UuJokesError.ERROR_PREFIX}jokesInstance/`;

const Init = {
  UC_CODE: `${JOKES_INSTANCE_ERROR_PREFIX}init/`,
  JokesInstanceAlreadyInitialized: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesInstanceAlreadyInitialized`;
      this.message = "JokesInstance is already initialized.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  SysSetProfileFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Create uuAppProfile failed.";
    }
  },
  CreateBinaryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uu-app-binarystore/createBinaryFailed`;
      this.message = "Create uuBinary logo failed.";
    }
  },
  JokesInstanceDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesInstanceDaoCreateFailed`;
      this.message = "Create jokesInstance by jokesInstance DAO create failed.";
    }
  }
};

const Load = {
  UC_CODE: `${JOKES_INSTANCE_ERROR_PREFIX}load/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  JokesInstanceIsUnderConstruction: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesInstanceIsUnderConstruction`;
      this.message = "JokesInstance is in state underConstruction.";
    }
  }
};

const Update = {
  UC_CODE: `${JOKES_INSTANCE_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  UuBinaryCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Creating uuBinary failed.";
    }
  },
  UuBinaryUpdateBinaryDataFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuBinaryUpdateBinaryDataFailed`;
      this.message = "Updating uuBinary data failed.";
    }
  },
  JokesInstanceDaoUpdateByAwidFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}jokesInstanceDaoUpdateByAwidFailed`;
      this.message = "Update jokesInstance by jokesInstance Dao updateByAwid failed.";
    }
  }
};

module.exports = {
  Init,
  Load,
  Update,
};
