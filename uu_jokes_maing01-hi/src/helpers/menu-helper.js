import UU5 from "uu5g04";

// affected screens are based on UU5.Bricks.Page leftWidth property
// all screens widths starting with ! for closed menu
const affectedScreensSizes = new Set(["xs", "s", "m"]);

function ensureClosedMenu() {
  // ensure closed menu on "affected" screen sizes
  if (affectedScreensSizes.has(UU5.Common.Tools.getScreenSize())) {
    let page = UU5.Environment.getPage();
    page && page.isLeftOpen() && page.closeLeft();
  }
}

export { ensureClosedMenu };
