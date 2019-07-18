import Config from "../../config/config.js";

export default {
  ...Config,

  TAG: Config.TAG + "Filter.",
  CSS: Config.CSS + "filter-"
};
