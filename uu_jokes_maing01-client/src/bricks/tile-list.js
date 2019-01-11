//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";

import Config from "./config/config.js";

import "./tile-list.less";
//@@viewOff:imports

export const TileList = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ScreenSizeMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TileList",
    classNames: {
      main: Config.CSS + "tilelist"
    },
    opt: {
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tileRenderer: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    actions: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
    title: PropTypes.object,
    tileHeight: PropTypes.number.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      isXs: this.isXs()
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onChangeScreenSize_(actualScreenSize) {
    // only change when transfering between XS
    if (this.state.isXs && actualScreenSize !== Config.SCREEN_SIZE.XS) {
      this.setState({ isXs: false });
    } else if (!this.state.isXs && actualScreenSize === Config.SCREEN_SIZE.XS) {
      this.setState({ isXs: true });
    }
  },
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let rowSpacing = 0,
      tileElevationHover = 0;
    if (!this.state.isXs) {
      rowSpacing = 16;
      tileElevationHover = 1;
    }
    return (
      <UU5.Tiles.ListController {...this.getMainPropsToPass()} data={this.props.data} selectable={false}>
        <UU5.Tiles.ActionBar collapsible={false} title={this.props.title} actions={this.props.actions()} />
        {this.props.children}
        <UU5.Tiles.InfoBar sortItems={this.props.sortItems()} />
        <UU5.Tiles.List
          tile={this.props.tileRenderer}
          tileHeight={this.props.tileHeight}
          tileMinWidth={266} // min width instead of column definition due to inner components
          tileSpacing={16}
          tileElevationHover={tileElevationHover}
          tileBorder
          tileStyle={{ borderRadius: 4 }}
          rowSpacing={rowSpacing}
          tileJustify="space-between"
          scrollElement={window}
        />
      </UU5.Tiles.ListController>
    );
  }
  //@@viewOff:render
});

export default TileList;
