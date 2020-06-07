//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";

import {JokesConsumer} from "../core/jokes-provider.js";

import "./create-form.less";
import LSI from "./create-form-lsi.js";
//@@viewOff:imports

export const Form = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CreateForm",
    classNames: {
      main: Config.CSS + "CreateForm"
    },
    lsi: LSI,
    opt: {
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    showPublished: UU5.PropTypes.bool
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
  _getNewspapersOptions(newspapers) {
    return newspapers.map(newspaper => (
      <UU5.Forms.Select.Option value={newspaper.id} key={newspaper.id}>
        {newspaper.name}
      </UU5.Forms.Select.Option>
    ));
  },

  _validateText(opt) {
    let result = { feedback: Config.FEEDBACK.INITIAL, value: opt.value };
    // when there is no event, validation comes from "isValid" method
    if (opt.event === undefined) {
      if (!opt.value && !this._file.getValue()) {
        // text is empty, check file
        result.feedback = Config.FEEDBACK.ERROR;
        result.message = this.getLsiComponent("textOrFile");
        opt.component.setFeedback(result.feedback, result.message);
      }
    }
    return result;
  },

  _registerFile(cmp) {
    this._file = cmp;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <JokesConsumer>
        {({ newspaperList }) => (
          <UU5.Bricks.Div {...this.getMainPropsToPass()}>
            {/* // Name */}
            <UU5.Forms.Text inputAttrs={{ maxLength: 255 }} label={this.getLsiComponent("name")} name="name" required />
            {/* // Text */}
            <UU5.Forms.TextArea
              label={this.getLsiComponent("text")}
              inputAttrs={{ maxLength: 4000 }}
              name="text"
              onValidate={this._validateText}
              autoResize
            />
            {/* // Image */}
            <UU5.Forms.File label={this.getLsiComponent("image")} name="image" ref_={this._registerFile} />
            {/* // Newspapers */}
            <UU5.Forms.Select
              label={this.getLsiComponent("newspaper")}
              name="newspaperList"
              multiple
              openToContent={true}
            >
              {this._getNewspapersOptions(newspaperList)}
            </UU5.Forms.Select>
          </UU5.Bricks.Div>
        )}
      </JokesConsumer>
    );
  }
  //@@viewOff:render
});

export default Form;
