import Config from "../../config/config.js";

export default {
  ...Config,

  TAG: Config.TAG + "Topic.",
  CSS: Config.CSS + "topic-"
};
