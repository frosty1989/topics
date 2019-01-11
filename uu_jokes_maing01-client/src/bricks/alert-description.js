//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";

import "./alert-description.less";
//@@viewOff:imports

export const AlertDescription = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.SectionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AlertDescription",
    classNames: {
      main: Config.CSS + "alertdescription"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _wrapInParagraph(content) {
    let child;
    if (content) {
      child = <UU5.Bricks.P>{content}</UU5.Bricks.P>;
    } else {
      child = <UU5.Bricks.Null />;
    }
    return child;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Section
        {...this.getMainPropsToPass()}
        header={this.props.header}
        content={this._wrapInParagraph(this.getContent())}
        level={3}
      />
    );
  }
  //@@viewOff:render
});

export default AlertDescription;
