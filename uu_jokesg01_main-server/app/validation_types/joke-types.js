/* eslint-disable */
const jokeCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  text: uu5String(4000),
  categoryList: array(id(), 10),
  image: binary()
});

const jokeGetDtoInType = shape({
  id: id().isRequired()
});

const jokeUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(255),
  text: uu5String(4000),
  categoryList: array(id(), 10),
  image: binary()
});

const jokeUpdateVisibilityDtoInType = shape({
  id: id().isRequired(),
  visibility: boolean().isRequired()
});
