import React from "react";
import OriginalSchemaTabs from "@theme-original/SchemaTabs";

function hasElementChild(children) {
  return React.Children.toArray(children).some((child) =>
    React.isValidElement(child)
  );
}

export default function SchemaTabs(props) {
  if (!hasElementChild(props.children)) {
    return null;
  }

  return <OriginalSchemaTabs {...props} />;
}
