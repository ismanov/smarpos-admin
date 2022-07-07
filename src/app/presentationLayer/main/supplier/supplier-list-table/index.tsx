import React from 'react';
import { Table, Pagination, Alert } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";

import { SUPPLIER } from "app/businessLogicLayer/models/Supplier";

const dateFormat = 'YYYY-MM-DD';

export const SupplierListTable = (props) => {
  const { onFilterChange, $supplierList, columns } = props;

  const { data: supplierData, loading: supplierLoading, error: supplierError } = $supplierList;
  const {
    content: supplier,
    number: supplierPage,
    size: supplierSize,
    totalElements: supplierTotal
  } = supplierData;

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const data = supplier.map((item: SUPPLIER, index) => ({
    id: item.id,
    key: item.id,
    num: (<div className="w-s-n">{(supplierSize * supplierPage) + index + 1}</div>),
    name: item.name,
    tin: <Link to={`/main/suppliers/companies/${item.id}`}>{item.tin}</Link>,
    createdDate: item.createdDate ? moment(item.createdDate).format(dateFormat): "",
    totalOrder: item.totalOrder,
    totalCompletedOrder: item.totalCompletedOrder,
    totalCompletedAmount: <><strong>{item.totalCompletedAmount.toLocaleString("ru")}</strong> cум</>
  }));

  return (
    <>
      {supplierError && <div className="custom-content__error">
        <Alert message={supplierError.message} type="error" />
      </div>}
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          dataSource={data}
          columns={columns}
          loading={supplierLoading}
          pagination={false}
        />
      </div>
      <div className="custom-pagination">
        <Pagination
          total={supplierTotal}
          pageSize={supplierSize}
          current={supplierPage + 1}
          hideOnSinglePage={true}
          pageSizeOptions={[ "20", "50", "100", "150", "250", "500" ]}
          onChange={onChangePagination}
        />
      </div>
    </>
  );
};
