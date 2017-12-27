const addJokeCategoryDtoInType = shape({
  jokeId: mongoId().isRequired(),
  categoryList: array(mongoId(), 10).isRequired()
});

const removeJokeCategoryDtoInType = shape({
  jokeId: mongoId().isRequired(),
  categoryList: array(mongoId(), 10).isRequired()
});
