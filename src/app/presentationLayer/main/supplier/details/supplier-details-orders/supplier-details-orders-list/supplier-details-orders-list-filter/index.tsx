import React, { useState } from "react";
import { useStore } from "effector-react";
import { Button, Input, Tooltip } from "antd";

import effector from "app/presentationLayer/effects/supplier";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { withDebounce } from "app/utils/utils";

export const SupplierDetailsOrdersListFilter = () => {
  const $supplierDetailsOrdersListFilterProps = useStore(effector.stores.$supplierDetailsOrdersListFilterProps);

  const [ searchValue, setSearchValue ] = useState($supplierDetailsOrdersListFilterProps.search);

  const onFilterChange = (fields) => {
    effector.events.updateSupplierDetailsOrdersListFilter({ ...$supplierDetailsOrdersListFilterProps, page: 0, ...fields });
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
    effector.events.resetSupplierDetailsOrdersListFilter();
  };

  const onRefreshFilterProps = () => {
    onFilterChange({ ...$supplierDetailsOrdersListFilterProps })
  };

  return (
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
  )
};