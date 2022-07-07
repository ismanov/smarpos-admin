import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";

import supplierEffector from "app/presentationLayer/effects/supplier";

import { Input, Tooltip, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";
import { SupplierListTable } from "app/presentationLayer/main/supplier/supplier-list-table";

const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: "Название компании",
    dataIndex: 'name',
  },
  {
    title: "ИНН",
    dataIndex: 'tin',
  },
  {
    title: "Дата регистрации",
    dataIndex: 'createdDate',
  },
  {
    title: "Кол-во заказов",
    dataIndex: 'totalOrder',
  },
  {
    title: "Завершенные заказы",
    dataIndex: 'totalCompletedOrder',
  },
  {
    title: "Сумма",
    dataIndex: 'totalCompletedAmount',
  }
];

export const SupplierList = (props) => {
  const $supplierList = useStore(supplierEffector.stores.$supplierList);
  const $supplierListFilter = useStore(supplierEffector.stores.$supplierListFilter);

  const { data: supplierData } = $supplierList;
  const { totalElements: supplierTotal } = supplierData;

  const [ searchValue, setSearchValue ] = useState($supplierListFilter.search);

  const getList = () => {
    supplierEffector.effects.fetchSupplierListEffect({
      ...$supplierListFilter
    });
  };

  useEffect(() => {
    getList();
  }, [ $supplierListFilter ]);

  const onFilterChange = (fields) => {
    supplierEffector.events.updateSupplierListFilter({ ...$supplierListFilter, page: 0, ...fields });
  };

  const onSearchChange = (e) => {
    const search = e.target.value;
    setSearchValue(search);

    withDebounce(() => {
      onFilterChange({
        search,
      });
    });
  };

  const onResetFilterProps = () => {
    setSearchValue("");
    supplierEffector.events.resetSupplierListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$supplierListFilter })
  };

  return (
    <Card fullHeight={true}>
      <div className="custom-content">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Поставщики</h1>
            <span>
              Кол-во: <strong>{supplierTotal.toLocaleString("ru")}</strong>
            </span>
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <div className="filter-block__search">
              <div className="filter-block__search__icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <Input
                className="custom-input"
                placeholder="Поиск"
                value={searchValue}
                onChange={onSearchChange}
              />
            </div>
          </div>
          <div className="filter-block__item filter-block__buttons">
            <Tooltip placement="bottom" title="Сбросить фильтр">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className='svg' icon={faTimes} />}
                onClick={onResetFilterProps}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Повторный запрос">
              <Button
                type="primary"
                icon={<FontAwesomeIcon className='svg' icon={faUndo} />}
                onClick={onRefreshFilterProps}
              />
            </Tooltip>
          </div>
        </div>
        <SupplierListTable $supplierList={$supplierList} columns={columns} onFilterChange={onFilterChange} />
      </div>
    </Card>
  );
};
