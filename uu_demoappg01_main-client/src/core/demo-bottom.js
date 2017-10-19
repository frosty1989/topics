import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Cfg from './_config.js';
import './demo-bottom.less';

export const DemoBottom = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + '.DemoBottom',
    nestingLevel: 'boxCollection',
    classNames: {
      main: Cfg.CSS + '-demo-bottom'
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
  render(){
    return (
      this.getNestingLevel()
        ? (
        <UU5.Bricks.Div {...this.getMainPropsToPass()}>
         Powered by Unicorn Application Framework
        </UU5.Bricks.Div>
      ) : null
    );
  }
  //@@viewOff:render
});

export default DemoBottom;

