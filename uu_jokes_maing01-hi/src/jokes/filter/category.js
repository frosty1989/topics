//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import {JokesConsumer} from "../../core/jokes-provider.js";
import "./category.less";
import LSI from "./category-lsi.js";
//@@viewOff:imports

export const Category = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Category",
    classNames: {
      main: Config.CSS + "category"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    addFilter: UU5.PropTypes.func.isRequired,
    getValues: UU5.PropTypes.func.isRequired,
    filters: UU5.PropTypes.array.isRequired,
    values: UU5.PropTypes.string
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
  _handleSubmit(categories) {
    let values = this.props.getValues();
    let usedFilter = this.props.filters.find(filter => filter.key === values.type);
    this.props.addFilter(
      values.type,
      this.getLsiComponent("category", null, categories.find(category => category.id === values[values.type]).name),
      values[values.type],
      usedFilter.filterFn
    );
  },

  _getOptions(categories) {
    return categories.map(category => (
      <UU5.Forms.Select.Option value={category.id} key={category.id} style="whiteSpace: nowrap">
        {category.name}
      </UU5.Forms.Select.Option>
    ));
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <JokesConsumer>
        {({ categories }) => (
          <UU5.Bricks.Div {...this.getMainPropsToPass()}>
            <UU5.Forms.Select value={this.props.values} name="category" inputWidth="auto" controlled={false}>
              {this._getOptions(categories)}
            </UU5.Forms.Select>
            <UU5.Bricks.Button
              onClick={() => this._handleSubmit(categories)}
              colorSchema="primary"
              content={this.getLsiValue("apply")}
            />
          </UU5.Bricks.Div>
        )}
      </JokesConsumer>
    );
  }
  //@@viewOff:render
});

export default Category;
