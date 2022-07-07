import React from "react";
import Card from "app/presentationLayer/components/card";
// @ts-ignore
import styles from "./detail.module.css";
import Pagination from "app/presentationLayer/components/pagination";
import Table from "app/presentationLayer/components/table";

export default () => {
  return (
    <div className={styles.info_table}>
      <Card className={styles.card}>
        <Table
          showOrderNo={true}
          header={["Сумма", "Дата", "ККМ", "Кассиры"]}
          data={Array.from(Array(50)).map((_, index) => ({
            id: index,
            sum: String(index * 100000),
            date: "12-12-2019",
            kkm: "N50004234234",
            cashier: "Achilov Bakhrom"
          }))}
        />
      </Card>
      <div className={styles.pagination}>
        <Pagination
            page={10}
            total={100}
            onPageSelected={page => {}}
            onSizeChange={size => {}}
        />
      </div>
    </div>
  );
};
