import React from "react";
import * as UU5 from "uu5g04";

import Cfg from "./_config.js";

import "./welcome-row.less";


const DemoRouteDefault = React.createClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + ".WelcomeRow",
    classNames: {
      main: Cfg.CSS + "-welcome-row",
      text: Cfg.CSS + "-welcome-row-text",
      iconColumn: Cfg.CSS + "-welcome-icon-column"
    },
    defaults: {}
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    glyphicon: React.PropTypes.string,
    description: React.PropTypes.string,
    textPadding: React.PropTypes.string
  },
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
    return (
      <UU5.Bricks.Row {...this.getMainPropsToPass()}>
        <UU5.Bricks.Div>
          <UU5.Bricks.Column
            className={this.getClassName('iconColumn')}
            colWidth="xs-12 sm-2 md-2 lg-2"
          >
            <UU5.Bricks.Span className={this.props.glyphicon} />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column
            style={{paddingTop: this.props.textPadding}}
            className={this.getClassName('text')}
            colWidth="xs-12 sm-10 md-10 lg-10"
          >
            {this.props.children}
          </UU5.Bricks.Column>
        </UU5.Bricks.Div>
      </UU5.Bricks.Row>
    );
  }
  //@@viewOff:render
});

export default DemoRouteDefault;

