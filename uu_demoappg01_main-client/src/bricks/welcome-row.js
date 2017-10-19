import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Cfg from "./_config.js";

import "./welcome-row.less";


const DemoRouteDefault = createReactClass({

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
    glyphicon: PropTypes.string,
    description: PropTypes.string,
    textPadding: PropTypes.string
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
          <UU5.Bricks.Column
            className={this.getClassName('iconColumn')}
            colWidth="xs12 s12 m2 l2 xl2"
          >
            <UU5.Bricks.Span className={this.props.glyphicon} />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column
            style={{paddingTop: this.props.textPadding}}
            className={this.getClassName('text')}
            colWidth="xs12 s12 m10 l10 xl10"
          >
            {this.props.children}
          </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
  }
  //@@viewOff:render
});

export default DemoRouteDefault;

