// filter out object values only for selected keys
function whitelistedKeys(object, ...keys) {
  let result = {};
  keys.forEach(key => {
    if (object.hasOwnProperty(key)) {
      result[key] = object[key];
    }
  });
  return result;
}

// get nested keys from object or null if any key is missing
function dig(object, ...keys) {
  let pointer = object;
  for (let key of keys) {
    if (!pointer[key]) {
      return null; // missing key, no need to continue
    }
    pointer = pointer[key];
  }
  return pointer;
}

export { whitelistedKeys, dig };
export default { whitelistedKeys };
