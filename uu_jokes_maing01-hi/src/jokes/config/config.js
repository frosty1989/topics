import Config from "../../config/config.js";

export default {
  ...Config,

  TAG: Config.TAG + "Jokes.",
  CSS: Config.CSS + "jokes-"
};
