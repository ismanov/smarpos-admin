import React, { useEffect } from "react";
import { Table } from "antd";
import moment from "moment";

import { useStore } from 'effector-react'
import effector from "app/presentationLayer/effects/clients/logs";

import Card from "app/presentationLayer/components/card";

const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: 'Дата Изменения',
    dataIndex: 'modificationDate',
  },
  {
    title: 'Кто изменил',
    dataIndex: 'updater',
  },
  {
    title: 'Тип изменения',
    dataIndex: 'entityType',
  },
  {
    title: 'Наименование',
    dataIndex: 'entityName',
  },
  {
    title: 'Поле',
    dataIndex: 'field',
  },
  {
    title: 'Старое значение',
    dataIndex: 'oldValue',
  },
  {
    title: 'Новое значение',
    dataIndex: 'newValue',
  },
];

export const Logs = (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $logsList = useStore(effector.stores.$logsList);
  const $logsFilter = useStore(effector.stores.$logsFilter);

  const { data: logsData, loading: logsLoading } = $logsList;

  const {
    content: logs,
    number: logsPage,
    size: logsSize,
    totalElements: logsTotal
  } = logsData;


  useEffect(() => {
    effector.effects.fetchLogsListEffect({ companyId, ...$logsFilter });
  }, [companyId, $logsFilter]);

  const onFilterChange = (fields) => {
    effector.events.updateLogsFilter({ ...$logsFilter, page: 0, ...fields });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ ...$logsFilter, page: page - 1, size });
  };

  const data = logs.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: (<div className="w-s-n">{(logsSize * logsPage) + index + 1}</div>),
    modificationDate: moment(item.modificationDate).locale('ru').format('DD-MMMM YYYY'),
    updater: item.updater,
    entityType: `${item.entityType || '-'}`,
    entityName: `${item.entityName}`,
    field: item.field,
    oldValue: item.oldValue,
    newValue: `${item.newValue}`
  }));

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Логи</h1>
          </div>
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={logsLoading}
            pagination={{
              total: logsTotal,
              pageSize: logsSize,
              current: logsPage + 1,
              hideOnSinglePage: true,
              showSizeChanger: true,
              pageSizeOptions: [ "20", "50", "100", "150", "250", "500" ],
              onChange: onChangePagination,
            }}
          />
        </div>
      </div>
    </Card>
  );
};
