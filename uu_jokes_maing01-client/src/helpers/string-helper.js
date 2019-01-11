import React from "react";

function nl2br(text) {
  let lines = (text || "").split("\n").reduce((result, line, index) => {
    result.push(line);
    result.push(<br key={index} />);
    return result;
  }, []);
  lines.pop(); // reomve last br
  return lines;
}

export { nl2br };
