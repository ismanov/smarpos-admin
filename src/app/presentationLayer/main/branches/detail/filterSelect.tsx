import React, { HTMLAttributes } from "react";
// @ts-ignore
import styles from "./detail.module.css";
import cn from "classnames";

type FilterSelectProps = {
  title: string;
  sum: string;
  active?: boolean;
};

export default (props: HTMLAttributes<HTMLDivElement> & FilterSelectProps) => {
  return (
    <div
      className={cn(
        styles.filter_select,
        props.active ? styles.active : undefined,
        props.className
      )}
      onClick={props.onClick}
    >
      <div className={styles.circle_container}>
        <div
          className={cn(
            styles.circle,
            props.active ? styles.active : undefined
          )}
        />
      </div>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.sum}>{props.sum}</div>
    </div>
  );
};
