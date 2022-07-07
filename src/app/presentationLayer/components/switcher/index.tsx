import React, { HTMLAttributes, useState, useEffect, ReactNode } from "react";
// @ts-ignore
import styles from "./switcher.module.css";
// @ts-ignore
import cn from "classnames";

export default (
  props: HTMLAttributes<HTMLDivElement> & {
    titles: Array<string | ReactNode>;
    onSelect: (index: number) => void;
  }
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    props.onSelect(currentIndex);
  }, [currentIndex]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {props.titles &&
          props.titles.map((item, index) => {
            return (
              <div
                className={cn(
                  styles.item,
                  currentIndex === index ? styles.active : undefined
                )}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              >
                {item}
              </div>
            );
          })}
      </div>
    </div>
  );
};
