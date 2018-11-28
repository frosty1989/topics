/* eslint-disable */
const categoryCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  icon: string(40)
});

const categoryGetDtoInType = shape({
  id: id().isRequired("name"),
  name: uu5String(255).isRequired("id")
});
