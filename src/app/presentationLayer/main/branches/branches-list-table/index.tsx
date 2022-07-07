import React from 'react';
import { Table, Pagination, Alert } from "antd";


export const BranchesListTable = (props) => {
  const { onFilterChange, $branchesList, columns } = props;

  const { data: branchesData, loading: branchesLoading, error: branchesError } = $branchesList;
  const {
    content: branches,
    number: branchesPage,
    size: branchesSize,
    totalElements: branchesTotal
  } = branchesData;

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const data = branches.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: (<div className="w-s-n">{(branchesSize * branchesPage) + index + 1}</div>),
    name: item.name,
    phone: item.phone,
    address: item.address,
    companyName: item.companyName,
    terminalCount: <div className="t-a-c">{item.terminalCount}</div>,
    userCount: <div className="t-a-c">{item.userCount}</div>,
  }));

  return (
    <>
      {branchesError && <div className="custom-content__error">
        <Alert message={branchesError.message} type="error" />
      </div>}
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          dataSource={data}
          columns={columns}
          loading={branchesLoading}
          pagination={false}
        />
      </div>
      <div className="custom-pagination">
        <Pagination
          total={branchesTotal}
          pageSize={branchesSize}
          current={branchesPage + 1}
          hideOnSinglePage={true}
          pageSizeOptions={[ "20", "50", "100", "150", "250", "500" ]}
          onChange={onChangePagination}
        />
      </div>
    </>
  );
};
