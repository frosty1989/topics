import React from "react";
import ReactDOM from "react-dom";

import DemoSpa from "./core/demo-spa.js";

import "./index.less";

export function render(targetElementId) {
  ReactDOM.render(
    <DemoSpa />,
    document.getElementById(targetElementId)
  );
}
