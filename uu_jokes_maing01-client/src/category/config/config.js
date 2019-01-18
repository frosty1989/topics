import Config from "../../config/config.js";

export default {
  ...Config,

  TAG: Config.TAG + "Category.",
  CSS: Config.CSS + "category-"
};
