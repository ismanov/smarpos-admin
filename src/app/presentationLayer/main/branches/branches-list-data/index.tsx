import React, { useEffect } from 'react';
import { useStore } from "effector-react";
import moment from "moment";
import branchesEffector from "app/presentationLayer/effects/branches";
import { BranchesListTable } from "app/presentationLayer/main/branches/branches-list-table";

const reqDateFormat = 'YYYY-MM-DDTHH:mm:ss';

const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: "Название",
    dataIndex: 'name',
  },
  {
    title: "Телефон",
    dataIndex: 'phone',
  },
  {
    title: "Адрес",
    dataIndex: 'address',
  },
  {
    title: "Компания",
    dataIndex: 'companyName',
  },
  {
    title: <div className="t-a-c">ККМ</div>,
    dataIndex: 'terminalCount',
  },
  {
    title: <div className="t-a-c">Сотрудники</div>,
    dataIndex: 'userCount',
  },
];

const formatFilterProps = (filter) => {
  return {
    ...filter,
    from: filter.from ? moment(filter.from).startOf("day").format(reqDateFormat) : undefined,
    to: filter.to ? moment(filter.to).endOf("day").format(reqDateFormat) : undefined,
  }
};

export const BranchesListData = (props) => {
  const { onFilterChange } = props;
  const $branchesList = useStore(branchesEffector.stores.$branchesList);
  const $branchesListFilter = useStore(branchesEffector.stores.$branchesListFilter);

  const getList = () => {
    branchesEffector.effects.fetchBranchesListEffect(formatFilterProps($branchesListFilter));
  };

  useEffect(() => {
    getList();
  }, [ $branchesListFilter ]);

  return (
    <BranchesListTable
      $branchesList={$branchesList}
      columns={columns}
      onFilterChange={onFilterChange}
    />
  );
};
