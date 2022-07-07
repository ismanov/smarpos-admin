import React, { ButtonHTMLAttributes } from "react";
// @ts-ignore
import styles from "./button.module.css";
import cn from "classnames";
type ButtonType = {
  buttonType?: "text" | "raised" | "outlined";
};

export default (
  props: ButtonHTMLAttributes<HTMLButtonElement> & ButtonType
) => {
  const getStyle = () => {
    if (!props.buttonType) {
      return styles.raised;
    }
    switch (props.buttonType) {
      case "raised":
        return styles.raised;
      case "text":
        return styles.text;
      case "outlined":
        return styles.outlined;
      default:
        return styles.raised;
    }
  };

  return (
    <button {...props} className={cn(getStyle(), props.className)}>
      {" "}
      {props.title}{" "}
    </button>
  );
};
