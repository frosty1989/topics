import UU5 from "uu5g04";

// Workaround for UU-BT:UU.UU5G04/20181126_0006
// UU5.Common.Router won't allow simple address change

function setRouteParameters(params, saveHistory = false) {
  let url = UU5.Common.Url.parse(window.location.href.replace(/#.*/, ""))
    .set({ parameters: params })
    .toString();
  if (saveHistory) {
    history.pushState({}, document.title, url);
  } else {
    history.replaceState({}, document.title, url);
  }
}

function removeRouteParameters(saveHistory = false) {
  let url = UU5.Common.Url.parse(window.location.href.replace(/#.*/, ""))
    .set({ parameters: {} })
    .toString();
  if (saveHistory) {
    history.pushState({}, document.title, url);
  } else {
    history.replaceState({}, document.title, url);
  }
}

export { removeRouteParameters, setRouteParameters };
