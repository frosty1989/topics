/* eslint-disable */
const createBookDtoInType = shape({
  code: code().isRequired(),
  name: uu5String(4000).isRequired(),
  isbn: string(/((978[\--– ])?[0-9][0-9\--– ]{10}[\--– ][0-9xX])|((978)?[0-9]{9}[0-9Xx])/),
  desc: uu5String(16000),
  location: code()
});

const getBookDtoInType = shape({
  id: mongoId().isRequired()
});

const listBooksDtoInType = shape({
  sortBy: oneOf(["name", "author"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const deleteBookDtoInType = shape({
  id: mongoId().isRequired()
});
