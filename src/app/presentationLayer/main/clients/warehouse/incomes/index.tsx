import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Select, Table } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";

import effector from "app/presentationLayer/effects/clients";
import warehouseEffector from "app/presentationLayer/effects/clients/warehouse";
import Card from "app/presentationLayer/components/card";

const { Option } = Select;

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Номер",
    dataIndex: "number",
  },
  {
    title: "Дата",
    dataIndex: "date",
  },
  {
    title: "Поставщик",
    dataIndex: "contractor",
  },
  {
    title: "Филиал",
    dataIndex: "branch",
  },
];

export default (props) => {
  const { match, location } = props;
  const companyId = match.params.companyId;
  const agreementId = props.location?.state?.agreementId;

  const $branchItems = useStore(effector.stores.$branchItems);
  const $contractorsItems = useStore(effector.stores.$contractorsItems);

  const $warehouseIncomesList = useStore(
    warehouseEffector.stores.$warehouseIncomesList
  );
  const $warehouseIncomesListFilter = useStore(
    warehouseEffector.stores.$warehouseIncomesListFilter
  );

  const { data: incomesData, loading: incomesLoading } = $warehouseIncomesList;

  const {
    content: incomes,
    number: incomesPage,
    size: incomesSize,
    totalElements: incomesTotal,
  } = incomesData;

  useEffect(() => {
    effector.effects.fetchContractorsItemsEffect({
      companyId,
      ...$warehouseIncomesListFilter,
    });
  }, []);

  useEffect(() => {
    warehouseEffector.effects.fetchWarehouseIncomesListEffect({
      companyId,
      ...$warehouseIncomesListFilter,
    });
  }, [$warehouseIncomesListFilter]);

  const onFilterChange = (fields) => {
    warehouseEffector.events.updateWarehouseIncomesListFilter({
      ...$warehouseIncomesListFilter,
      page: 0,
      ...fields,
    });
  };

  const onBranchChange = (branchId) => {
    onFilterChange({ branchId });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const data = incomes.map((income, index) => ({
    id: income.id,
    key: income.id,
    num: <div className="w-s-n">{incomesSize * incomesPage + index + 1}</div>,
    number: income.id,
    date: moment(income.createdDate).format("DD.MM.YYYY HH:mm:ss"),
    contractor: income.contractor ? income.contractor.name : "",
    branch: income.toBranch ? income.toBranch.name : "",
  }));

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Приход товара</h1>
          </div>
          <div>
            <Link
              to={{
                pathname: `${location.pathname}/add`,
                state: {
                  agreementId,
                },
              }}
              className="ant-btn ant-btn-primary"
            >
              Добавить
            </Link>
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$branchItems.loading}
              placeholder="Выберите филиал"
              value={$warehouseIncomesListFilter.branchId}
              onChange={onBranchChange}
              allowClear
            >
              {$branchItems?.data?.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$contractorsItems.loading}
              placeholder="Выберите поставщика"
              value={
                $warehouseIncomesListFilter.contractorId
                  ? $warehouseIncomesListFilter.contractorId.toString()
                  : undefined
              }
              onChange={(contractorId) => onFilterChange({ contractorId })}
              allowClear
            >
              {$contractorsItems?.data?.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="CP__cabinet__table">
          <Table
            dataSource={data}
            columns={columns}
            loading={incomesLoading}
            pagination={{
              total: incomesTotal,
              pageSize: incomesSize,
              current: incomesPage + 1,
              hideOnSinglePage: true,
              showSizeChanger: true,
              pageSizeOptions: ["20", "50", "100", "150", "250", "500"],
              onChange: onChangePagination,
            }}
          />
        </div>
      </div>
    </Card>
  );
};
