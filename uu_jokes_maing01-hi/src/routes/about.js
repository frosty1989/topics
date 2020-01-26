//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import { Uri } from "uu_appg01_core";

import Config from "./config/config.js";
import AboutCfg from "../config/about.js";

import "./about.less";
import LSI from "./about-lsi.js";
//@@viewOff:imports

export const About = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.LsiMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "About",
    classNames: {
      main: Config.CSS + "about",
      logos: Config.CSS + "about-logos",
      authors: Config.CSS + "about-authors"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onRouteChanged_() {
    let menu = this.getCcrComponentByKey(Config.LEFT_MENU_CCR_KEY);
    menu && menu.setActiveRoute("about");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getAuthors(authors) {
    return (
      authors &&
      authors.slice().map(author => {
        author = UU5.Common.Tools.merge({}, author);
        author.role =
          author.role && typeof author.role === "object" ? <UU5.Bricks.Lsi lsi={author.role} /> : author.role;
        return author;
      })
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const licence = AboutCfg.licence || {};
    const leadingAuthors = this._getAuthors(AboutCfg.leadingAuthors);
    const otherAuthors = this._getAuthors(AboutCfg.otherAuthors);
    const usedTechnologies = AboutCfg.usedTechnologies || {};
    const currentUrl = window.location.href;
    const awid = Uri.Uri.parse(currentUrl)
      .getAwid()
      .toString();
    const {
      fls_base_uri: flsBaseUri,
      term_of_use_uri: termOfUseUri,
      technical_documentation_uri: technicalDocumentationUri,
      product_code: productCode
    } = UU5.Environment;

    const flsButton = UU5.Common.Tools.findComponent("UuFls.Bricks.CreateIssueButton", {
      flsBaseUri,
      productCode,
      borderRadius: "2px",
      colorSchema: "blue-rich",
      size: "m"
    });

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()}>
        <Plus4U5.App.About header={this.getLsiValue("header")} />

        <UU5.Common.Identity>
          {({ identity }) => {
            let children;
            if (identity === undefined) {
              children = <UU5.Bricks.Loading inline />;
            } else if (identity) {
              children = (
                <UU5.Bricks.Div>
                  <UU5.Bricks.Div className="center">
                    <UU5.Bricks.P className="center font-size-s">{this.getLsiComponent("flsText")}</UU5.Bricks.P>
                    {flsButton}
                  </UU5.Bricks.Div>
                </UU5.Bricks.Div>
              );
            } else {
              children = null;
            }
            return children;
          }}
        </UU5.Common.Identity>

        <Plus4U5.App.Resources
          header=""
          resources={[
            this.getLsiComponent("appNameWithVersion"),
            <UU5.Bricks.Link
              href={termOfUseUri}
              key="termOfUse"
              target="_blank"
              content={this.getLsiValue("termsOfUse")}
            />,
            <UU5.Bricks.Link
              href={technicalDocumentationUri}
              key="technicalDocumentation"
              target="_blank"
              content={this.getLsiValue("technicalDocumentation")}
            />
          ]}
        />

        <Plus4U5.App.Authors
          className={this.getClassName("authors")}
          header={this.getLsiValue("creatorsHeader")}
          leadingAuthors={leadingAuthors}
          otherAuthors={otherAuthors}
        />

        <UU5.Bricks.Line size="s" />

        <UU5.Bricks.Row>
          <UU5.Bricks.Column colWidth="xs-12 s-12 m-6 l-6 xl-6">
            <Plus4U5.App.Technologies
              textAlign="left"
              technologyType="application"
              technologies={this.getLsiItem(usedTechnologies.technologies)}
              content={this.getLsiItem(usedTechnologies.content)}
            />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs-12 s-12 m-6 l-6 xl-6">
            <Plus4U5.App.Licence
              textAlign="left"
              organisation={{
                name: "Plus4U",
                uri: "https://www.plus4u.net/"
              }}
              authorities={[
                {
                  name: "Radek Dolejš",
                  uri: "https://plus4u.net/ues/sesm?SessFree=ues%3AVPH-BT%3A4-1"
                }
              ]}
              awid={
                <UU5.Bricks.Link
                  content={awid}
                  href="https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-0238a88bac124b3ca828835b57144ffa/book/page?code=64bcc363"
                />
              }
            />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>

        <UU5.Bricks.Div className="center">
          <UU5.Bricks.Link href="https://unicorn.com">
            <UU5.Bricks.Image
              mainAttrs={{ height: 80 }}
              responsive={false}
              src="https://docs.plus4u.net/public/assets/unicorn.svg"
              className={this.getClassName("logos")}
              target="_blank"
            />
          </UU5.Bricks.Link>
          <UU5.Bricks.Link href="https://www.plus4u.net">
            <UU5.Bricks.Image
              mainAttrs={{ height: 80 }}
              responsive={false}
              src="https://docs.plus4u.net/public/assets/plus4u.svg"
              className={this.getClassName("logos")}
              target="_blank"
            />
          </UU5.Bricks.Link>
        </UU5.Bricks.Div>
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default About;
