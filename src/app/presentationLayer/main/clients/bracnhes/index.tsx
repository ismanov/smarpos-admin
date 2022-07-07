import React, { useEffect } from "react";

import { useStore } from 'effector-react'
import effector from "app/presentationLayer/effects/clients/branches";

import Card from "app/presentationLayer/components/card";
import { BranchesListTable } from "app/presentationLayer/main/branches/branches-list-table";

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
    title: <div className="t-a-c">ККМ</div>,
    dataIndex: 'terminalCount',
  },
  {
    title: <div className="t-a-c">Сотрудники</div>,
    dataIndex: 'userCount',
  },
];

export const Branches = (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $branchesList = useStore(effector.stores.$branchesList);
  const $branchesFilter = useStore(effector.stores.$branchesFilter);

  useEffect(() => {
    effector.effects.fetchBranchesListEffect({ companyId, ...$branchesFilter });
  }, [companyId, $branchesFilter]);

  const onFilterChange = (fields) => {
    effector.events.updateBranchesFilter({ ...$branchesFilter, page: 0, ...fields });
  };

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Филиалы</h1>
          </div>
        </div>
        <BranchesListTable $branchesList={$branchesList} columns={columns} onFilterChange={onFilterChange} />
      </div>
    </Card>
  );
};
