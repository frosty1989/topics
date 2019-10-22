//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Uri from "../helpers/uri-helpers.js";
import { nl2br } from "../helpers/string-helper";

import {JokesConsumer} from "../core/jokes-provider.js";
import "./detail.less";
import LSI from "./detail-lsi.js";
//@@viewOff:imports

export const Detail = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Detail",
    classNames: {
      main: Config.CSS + "detail",
      rating: Config.CSS + "detail-rating",
      line: Config.CSS + "detail-line"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      text: PropTypes.string,
      averageRating: PropTypes.any,
      ratingCount: PropTypes.any,
      visibility: PropTypes.boolean,
      uuIdentityName: PropTypes.string,
      categoryList: PropTypes.array,
      image: PropTypes.string
    })
  },
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
  _getLine(icon, content) {
    return (
      <UU5.Bricks.Div className={this.getClassName("line")}>
        <UU5.Bricks.Icon icon={icon} />
        {content}
      </UU5.Bricks.Div>
    );
  },

  _buildCategoryNames(categories) {
    // for faster lookup
    let categoryIds = new Set(this.props.data.categoryList);
    return categories
      .reduce((acc, category) => {
        if (categoryIds.has(category.id)) {
          acc.push(category.name);
        }
        return acc;
      }, [])
      .join(", ");
  },

  _getImage() {
    let imageUrl = Uri.getBinaryUrl(this.props.data.image);
    return <UU5.Bricks.Image src={imageUrl} authenticate />;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {/* // Text */}
        <div>
          {// basic HTML tags are used to prevent possible uu5string from execution
          nl2br(this.props.data.text)}
        </div>
        {/* // Image */}
        {this.props.data.image && this._getImage()}
        <UU5.Bricks.Div className={this.getClassName("rating")}>
          <UU5.Bricks.Rating value={this.props.data.averageRating} />
          {/* // Rating Count */}
          {this.getLsiComponent("votes", null, this.props.data.ratingCount.toString())}
        </UU5.Bricks.Div>
        {/* // Categories */}
        <JokesConsumer>
          {({ categories }) => this._getLine("mdi-tag-multiple", this._buildCategoryNames(categories))}
        </JokesConsumer>
        {/* // Author */}
        {this._getLine("mdi-account", this.props.data.uuIdentityName)}
        {/* // Creation Date */}
        {this._getLine("mdi-calendar", <UU5.Bricks.DateTime value={this.props.data.sys.cts} dateOnly />)}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Detail;
