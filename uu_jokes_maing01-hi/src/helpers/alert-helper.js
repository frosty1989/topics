import UU5 from "uu5g04";
import AlertDescription from "../bricks/alert-description.js";

function reportError(header, content) {
  UU5.Environment.getPage()
    .getAlertBus()
    .addAlert({
      colorSchema: "danger",
      content: <AlertDescription header={header} content={content} />
    });
}

function reportSuccess(header, content) {
  UU5.Environment.getPage()
    .getAlertBus()
    .addAlert({
      colorSchema: "success",
      content: <AlertDescription header={header} content={content} />
    });
}

export { reportError, reportSuccess };
