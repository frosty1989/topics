/* eslint-disable */
const jokeCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  text: uu5String(4000),
  categoryList: array(id(), 10),
  image: binary()
});

const getJokeDtoInType = shape({
  id: mongoId().isRequired()
});

const listJokesDtoInType = shape({
  sortBy: oneOf(["name", "rating"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const updateJokeDtoInType = shape({
  id: mongoId().isRequired(),
  name: uu5String(255),
  text: uu5String(4000)
});

const deleteJokeDtoInType = shape({
  id: mongoId().isRequired()
});
