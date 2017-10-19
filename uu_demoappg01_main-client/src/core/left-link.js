import React from "react";
import createReactClass from 'create-react-class';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";


import Cfg from './_config.js';
import './left-link.less';

const LeftLink = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.CcrReaderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + '.LeftLink',
    classNames: {
      main: Cfg.CSS + '-leftlink'
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
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {this.props.children}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render

});

export default LeftLink;
