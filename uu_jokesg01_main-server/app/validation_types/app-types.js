/* eslint-disable */
const initDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired()
});

const addJokeCategoryDtoInType = shape({
  jokeId: mongoId().isRequired(),
  categoryList: array(code(), 10).isRequired()
});

const removeJokeCategoryDtoInType = shape({
  jokeId: mongoId().isRequired(),
  categoryList: array(code(), 10).isRequired()
});
