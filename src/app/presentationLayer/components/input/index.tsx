import React, { InputHTMLAttributes } from "react";
// @ts-ignore
import styles from "./textfield.module.css";

const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & {
  onEnterKey?: () => void;
}> = props => {
  return (
    <>
      <div className={styles.title}>{props.title}</div>
      <input
        className={styles.input}
        onKeyDown={e => {
          if (e.key === "Enter") {
            props.onEnterKey && props.onEnterKey();
          }
        }}
        {...props}
      />
    </>
  );
};

export default Input;
