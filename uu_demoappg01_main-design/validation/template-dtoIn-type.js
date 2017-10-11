const templateDtoInType = shape({
    code: string(/[a-z,A-Z,0-9,_]{3,64}/).isRequired(),
    state: oneOf(["open","closed","tested"]).isRequired
}).isRequired