import React from "react";
import cn from "classnames";
// @ts-ignore
import styles from "./checkbox.module.css";

export const CustomCheckbox = (props) => {
  const { onChange, checked, label } = props;
  return (
    <label className={cn(styles.custom_checkbox, { [styles.custom_checkbox_checked]: checked })}>
      <span className={cn(styles.custom_checkbox_mark)}>
        <input
          type="checkbox"
          className={styles.custom_checkbox_input}
          onChange={onChange}
          checked={checked}
        />
        <span className={styles.custom_checkbox_inner} />
      </span>
      {label && <span className={cn(styles.custom_checkbox_text)}>{label}</span>}
    </label>
  );
};