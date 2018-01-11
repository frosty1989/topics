"use strict";

const UuJokesError = require("./uu-jokes-error");

const CreateCategory = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}createCategory/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${CreateCategory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CategoryNameNotUnique: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${CreateCategory.UC_CODE}categoryNameNotUnique`;
      this.message = "Category name is not unique in awid.";
    }
  },
  CategoryDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${CreateCategory.UC_CODE}categoryDaoCreateFailed`;
      this.message = "Create category by category Dao create failed.";
    }
  }
};

const ListCategories = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}listCategories/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${ListCategories.code}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CategoryDaoListFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${ListCategories.UC_CODE}categoryDaoListFailed`;
      this.message = "List categories by category Dao list failed.";
    }
  }
};

const DeleteCategory = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}deleteCategory/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteCategory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeCategoryDaoListByCategoryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteCategory.UC_CODE}jokeCategoryDaoListByCategoryFailed`;
      this.message = "List jokeCategory by Dao listByCategory failed.";
    }
  },
  RelatedJokesExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteCategory.UC_CODE}relatedJokesExist`;
      this.message = "Category is not empty.";
    }
  },
  JokeCategoryDaoDeleteByCategoryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteCategory.UC_CODE}jokeCategoryDaoDeleteByCategoryFailed`;
      this.message = "Delete jokeCategory by Dao deleteByCategory failed.";
    }
  },
  CategoryDaoDeleteFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteCategory.UC_CODE}categoryDaoDeleteFailed`;
      this.message = "Delete category by Dao delete failed.";
    }
  }
};

const UpdateCategory = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}updateCategory/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateCategory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  CategoryNameNotUnique: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateCategory.UC_CODE}categoryNameNotUnique`;
      this.message = "Category name is not unique in awid.";
    }
  },
  CategoryDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateCategory.UC_CODE}categoryDaoUpdateFailed`;
      this.message = "Update category by category Dao update failed.";
    }
  }
};

module.exports = {
  CreateCategory,
  ListCategories,
  DeleteCategory,
  UpdateCategory
};
