import React from "react";

// turn new lines \n into HTML/React new lines <br/>
function nl2br(text) {
  let lines = (text || "").split("\n").reduce((result, line, index) => {
    result.push(line);
    result.push(<br key={index} />);
    return result;
  }, []);
  lines.pop(); // remove last br
  return lines;
}

export { nl2br };
