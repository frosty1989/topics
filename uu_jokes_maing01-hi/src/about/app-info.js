//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";

import "./app-info.less";
import LSI from "./app-info-lsi.js";
//@@viewOff:imports

export const AppInfo = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AppInfo",
    classNames: {
      main: Config.CSS + "appInfo",
      links: Config.CSS + "links"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    termsOfUse: UU5.PropTypes.string,
    technicalDocumentation: UU5.PropTypes.string
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()} className={this.getClassName("links")}>
        <UU5.Bricks.Div>{this.getLsiComponent("appNameWithVersion")}</UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Link href={this.props.termsOfUse} target="_blank" content={this.getLsiValue("termsOfUse")} />
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Link
            href={this.props.technicalDocumentation}
            target="_blank"
            content={this.getLsiValue("technicalDocumentation")}
          />
        </UU5.Bricks.Div>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default AppInfo;
