import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Select, Table, Input } from "antd";

import effector from "app/presentationLayer/effects/clients";
import warehouseEffector from "app/presentationLayer/effects/clients/warehouse";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { formatPrice, withDebounce } from "app/utils/utils";
import Card from "app/presentationLayer/components/card";

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
    title: <div className="w-s-n">Кол-во</div>,
    dataIndex: "qty",
  },
  {
    title: <div className="w-s-n">Ед. Изм</div>,
    dataIndex: "unit",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
  {
    title: "Себестоимость, сум",
    dataIndex: "costPrice",
  },
  {
    title: "Продажная цена, сум",
    dataIndex: "salesPrice",
  },
  {
    title: "Общ. себестоимость, сум",
    dataIndex: "totalCostPrice",
  },
  {
    title: "Общ. продажная цена, сум",
    dataIndex: "totalSalesPrice",
  },
  {
    title: "Потенциальная прибыль, сум",
    dataIndex: "profit",
  },
  {
    title: "Маржа, %",
    dataIndex: "margin",
  },
];

export default (props) => {
  const { match } = props;
  const companyId = match.params.companyId;

  const $branchItems = useStore(effector.stores.$branchItems);
  const $categoriesItems = useStore(effector.stores.$categoriesItems);

  const $warehouseStockList = useStore(
    warehouseEffector.stores.$warehouseStockList
  );
  const $warehouseStockListFilter = useStore(
    warehouseEffector.stores.$warehouseStockListFilter
  );
  const $warehouseStockStat = useStore(
    warehouseEffector.stores.$warehouseStockStat
  );
  const $searchProducts = useStore(warehouseEffector.stores.$searchProducts);

  const { data: stockData, loading: stockLoading } = $warehouseStockList;

  const {
    content: stock,
    number: stockPage,
    size: stockSize,
    totalElements: stockTotal,
  } = stockData;

  const [searchValue, setSearchValue] = useState(
    $warehouseStockListFilter.search
  );

  useEffect(() => {
    warehouseEffector.effects.fetchWarehouseStockListEffect({
      companyId,
      ...$warehouseStockListFilter,
    });
  }, [$warehouseStockListFilter]);

  const onFilterChange = (fields) => {
    warehouseEffector.events.updateWarehouseStockListFilter({
      ...$warehouseStockListFilter,
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
      warehouseEffector.effects.fetchWarehouseStockStatEffect({
        companyId,
        branchId,
      });
      effector.effects.fetchCategoryItems({ companyId, branchId });
    } else {
      effector.events.resetCategoryItems();
    }

    onFilterChange({ ...$warehouseStockListFilter, branchId });
  };

  const onCategorySearch = (search) => {
    if (search.length >= 2) {
      // @ts-ignore
      effector.effects.fetchCategoryItems({
        companyId,
        branchId: $warehouseStockListFilter.branchId || 0,
        search,
      });
    }
  };

  const onCategoryChange = (categoryIds) => {
    onFilterChange({ categoryIds });

    // @ts-ignore
    effector.effects.fetchCategoryItems({
      companyId,
      branchId: $warehouseStockListFilter.branchId || 0,
    });
  };

  const onProductSearch = (search) => {
    if (search.length >= 2) {
      warehouseEffector.effects.searchProductsEffect({
        search,
        withBalance: false,
        companyId,
        branchId: $warehouseStockListFilter.branchId,
      });
    } else {
      warehouseEffector.events.resetSearchProducts();
    }
  };

  const onProductChange = (productId) => {
    onFilterChange({ productId });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ page: page - 1, size });
  };

  const data = stock.map((value, index) => ({
    id: value.product.id,
    key: value.product.id,
    num: <div className="w-s-n">{stockSize * stockPage + index + 1}</div>,
    name: value.product.name,
    qty: value.qty || 0,
    unit: value.unit ? value.unit.name : "Отсуствует!",
    status: (
      <div className="w-s-n">
        {value.qty > 0 ? "В наличии" : "Нет в наличии"}
      </div>
    ),
    costPrice: formatPrice(value.costPrice, 2),
    salesPrice: formatPrice(value.salesPrice, 2),
    totalCostPrice: formatPrice(value.totalCostPrice, 2),
    totalSalesPrice: formatPrice(value.totalSalesPrice, 2),
    profit: formatPrice(value.profit, 2),
    margin: formatPrice(value.margin, 2),
  }));

  return (
    <Card>
      <div className="CP__cabinet">
        <div className="custom-content__header">
          <div className="custom-content__header__left-inner">
            <h1>Общие остатки</h1>
            {$warehouseStockStat.data && (
              <>
                <span>
                  Кол-во товаров:{" "}
                  <strong>
                    {$warehouseStockStat.data.productCount.toLocaleString("ru")}
                  </strong>
                </span>
                <span>
                  Общ. себестоимость:{" "}
                  <strong>
                    {$warehouseStockStat.data.totalCostPrice.toLocaleString(
                      "ru"
                    )}
                  </strong>{" "}
                  сум
                </span>
                <span>
                  Общ. продажная цена:{" "}
                  <strong>
                    {$warehouseStockStat.data.totalSalesPrice.toLocaleString(
                      "ru"
                    )}
                  </strong>{" "}
                  сум
                </span>
              </>
            )}
          </div>
        </div>
        <div className="filter-block">
          <div className="filter-block__item">
            <Select
              className="custom-select"
              loading={$branchItems.loading}
              placeholder="Выберите филиал"
              value={$warehouseStockListFilter.branchId}
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
            <div className="filter-block__search">
              <div className="filter-block__search__icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <Input
                className="custom-input"
                placeholder="Поиск"
                value={searchValue}
                disabled={!$warehouseStockListFilter.branchId}
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
              disabled={!$warehouseStockListFilter.branchId}
              value={$warehouseStockListFilter.categoryIds}
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
              disabled={!$warehouseStockListFilter.branchId}
              value={$warehouseStockListFilter.productId}
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
        {$warehouseStockListFilter.branchId && (
          <div className="CP__cabinet__table">
            <Table
              dataSource={data}
              columns={columns}
              loading={stockLoading}
              pagination={{
                total: stockTotal,
                pageSize: stockSize,
                current: stockPage + 1,
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
