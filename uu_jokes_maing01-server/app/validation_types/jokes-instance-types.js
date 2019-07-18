/* eslint-disable */
const jokesInstanceInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired(),
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000),
  logo: binary()
});

const setLogoDtoInType = shape({
  type: oneOf("16x9","3x2","4x3","2x3"),
  logo: binary().isRequired()
});

const jokesInstanceUpdateDtoInType = shape({
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000)
});

const getProductLogoDtoInType = shape({
  type: oneOf("16x9","3x2","4x3","2x3")
});

const getUveMetaDataDtoInType = shape({
  type: string().isRequired()
});

