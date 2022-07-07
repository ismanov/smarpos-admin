import React from "react";
// @ts-ignore
import styles from "./sales.module.css";
import Card from "app/presentationLayer/components/card";
import RangePicker from "app/presentationLayer/components/rangePicker";
import Search from "app/presentationLayer/components/search";
import Pagination, {PageSizeType} from "app/presentationLayer/components/pagination";
import Table from "app/presentationLayer/components/table";

export default () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <RangePicker onDateSelected={(from, to) => {}} />
            <div>
              <Search
                className={styles.search}
                placeholder="Поиск..."
                onItemClicked={val => {}}
                onSearch={searchKey => {
                  console.log(searchKey);
                }}
                items={[
                  {
                    label: "item1",
                    value: "test1"
                  },
                  {
                    label: "item2",
                    value: "test2"
                  },
                  {
                    label: "item3",
                    value: "test3"
                  },
                  {
                    label: "item4",
                    value: "test4"
                  },
                  {
                    label: "item5",
                    value: "test5"
                  },
                  {
                    label: "item6",
                    value: "test6"
                  },
                  {
                    label: "item7",
                    value: "test7"
                  },
                  {
                    label: "item8",
                    value: "test8"
                  },
                  {
                    label: "item9",
                    value: "test9"
                  },
                  {
                    label: "item10",
                    value: "test10"
                  },
                  {
                    label: "item1",
                    value: "test1"
                  },
                  {
                    label: "item2",
                    value: "test2"
                  },
                  {
                    label: "item3",
                    value: "test3"
                  },
                  {
                    label: "item4",
                    value: "test4"
                  },
                  {
                    label: "item5",
                    value: "test5"
                  },
                  {
                    label: "item6",
                    value: "test6"
                  },
                  {
                    label: "item7",
                    value: "test7"
                  },
                  {
                    label: "item8",
                    value: "test8"
                  },
                  {
                    label: "item9",
                    value: "test9"
                  },
                  {
                    label: "item10",
                    value: "test10"
                  }
                ]}
              />
            </div>
          </div>
          <div className={styles.table}>
            <Table
              header={[
                "Торговая точка",
                "Сумма",
                "Дата",
                "Количество ККМ",
                "Телефон",
                "Адрес"
              ]}
              data={Array.from(Array(50)).map(() => ({
                id: 0,
                f1: "Торговая точка 1",
                f2: "25 650 789",
                f3: "20.12.2019",
                f4: "100",
                f5: "+998 90 911 98 97",
                f6: "г. Ташкент, ул. Шота-Руставелли 123, 50 "
              }))}
              showOrderNo={true}
              // isLoading={true}
            />
          </div>
        </Card>
      </div>
      <div className={styles.pagination}>
        <Pagination
            page={13}
            total={18}
            onPageSelected={page => {}}
            sizeType={PageSizeType.normal}
            // size={branchStore.size}
            onSizeChange={size => {
              // await effector.effects.fetchBranchList({
              //   ...effector.queryParams(branchStore),
              //   size: size
              // })
            }}
        />
      </div>
    </div>
  );
};
