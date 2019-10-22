import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";

import Config from "./config/config.js";

const JokesContext = UU5.Common.Context.create();
const JokesConsumer = JokesContext.Consumer;


const JokesProvider = createReactClass({


  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Provider"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object
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
      data: this.props.data
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) this.setState({data: nextProps.data})
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  setData(data, setStateCallback){
    let newData = UU5.Common.Tools.merge(this.state.data, data);
    this.setState({data: newData}, setStateCallback);
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

