/* eslint-disable */
const createCategoryDtoInType = shape({
  name: uu5String(255).isRequired(),
  desc: uu5String(4000),
  glyphicon: uri()
});

const listCategoriesDtoInType = shape({
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const updateCategoryDtoInType = shape({
  id: mongoId().isRequired(),
  name: uu5String(255),
  desc: uu5String(4000),
  glyphicon: uri()
});

const deleteCategoryDtoInType = shape({
  id: mongoId().isRequired(),
  forceDelete: boolean()
});
