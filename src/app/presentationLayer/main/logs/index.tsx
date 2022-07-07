import React, { useEffect } from "react";
//@ts-ignore
import styles from "./logs.module.css";
import Card from "app/presentationLayer/components/card";
import effector from "app/presentationLayer/effects/log";
import { useStore } from "effector-react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Table from "app/presentationLayer/components/table";
import Pagination from "app/presentationLayer/components/pagination";


export default withRouter(props => {

  const store = useStore(effector.store);

  useEffect(() => {
    effector.effects.fetchLog({
      ...effector.queryParams(store)
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        Логи
        (Всего - {store.totalElements || 0})
      </div>
      <Card className={styles.body}>
        <div className={styles.content}>
          <Table
            showOrderNo={true}
            header={[
              "Дата Изменения",
              "Кто изменил",
              "Тип изменения",
              "Наименование",
              "Поле",
              "Старое значение",
              "Новое значение",
              "id компании"
            ]}
            data={
              store.list?.map(log => ({
                id: log.id,
                date: moment(log.modificationDate).locale('ru').format('DD-MMMM YYYY'),
                updater: log.updater,
                entityType: `${log.entityType || '-'}`,
                entityName: `${log.entityName}`,
                field: log.field,
                oldValue: log.oldValue,
                newValue: `${log.newValue}`,
                companyId: `${log.companyId}`
              }))
            }
            onItemClicked={item => {
              if (item) {
                props.history.push(`/main/monitoring/clients/info/${item.companyId}`)
              }

            }}
            isLoading={store.isLoading}
            page={store.page}
            size={store.size}
          />
        </div>
      </Card>

      <div className={styles.pagination}>
        <Pagination
          page={store.page || 0}
          total={store.totalPages || 0}
          onPageSelected={page => {
            effector.effects.fetchLog({
              ...effector.queryParams(store),
              page
            });
          }}
          size={store.size}
          onSizeChange={size => {
            effector.effects.fetchLog({
              ...effector.queryParams(store),
              size
            });
          }}
        />
      </div>
    </div>
  );
});
