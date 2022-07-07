import React, { HTMLAttributes, useState, useEffect } from "react";
// @ts-ignore
import styles from "./search.module.css";
// @ts-ignore
import Search from "app/assets/img/search.svg";
import cn from "classnames";

type Item = {
  label: string;
  value: any;
};

export default (
  props: HTMLAttributes<HTMLInputElement> & {
    items?: Array<Item>;
    onSearch?: (searchKey?: string) => void;
    onItemClicked?: (item: any) => void;
    value?: string;
    disabled?: boolean;
  }
) => {
  const [focused, setFocused] = useState(false);
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);
  useEffect(() => {
    setSearchKey(props.value);
  }, [props.value]);

  return (
    <div
      tabIndex={0}
      className={cn(styles.search, props.className)}
      style={props.style}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <img
        className={styles.icon}
        src={Search}
        alt="search"
        onClick={() => {
          props.onSearch && props.onSearch(searchKey);
        }}
      />
      <span
        className={styles.clear}
        onClick={() => {
          setSearchKey("");
          props.onSearch && props.onSearch("");
          props.onItemClicked && props.onItemClicked(undefined);
        }}
      >
        X
      </span>
      <input
        className={styles.input}
        value={searchKey}
        onChange={e => {
          setSearchKey(e.target.value);
          props.onSearch && props.onSearch(e.target.value);
        }}
        placeholder={props.placeholder}
        onKeyDown={e => {
          if (e.key === "Enter") {
            props.onSearch && props.onSearch(searchKey);
          }
        }}
      />
      {props.items ? (
        <div className={cn(styles.popup, focused ? styles.open : undefined)}>
          {props.items.length === 0 ? (
            <div className={styles.empty}>Список пуст!</div>
          ) : (
            props.items.map(item => {
              return (
                <div className={styles.item_container}>
                  <div
                    className={styles.item}
                    onClick={() => {
                      props.onItemClicked && props.onItemClicked(item.value);
                      setFocused(false);
                    }}
                  >
                    {item.label}
                  </div>
                  <div className={styles.hr} />
                </div>
              );
            })
          )}
        </div>
      ) : undefined}
    </div>
  );
};
