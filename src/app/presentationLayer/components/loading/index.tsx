import React from "react";

export default (props: { show: boolean }) => {
  return (
    <div
      className="lds-ring"
      style={{ display: props.show ? "block" : "none" }}
    >
      <div />
      <div />
      <div />
    </div>
  );
};
