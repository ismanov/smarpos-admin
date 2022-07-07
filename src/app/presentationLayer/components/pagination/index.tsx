import React, { HTMLAttributes, useState, useEffect } from "react";
// @ts-ignore
import styles from "./pagination.module.css";
import DropDown from "app/presentationLayer/components/dropdown";
import cn from "classnames";
enum CellType {
  prev,
  next,
  dots,
  number
}

export enum PageSizeType {
  normal,
  big
}

type Cell = {
  type: CellType;
  value?: number | undefined;
};

export default (
  props: HTMLAttributes<HTMLDivElement> & {
    page?: number;
    total: number;
    onPageSelected: (page: number) => void;
    size?: number;
    sizeType?: PageSizeType;
    onSizeChange: (size: number) => void;
  }
) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(props.page || 0);
  }, [props.page]);

  useEffect(() => {
    setPage(props.page || 0);
    setTotal(props.total);
  }, []);

  useEffect(() => {
    setTotal(props.total);
  }, [props.total]);

  let items = (() => {
    let result: Array<Cell> = [];
    if (total > 1) {
      result.push({
        type: CellType.prev
      });
    }

    if (total <= 10) {
      for (let i = 1; i <= total; i++) {
        result.push({
          type: CellType.number,
          value: i
        });
      }
    } else {
      if (page - 4 <= 0) {
        Array.from(Array(5)).forEach((_, index) => {
          result.push({
            type: CellType.number,
            value: index + 1
          });
        });
        result.push({ type: CellType.dots });
        result.push({ type: CellType.number, value: total });
      } else if (page + 4 >= total) {
        result.push({
          type: CellType.number,
          value: 1
        });
        result.push({
          type: CellType.dots
        });
        Array.from(Array(6)).forEach((_, index) => {
          result.push({
            type: CellType.number,
            value: total - 5 + index
          });
        });
      } else {
        result.push({
          type: CellType.number,
          value: 1
        });
        result.push({
          type: CellType.dots
        });
        Array.from(Array(7)).forEach((_, index) => {
          if (index < 3) {
            result.push({
              type: CellType.number,
              value: page - 3 + index
            });
          } else {
            result.push({
              type: CellType.number,
              value: page - 3 + index
            });
          }
        });
        result.push({
          type: CellType.dots
        });
        result.push({
          type: CellType.number,
          value: total
        });
      }
    }
    if (total > 1) {
      result.push({
        type: CellType.next
      });
    }
    return result;
  })();

  let noDataTitle = (() => {
    if (props.sizeType === PageSizeType.big) {
      return "50"
    } else {
      return "20"
    }
  });

  let pageSizeList = (() => {
    if (props.sizeType === PageSizeType.big) {
      return [{
        title: "50",
        value: 50
      }, {
        title: "100",
        value: 100
      }, {
        title: "150",
        value: 150
      }, {
        title: "250",
        value: 250
      }, {
        title: "500",
        value: 500
      }]
    } else {
      return [{
        title: "20",
        value: 20
      }, {
        title: "40",
        value: 40
      }, {
        title: "60",
        value: 60
      }, {
        title: "80",
        value: 80
      }, {
        title: "100",
        value: 100
      }]
    }
  })();

  return (
    <div className={styles.pagination}>
      {items.map(item => {
        switch (item.type) {
          case CellType.number:
            return (
              <div
                className={cn(
                  styles.cell,
                  styles.btw_margin,
                  page + 1 === item.value ? styles.active : undefined
                )}
                onClick={() => {
                  props.onPageSelected &&
                    props.onPageSelected((item.value || 0) - 1);
                  setPage((item.value || 0) - 1);
                }}
              >
                {item.value}
              </div>
            );
          case CellType.prev:
            return (
              <div
                className={cn(styles.button, styles.btw_margin)}
                onClick={() => {
                  if (page > 0) {
                    setPage(page - 1);
                    props.onPageSelected && props.onPageSelected(page - 1);
                  }
                }}
              >
                {"<"}
              </div>
            );
          case CellType.next:
            return (
              <div
                className={cn(styles.button, styles.btw_margin)}
                onClick={() => {
                  if (page < total - 1) {
                    setPage(page + 1);
                    props.onPageSelected && props.onPageSelected(page + 1);
                  }
                }}
              >
                {">"}
              </div>
            );
          case CellType.dots:
            return (
              <div className={cn(styles.cell, styles.btw_margin)}>...</div>
            );
        }
      })}
      <div className={styles.page_size}>
        <DropDown
            noDataTitle={noDataTitle()}
            data={pageSizeList}
            onSelect={item => {
              let v = 0;
              if (!item) {
                v = pageSizeList[0].value;
              } else {
                v = item.value
              }
              props.onSizeChange(v);
            }}
            openToBottom={false}
            value={props.size}
         />
      </div>
    </div>
  );
};
