/* eslint-disable */
const newspaperCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  icon: string(40)
});

const newspaperGetDtoInType = shape({
  id: id().isRequired("name"),
  name: uu5String(255).isRequired("id")
});

const newspaperUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(255),
  icon: string(40)
});

const newspaperDeleteDtoInType = shape({
  id: id().isRequired(),
  forceDelete: boolean()
});

const newspaperListDtoInType = shape({
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
