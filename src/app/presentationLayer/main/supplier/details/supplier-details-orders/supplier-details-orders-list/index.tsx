import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Link } from "react-router-dom";
import { Alert, Pagination, Table } from "antd";
import moment from "moment";

import effector from "app/presentationLayer/effects/supplier";

import { SupplierDetailsOrdersListFilter } from "./supplier-details-orders-list-filter";

const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: "Номер заказа",
    dataIndex: "orderNumber"
  },
  {
    title: "Филиал",
    dataIndex: "branch"
  },
  {
    title: "Покупатель",
    dataIndex: "customer"
  },
  {
    title: "Сумма",
    dataIndex: "total"
  },
  {
    title: "Дата заказа",
    dataIndex: "orderDate"
  },
  {
    title: "Статус",
    dataIndex: "status"
  }
];

export const SupplierDetailsOrdersList = (props) => {
  const { match } = props;

  const supplierId = match.params.supplierId;

  const $supplierDetailsOrdersList = useStore(effector.stores.$supplierDetailsOrdersList);
  const $supplierDetailsOrdersListFilterProps = useStore(effector.stores.$supplierDetailsOrdersListFilterProps);

  const { data: ordersData, error, loading } = $supplierDetailsOrdersList;

  const { content: orders, number: ordersPage, size: ordersSize, totalElements: ordersTotal } = ordersData;

  useEffect(() => {
    effector.effects.fetchSupplierDetailsOrdersListEffect({
      supplierId: supplierId,
      ...$supplierDetailsOrdersListFilterProps
    })
  }, [$supplierDetailsOrdersListFilterProps]);

  const data = orders.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: (<div className="w-s-n">{(ordersSize * ordersPage) + index + 1}</div>),
    orderNumber: <Link to={`${match.url}/${item.id}`}>{item.number}</Link>,
    branch: item.branch.name,
    customer: item.customer.name,
    total: <><strong>{item.total.toLocaleString("ru")}</strong> сум</>,
    orderDate: moment(item.orderDate).format('DD-MM-YYYY'),
    status: item.status.nameRu
  }));

  const onChangePagination = (page, size) => {
    effector.events.updateSupplierDetailsOrdersListFilter({ page: page - 1, size });
  };

  return (
    <>
      <div className="custom-content__header">
        <div className="custom-content__header__left-inner">
          <h1>Заказы</h1>
        </div>
      </div>
      {error && <div className="custom-content__error">
        <Alert message={error.message} type="error" />
      </div>}
      <SupplierDetailsOrdersListFilter />
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </div>
      <div className="custom-pagination">
        <Pagination
          total={ordersTotal}
          pageSize={ordersSize}
          current={ordersPage + 1}
          hideOnSinglePage={true}
          pageSizeOptions={[ "20", "50", "100", "150", "250", "500" ]}
          onChange={onChangePagination}
        />
      </div>
    </>
  );
};