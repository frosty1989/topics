function isFunction(func) {
  return typeof func === "function";
}

function ensureFunction(func) {
  if (isFunction(func)) {
    return func;
  } else {
    return nullFunction;
  }
}

// noop function just to be "type safe"
function nullFunction() {}

export { isFunction, ensureFunction, nullFunction };
