/* eslint-disable */
const jokesInstanceInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired(),
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000),
  logo: binary()
});

const jokesInstanceUpdateDtoInType = shape({
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000),
  logo: binary()
});
