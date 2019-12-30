//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";

import Config from "./config/config.js";
import AboutCfg from "../config/about.js";

import "./about.less";
import LSI from "./about-lsi.js";
//@@viewOff:imports

const FLS_TEXT_STYLE = UU5.Common.Css.css` {
    text-align: center;
    font-size: 14px;
    color: #393939;
    margin: 40px 0 24px 0;
  }`;

const FLS_STYLE = UU5.Common.Css.css` {
    text-align: center;
    margin-top: 24px;
  }`;

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
      termsOfUse: Config.CSS + "about-terms",
      fls: FLS_STYLE,
      flsText: FLS_TEXT_STYLE,
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

    // FIXME temporary added fls
    const fls = `
      <uu5string/>
      <UU5.Bricks.Lsi>
        <UU5.Bricks.Lsi.Item language="en">
          <UU5.Bricks.Authenticated authenticated>
          <br/>
            Did you find a problem or do you have an idea that could improve the application? Contact us:
          <br/><br/>
          <UuFls.Bricks.CreateIssueButton flsBaseUri="https://uuappg01-eu-w-1.plus4u.net/uu-flsg01-main/8014eb79e8184ebb8942d96ce37b61b4/" borderRadius="2px" productCode="support/uuJokes"  colorSchema="blue-rich" size="m" content="Send feedback"/>
          <br/>
         </UU5.Bricks.Authenticated>      
        </UU5.Bricks.Lsi.Item>
        <UU5.Bricks.Lsi.Item language="cs">
          <UU5.Bricks.Authenticated authenticated>
          <br/>
            Našli jste nějaký problém nebo máte nápad, jak aplikaci vylepšit? Ozvěte se nám:
          <br/><br/>
          <UuFls.Bricks.CreateIssueButton flsBaseUri="https://uuappg01-eu-w-1.plus4u.net/uu-flsg01-main/8014eb79e8184ebb8942d96ce37b61b4/" borderRadius="2px" productCode="support/uuJokes"  colorSchema="blue-rich" size="m" content="Poslat zpětnou vazbu"/>
          <br/>
         </UU5.Bricks.Authenticated>      
        </UU5.Bricks.Lsi.Item>
      </UU5.Bricks.Lsi>
      
    `;

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()}>
        <Plus4U5.App.About header={this.getLsiValue("header")} />

          <UU5.Common.Identity>
            {({ identity  }) => {
              let children;

              if (identity === undefined) {
                children = <UU5.Bricks.Loading inline />;
              } else if (identity) {
                children = (
                  <UU5.Bricks.Div className={this.getClassName('fls')}>
                    <UU5.Bricks.Div content={fls} className={this.getClassName('flsText')}/>
                  </UU5.Bricks.Div>
                );
              } else {
                children = null;
              }
              return children;
            }}
          </UU5.Common.Identity>

        <Plus4U5.App.Licence
          organisation={this.getLsiItem(licence.organisation)}
          authorities={this.getLsiItem(licence.authorities)}
        />
        <Plus4U5.App.Authors
          header={this.getLsiValue("creatorsHeader")}
          leadingAuthors={leadingAuthors}
          otherAuthors={otherAuthors}
        />
        <Plus4U5.App.Technologies
          technologies={this.getLsiItem(usedTechnologies.technologies)}
          content={this.getLsiItem(usedTechnologies.content)}
        />
        {licence.termsOfUse && (
          <UU5.Bricks.P className={this.getClassName("termsOfUse")}>
            <UU5.Bricks.Link href={licence.termsOfUse} target="_blank" content={this.getLsiValue("termsOfUse")} />
          </UU5.Bricks.P>
        )}
        <UU5.Bricks.Div className={this.getClassName("logos")}>
          <UU5.Bricks.Image responsive={false} src="assets/plus4u.svg" />
          <UU5.Bricks.Image responsive={false} src="assets/unicorn.svg" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default About;
