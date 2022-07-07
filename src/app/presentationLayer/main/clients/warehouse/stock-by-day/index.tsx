import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Select, Table, Input, DatePicker } from "antd";
import moment from "moment";

import effector from "app/presentationLayer/effects/clients";
import warehouseEffector from "app/presentationLayer/effects/clients/warehouse";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Card from "app/presentationLayer/components/card";
import { withDebounce } from "app/utils/utils";

const dateFormat = "YYYY-MM-DD";
const { Option } = Select;

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Наименование товара",
    dataIndex: "name",
  },
  {
    title: "Дата",
    dataIndex: "balanceDate",
  },
  {
    title: "Количество, начало дня",
    dataIndex: "balanceStart",
  },
  {
    title: "Приход",
    dataIndex: "income",
  },
  {
    title: "Возврат",
    dataIndex: "back",
  },
  {
    title: "Продажа",
    dataIndex: "sale",
  },
  {
    title: "Корректировка",
    dataIndex: "stockAdjustment",
  },
  {
    title: "Трансфер в",
    dataIndex: "transferIn",
  },
  {
    title: "Трансфер из",
    dataIndex: "transferOut",
  },
  {
    title: "Количество, конец дня",
    dataIndex: "balanceEnd",
  },
];

export default (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $branchItems = useStore(effector.stores.$branchItems);
  const $categoriesItems = useStore(effector.stores.$categoriesItems);
  const $warehouseStockByDayList = useStore(
    warehouseEffector.stores.$warehouseStockByDayList
  );
  const $warehouseStockByDayListFilter = useStore(
    warehouseEffector.stores.$warehouseStockByDayListFilter
  );
  const $searchProducts = useStore(warehouseEffector.stores.$searchProducts);

  const {
    data: stockByDayData,
    loading: stockByDayLoading,
  } = $warehouseStockByDayList;

  const {
    // @ts-ignore
    content: stockByDay,
    number: stockByDayPage,
    size: stockByDaySize,
    totalElements: stockByDayTotal,
  } = stockByDayData;

  const [searchValue, setSearchValue] = useState(
    $warehouseStockByDayListFilter.search
  );

  useEffect(() => {
    warehouseEffector.effects.fetchWarehouseStockByDayListEffect({
      companyId,
      ...$warehouseStockByDayListFilter,
    });
  }, [$warehouseStockByDayListFilter]);

  const onFilterChange = (fields) => {
    warehouseEffector.events.updateWarehouseStockByDayListFilter({
      ...$warehouseStockByDayListFilter,
      page: 0,
      ...fields,
    });
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

  const onBranchChange = (branchId) => {
    if (branchId) {
      effector.effects.fetchCategoryItems({ companyId, branchId });
    } else {
      effector.events.resetCategoryItems();
    }

    onFilterChange({ ...$warehouseStockByDayListFilter, branchId });
  };

  const onCategorySearch = (search) => {
    if (search.length >= 2) {
      // @ts-ignore
      effector.effects.fetchCategoryItems({
        companyId,
        branchId: $warehouseStockByDayListFilter.branchId || 0,
        search,
      });
    }
  };

  const onCategoryChange = (categoryIds) => {
    onFilterChange({ categoryIds });

    // @ts-ignore
    effector.effects.fetchCategoryItems({
      companyId,
      branchId: $warehouseStockByDayListFilter.branchId || 0,
    });
  };

  const onProductSearch = (search) => {
    if (search.length >= 2) {
      warehouseEffector.effects.searchProductsEffect({
        search,
        withBalance: false,
        companyId,
        branchId: $warehouseStockByDayListFilter.branchId,
      });
    } else {
      warehouseEffector.events.resetSearchProducts();
    }
  };

  const onProductChange = (productId) => {
    onFilterChange({ productId });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: Number(page) - 1, size });
  };

  const data = stockByDay.map((item, index) => ({
    id: item.product.id,
    key: item.product.id,
    num: (
      <div className="w-s-n">{stockByDaySize * stockByDayPage + index + 1}</div>
    ),
    name: item.product.name,
    balanceDate: item.balanceDate,
    balanceStart: item.balanceStart || 0,
    income: item.income || 0,
    back: item.back || 0,
    sale: item.sale || 0,
    stockAdjustment: item.stockAdjustment || 0,
    transferIn: item.transferIn || 0,
    transferOut: item.transferOut || 0,
    balanceEnd: item.balanceEnd || 0,
  }));

  const orderDateValue = $warehouseStockByDayListFilter.balanceDate
    ? moment($warehouseStockByDayListFilter.balanceDate)
    : null;

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Остатки по дням</h1>
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$branchItems.loading}
              placeholder="Выберите филиал"
              value={$warehouseStockByDayListFilter.branchId}
              onChange={onBranchChange}
              allowClear
            >
              {$branchItems.data.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-block__item">
            <DatePicker
              format={dateFormat}
              placeholder={"Дата заказа"}
              className="custom-date-picker"
              // @ts-ignore
              value={orderDateValue}
              disabled={!$warehouseStockByDayListFilter.branchId}
              onChange={(_, value) =>
                onFilterChange({ balanceDate: value ? value : undefined })
              }
            />
          </div>
          <div className="filter-block__item">
            <div className="filter-block__search">
              <div className="filter-block__search__icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <Input
                className="custom-input"
                placeholder="Поиск"
                value={searchValue}
                disabled={!$warehouseStockByDayListFilter.branchId}
                onChange={onSearchChange}
                allowClear
              />
            </div>
          </div>
          <div className="filter-block__item">
            <Select
              mode="multiple"
              showSearch
              className="custom-select"
              loading={$categoriesItems.loading}
              disabled={!$warehouseStockByDayListFilter.branchId}
              value={$warehouseStockByDayListFilter.categoryIds}
              placeholder="Выберите категории"
              onSearch={onCategorySearch}
              onChange={(value) => onCategoryChange(value)}
              filterOption={false}
              defaultActiveFirstOption={false}
              allowClear
            >
              {$categoriesItems.data.map((item) => (
                <Option value={item.id.toString()} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-block__item">
            <Select
              showSearch
              className="custom-select"
              loading={$searchProducts.loading}
              disabled={!$warehouseStockByDayListFilter.branchId}
              value={$warehouseStockByDayListFilter.productId}
              placeholder="Выберите товар"
              onSearch={onProductSearch}
              onChange={(value) => onProductChange(value)}
              filterOption={false}
              defaultActiveFirstOption={false}
              allowClear
            >
              {$searchProducts.data.map((item) => (
                <Option value={item.id.toString()} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {$warehouseStockByDayListFilter.branchId && (
          <div className="CP__cabinet__table">
            <Table
              dataSource={data}
              columns={columns}
              loading={stockByDayLoading}
              pagination={{
                total: stockByDayTotal,
                pageSize: stockByDaySize,
                current: stockByDayPage + 1,
                hideOnSinglePage: true,
                showSizeChanger: true,
                pageSizeOptions: ["20", "50", "100", "150", "250", "500"],
                onChange: onChangePagination,
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
