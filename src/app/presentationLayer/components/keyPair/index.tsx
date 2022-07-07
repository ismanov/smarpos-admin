import React, { HTMLAttributes } from "react";
import cn from "classnames";

// @ts-ignore
import styles from "./keypair.module.css";

export default (
  props: HTMLAttributes<HTMLDivElement> & { title: string; value: string }
) => {
  return (
    <div {...props} className={cn(styles.wrapper, props.className)}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.value}>{props.value}</div>
    </div>
  );
};
