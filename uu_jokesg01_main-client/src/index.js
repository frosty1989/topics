import React from "react";
import ReactDOM from "react-dom";

import Spa from "./core/spa.js";

import "./index.less";

export function render(targetElementId) {
  ReactDOM.render(<Spa />, document.getElementById(targetElementId));
}
