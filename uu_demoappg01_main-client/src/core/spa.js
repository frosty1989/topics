import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import ns from "ns";

import SpaAuthenticated from "./spa-authenticated.js";
import SpaNotAuthenticated from "./spa-not-authenticated.js";
import "./spa.less";

const Spa = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.IdentityMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.tag("Spa"),
    classNames: {
      main: ns.css("-spa clear-sans")
    }
  },

  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let child;
    if (this.isAuthenticated()) {
      child = <SpaAuthenticated {...this.getMainPropsToPass()} identity={this.getIdentity()} name="authenticated" />;
    } else if (this.isNotAuthenticated()) {
      child = <SpaNotAuthenticated {...this.getMainPropsToPass()} name="notAuthenticated" />;
    } else {
      child = <Plus4U5.Bricks.Loading {...this.getMainPropsToPass()} />;
    }

    return child;
  }
  //@@viewOff:render
});

export default Spa;
