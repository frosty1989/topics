/* eslint-disable */
const topicCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  icon: string(40)
});

const topicGetDtoInType = shape({
  id: id().isRequired("name"),
  name: uu5String(255).isRequired("id")
});

const topicUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(255),
  icon: string(40)
});

const topicDeleteDtoInType = shape({
  id: id().isRequired(),
  forceDelete: boolean()
});

const topicListDtoInType = shape({
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
