import React, { HTMLAttributes, useEffect, useState } from "react";
// @ts-ignore
import styles from "./dropdown.module.css";
import cn from "classnames";
// @ts-ignore
import ArrowDown from "app/assets/img/arrow_down.svg";
type ItemType = {
  title: string;
  value: any;
};

export default (
  props: HTMLAttributes<HTMLInputElement> & {
    onSelect: (item: any | undefined) => void;
    data: Array<ItemType>;
    noDataTitle?: string;
    openToBottom?: boolean;
    value?: any;
  }
) => {
  // @ts-ignore
  const [current, setCurrent] = useState<ItemType | undefined>();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setCurrent(
      props.value !== undefined
        ? props.data.find(item => item.value === props.value)
        : undefined
    );
  }, [props.value]);

  return (
    <div
      className={cn(styles.wrapper, props.className)}
      tabIndex={0}
      style={props.style}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
        setOpen(false);
      }}
    >
      <div
        className={styles.dropdown}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className={styles.title}>
          {current
            ? current.title
            : props.noDataTitle
            ? props.noDataTitle
            : "Все"}
        </div>
        <div>
          <img src={ArrowDown} alt="arrowdown" />
        </div>
      </div>
      <div
        className={cn(
          styles.menu_container,
          props.openToBottom === false ? styles.totop : styles.tobottom,
          open && focused ? styles.open : undefined
        )}
      >
        <div className={styles.menu}>
          <div
            className={cn(
              styles.item,
              props.data.length !== 0 ? styles.bottom_border : undefined
            )}
            onClick={() => {
              setCurrent(undefined);
              setOpen(false);
              props.onSelect(undefined);
            }}
          >
            {props.noDataTitle || "Все"}
          </div>
          {props.data.map((item, index) => (
            <div
              className={cn(
                styles.item,
                index !== props.data.length - 1
                  ? styles.bottom_border
                  : undefined
              )}
              onClick={() => {
                setCurrent(item);
                setOpen(false);
                props.onSelect(item);
              }}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
