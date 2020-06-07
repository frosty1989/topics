import UU5 from "uu5g04";

import Config from "./config/config.js";
import {whitelistedKeys} from "../helpers/object-utils";

const JokesContext = UU5.Common.Context.create();
const JokesConsumer = JokesContext.Consumer;


const JokesProvider = UU5.Common.Component.create({

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Provider"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return {
      data: {...this.props.data, setData: this.setData}
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) this.setState({data: {...nextProps.data, setData: this.setData}})
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  setData(data, setStateCallback) {
    // filter out keys, no possibility to set awid or userProfiles
    let newData = UU5.Common.Tools.merge(this.state.data, whitelistedKeys(data, "state", "name", "topicList", "logos"));
    this.setState({data: newData}, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <JokesContext.Provider value={this.state.data}>
        {this.props.children}
      </JokesContext.Provider>
    );
  }
  //@@viewOff:render
});

export {JokesConsumer, JokesProvider};
export default JokesProvider;

