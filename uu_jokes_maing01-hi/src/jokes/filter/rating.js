//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import "./rating.less";
import LSI from "./rating-lsi.js";
//@@viewOff:imports

//@@viewOn:statics
const COMPARATOR_MAP = {
  1: "=",
  2: "&gt;=",
  3: "&gt;",
  4: "&lt;=",
  5: "&lt;"
};
//@@viewOff:statics

export const Rating = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Rating",
    classNames: {
      main: Config.CSS + "rating"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    addFilter: UU5.PropTypes.func.isRequired,
    getValues: UU5.PropTypes.func.isRequired,
    filters: UU5.PropTypes.array.isRequired,
    values: UU5.PropTypes.object
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
  _handleSubmit(rating) {
    let values = this.props.getValues();
    let usedFilter = this.props.filters.find(filter => filter.key === values.type);

    this.props.addFilter(
      values.type,
      this.getLsiComponent("rating", null, `${COMPARATOR_MAP[values.compare]} ${rating}*`),
      { type: values.compare, value: rating },
      usedFilter.filterFn
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { type, value } = this.props.values || {};
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.Select value={type || "1"} name="compare" inputWidth="70px" controlled={false}>
          <UU5.Forms.Select.Option value="1">=</UU5.Forms.Select.Option>
          <UU5.Forms.Select.Option value="2">&gt;=</UU5.Forms.Select.Option>
          <UU5.Forms.Select.Option value="3">&gt;</UU5.Forms.Select.Option>
          <UU5.Forms.Select.Option value="4">&lt;=</UU5.Forms.Select.Option>
          <UU5.Forms.Select.Option value="5">&lt;</UU5.Forms.Select.Option>
        </UU5.Forms.Select>
        <UU5.Bricks.Rating onClick={this._handleSubmit} value={value} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Rating;
