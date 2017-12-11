/* eslint-disable */
const createImageDtoInType = shape({
  code: code(),
  name: uu5String(255),
  description: uu5String(4000),
  filename: string(255),
  contentType: string(256),
  data: binary().isRequired()
});

const getImageDtoInType = shape({
  code: code().isRequired(),
  contentDisposition: oneOf(["inline","attachment"])
})
