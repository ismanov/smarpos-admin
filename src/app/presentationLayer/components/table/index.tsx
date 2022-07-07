import React, { HTMLAttributes, useEffect, useState } from "react";

// @ts-ignore
import styles from "./table.module.css";

import Loading from "app/presentationLayer/components/loading";
import cn from "classnames";


type SortObject = {
  byField: string,
  type: "ASC" | "DESC"
};

type CustomTableProps = {
  header?: Array<string>;
  data?: Array<any>;
  showOrderNo?: boolean;
  page?: number;
  size?: number;
  isLoading?: boolean;
  onItemClicked?: (item: any) => void;
  selectable?: boolean;
  sortable?: boolean;
  sort?: SortObject;
  onSort?: (sort: SortObject) => void;
  sortFields?: string[]
};


export default (props: HTMLAttributes<HTMLTableElement> & CustomTableProps) => {
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [sort, setSort] = useState<SortObject | undefined>(undefined);
  const arrowSymbol = "▾";
  let sortColIndex;

  if (props.sortable && sort && props.data?.length) {
    let row = props.data[0];
    Object.keys(row).forEach((k, i) => {
      if (k === sort.byField) {
        sortColIndex = i;
      }
    })
  }


  useEffect(() => {
    setSort(props.sort)
  }, [props.sort]);

  if (props.isLoading) {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.head}>
          {props.showOrderNo ? <th className={styles.cell}>#</th> : undefined}
          {props.header && props.header.map(item => <th className={styles.cell}>{item}</th>)}
          </thead>
        </table>
        <div className={styles.no_data_container}>
          <Loading show={true} />
        </div>
      </div>
    );
  } else if (props.data && props.data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.head}>
          {props.showOrderNo ? <th className={styles.cell}>#</th> : undefined}
          {props.header &&
          props.header.map((item, i) => <th className={styles.cell}>{item}</th>)}
          </thead>
        </table>
        <div className={styles.no_data_container}>Список пуст!</div>
      </div>
    );
  } else {
    return (
      <table className={styles.table}>
        <thead className={styles.head}>
        {props.showOrderNo ? <th className={styles.cell} style={{ minWidth: 30 }}>#</th> : undefined}
        {props.header &&
        props.header.map((item, i) => {
          let o = props.data ? props.data![0]: {};
          let order = props.showOrderNo ? i + 1 : i;

          return <th className={styles.cell}>
            {props.sortable && (!props.sortFields || props.sortFields.indexOf(Object.keys(o)[order]) >= 0) ? (
              <div
                style={{ width: '100%' }}
                onClick={() => {
                  let key = Object.keys(o)[order];
                  let type: "ASC" | "DESC" = "DESC";
                  if (key === sort?.byField) {
                    type = sort?.type === "ASC" ? "DESC" : "ASC";
                  }
                  setSort({
                    byField: key,
                    type: type
                  });
                  props.onSort && props.onSort({
                    byField: key,
                    type: type
                  });
                }}
              >
                {item}
                {sortColIndex !== undefined && sortColIndex === i + 1 ? (
                  <span className={cn(styles.arrow, sort?.type === "DESC" ? styles.desc : undefined)}>
                                {arrowSymbol}
                            </span>
                ) : undefined}
              </div>
            ) : (item)}
          </th>
        })}
        </thead>
        <tbody className={styles.body}>
        {props.data &&
        props.data.map((item, index) => {
          return (
            <tr
              className={cn(
                styles.row,
                props.selectable !== false &&
                selectedItem &&
                item.id === selectedItem.id
                  ? styles.active
                  : undefined
              )}
              onClick={() => {
                props.onItemClicked && props.onItemClicked(item);
                setSelectedItem(item);
              }}
            >
              {props.showOrderNo ? (
                <td className={styles.cell}>
                  {props.size !== undefined && props.page !== undefined
                    ? index + 1 + Number(props.page) * Number(props.size)
                    : index + 1}
                </td>
              ) : undefined}
              {item &&
              Object.keys(item).map((key, index) => {
                if (key === "id") return;
                if (typeof item[key] === "string" || !item[key]) {
                  return (
                    <td
                      className={styles.cell}
                      style={{
                        minWidth:
                          Object.keys(item).indexOf("id") >= 0
                            ? index === 1
                            ? "15%"
                            : "inherit"
                            : index === 0
                            ? "15%"
                            : "inherit"
                      }}
                    >
                      {`${item[key]}`}
                    </td>
                  );
                } else if (Array.isArray(item[key])) {
                  return (
                    <td className={styles.cell}>
                      {item[key] &&
                      item[key].map(
                        (button: {
                          icon?: any;
                          action: () => void;
                        }) => {
                          return (
                            <span
                              style={{ marginLeft: 5 }}
                              onClick={button.action}>
                                      {button.icon}
                                    </span>
                          );
                        }
                      )}
                    </td>
                  );
                } else {
                  return (
                    <td className={styles.cell}>{item[key]}</td>
                  );
                }
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }
};
