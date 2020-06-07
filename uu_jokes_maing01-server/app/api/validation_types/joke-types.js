/* eslint-disable */
const jokeCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  text: uu5String(4000),
  newspaperList: array(id(), 10),
  image: binary()
});

const jokeGetDtoInType = shape({
  id: id().isRequired()
});

const jokeUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(255),
  text: uu5String(4000),
  newspaperList: array(id(), 10),
  image: binary()
});

const jokeUpdateVisibilityDtoInType = shape({
  id: id().isRequired(),
  visibility: boolean().isRequired()
});

const jokeDeleteDtoInType = shape({
  id: id().isRequired()
});

const jokeListDtoInType = shape({
  sortBy: oneOf(["name", "rating"]),
  order: oneOf(["asc", "desc"]),
  newspaperList: array(id(), 10),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const jokeAddRatingDtoInType = shape({
  id: id().isRequired(),
  rating: integer(5).isRequired()
});
