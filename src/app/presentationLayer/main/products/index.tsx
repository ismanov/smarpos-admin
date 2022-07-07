import React, { useEffect } from "react";
//@ts-ignore
import styles from "./products.module.css";
import Card from "app/presentationLayer/components/card";
import effector from "app/presentationLayer/effects/products";
import { useStore } from "effector-react";
import { withRouter } from "react-router-dom";

import Table from "app/presentationLayer/components/table";
import RangePicker from "app/presentationLayer/components/rangePicker";
import moment from "moment";
import DropDown from "app/presentationLayer/components/dropdown";
import Search from "app/presentationLayer/components/search";
import Pagination from "app/presentationLayer/components/pagination";
import {
  MON_PRODUCT_LIST_FILT_CITY,
  MON_PRODUCT_LIST_FILT_DATE,
  MON_PRODUCT_LIST_FILT_REGION,
  MON_PRODUCT_LIST_FILT_SEARCH,
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

export default withRouter((props) => {
  const $products = useStore(effector.store.$products);
  const $productsFilter = useStore(effector.store.$productsFilter);
  const $regions = useStore(effector.store.$regions);
  const $cities = useStore(effector.store.$cities);

  const { data: productsData, loading: productsLoading } = $products;

  useEffect(() => {
    effector.effects.fetchRegionList();
  }, []);

  useEffect(() => {
    effector.effects.fetchProducts($productsFilter);
  }, [$productsFilter]);

  const onSort = (sort) => {
    effector.events.updateProductsFilter({
      orderBy: sort.byField,
      sortOrder: sort.type.toLowerCase(),
    });
  };

  const onDateSelected = (from, to) => {
    effector.events.updateProductsFilter({
      from: from
        ? moment(from)
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      to: to
        ? moment(to)
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
    });
  };

  const onRegionChange = (item) => {
    let regionId = item ? item.value : undefined;

    if (regionId) {
      effector.effects.fetchCityList(regionId);
      effector.events.updateProductsFilter({
        regionId,
      });
    } else {
      effector.events.resetCityList();
    }
  };

  const onCityChange = (item) => {
    let cityId = item ? item.value : undefined;

    effector.events.updateProductsFilter({
      cityId,
    });
  };

  const onFilterChange = (prop, value) => {
    effector.events.updateProductsFilter({
      [prop]: value,
    });
  };

  const onChangePagination = (page) => {
    effector.events.updateProductsFilter({
      page,
    });
  };

  const onChangeSize = (size) => {
    effector.events.updateProductsFilter({
      size,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        Товары (Всего - {productsData.totalElements})
      </div>
      <Card className={styles.content}>
        <div className={styles.filter}>
          <WithPermission
            annotation={MON_PRODUCT_LIST_FILT_DATE}
            placement={{ right: -5, top: 0, bottom: 0 }}
          >
            <div className={styles.item}>
              <RangePicker
                value={{
                  from: $productsFilter.from
                    ? moment($productsFilter.from).toDate()
                    : undefined,
                  to: $productsFilter.to
                    ? moment($productsFilter.to).toDate()
                    : undefined,
                }}
                onDateSelected={onDateSelected}
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_PRODUCT_LIST_FILT_REGION}
            placement={{ right: -5, top: 0, bottom: 0 }}
          >
            <div className={styles.item}>
              <DropDown
                noDataTitle="Все области"
                onSelect={onRegionChange}
                data={
                  $regions.data
                    ? $regions.data?.map((r) => ({
                        title: r.nameRu,
                        value: r.id,
                      }))
                    : []
                }
                value={$productsFilter.regionId}
                style={{ width: 200, height: 35 }}
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_PRODUCT_LIST_FILT_CITY}
            placement={{ right: -5, top: 0, bottom: 0 }}
          >
            <div className={styles.item}>
              <DropDown
                noDataTitle="Все регионы"
                onSelect={onCityChange}
                data={
                  $cities.data
                    ? $cities.data?.map((c) => ({
                        title: c.nameRu,
                        value: c.id,
                      }))
                    : []
                }
                value={$productsFilter.cityId}
                style={{ width: 200, height: 35 }}
              />
            </div>
          </WithPermission>
          <WithPermission
            annotation={MON_PRODUCT_LIST_FILT_SEARCH}
            placement={{ right: -5, top: 0, bottom: 0 }}
          >
            <div className={styles.item}>
              <Search
                placeholder="Поиск"
                onSearch={(value) => {
                  if (!value || value.length >= 3) {
                    onFilterChange("search", value);
                  }
                }}
                // value={$productsFilter.search}
              />
            </div>
          </WithPermission>
        </div>
        <Table
          showOrderNo={true}
          header={[
            "Категория",
            "Название товара",
            "Клиент",
            "Торговая точка",
            "Количество",
            "Сумма",
          ]}
          sortable={true}
          onSort={onSort}
          sortFields={["amountSold", "totalSum"]}
          data={productsData.content.map((product) => ({
            id: product.productId,
            categoryName: product.categoryName,
            productName: product.productName,
            owner: product.owner ? product.owner : "",
            branchName: product.branchName ? product.branchName : "",
            amountSold: product.amountSold ? product.amountSold.toString() : "",
            totalSum: product.totalSum ? product.totalSum.toString() : "",
          }))}
          isLoading={productsLoading}
        />
      </Card>
      <div className={styles.pagination}>
        <Pagination
          page={productsData.number || 0}
          total={productsData.totalPages || 0}
          size={productsData.size}
          onPageSelected={onChangePagination}
          onSizeChange={onChangeSize}
        />
      </div>
    </div>
  );
});
