import React, { useEffect, useState } from "react";
import { Button, Input, InputNumber, Table, Tooltip, Popconfirm, notification } from "antd";
import Card from "app/presentationLayer/components/card";

import catalogEffector from "app/presentationLayer/effects/clients/catalog";
import { useStore } from "effector-react";

import "./styles.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCheck,
  faTimes,
  faPen,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";


const productsColumns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: 'Название',
    dataIndex: 'name',
  },
  {
    title: 'Цена',
    dataIndex: 'price',
  },
  {
    title: 'Операции',
    dataIndex: 'actions',
  },
];


export const Products = (props) => {
  const { branchId, selectedCategory, onEditClick, addEditProductModalProps } = props;

  const $catalogProducts = useStore(catalogEffector.stores.$catalogProducts);
  const $updateCatalogProduct = useStore(catalogEffector.stores.$updateCatalogProduct);
  const $deleteCatalogProduct = useStore(catalogEffector.stores.$deleteCatalogProduct);
  const $createCatalogProduct = useStore(catalogEffector.stores.$createCatalogProduct);

  const [productsFilterProps, setProductsFilterProps] = useState<any>({});
  const [productUpdatedFields, setProductUpdatedFields] = useState<any>({});

  const getProducts = () => {
    return catalogEffector.effects.fetchCatalogProductsEffect({ branchId, categoryId: selectedCategory.id, ...productsFilterProps });
  };

  useEffect(() => {
    if (branchId && selectedCategory) {
      getProducts();
    } else {
      catalogEffector.events.resetCatalogProductsEvent();
    }
  }, [productsFilterProps, branchId, selectedCategory]);

  useEffect(() => {
    if ($createCatalogProduct.success && branchId && selectedCategory) {
      getProducts();
    }
  }, [$createCatalogProduct.success]);

  useEffect(() => {

    return () => {
      catalogEffector.events.resetCatalogProductsEvent();
    }
  }, []);

  useEffect(() => {
    if ($updateCatalogProduct.success) {
      getProducts().then(() => {
        setProductUpdatedFields({});
      });

      if (!addEditProductModalProps.visible) {
        notification['success']({
          message: "Товар обновлен",
        });

        catalogEffector.events.resetUpdateCatalogProductEvent();
      }
    }

    if ($deleteCatalogProduct.success) {
      getProducts();

      notification['success']({
        message: "Товар удален",
      });

      catalogEffector.events.resetDeleteCatalogProductEvent();
    }
  }, [$updateCatalogProduct, $deleteCatalogProduct]);


  const updateProductField = (id, field, value) => {
    setProductUpdatedFields({
      ...productUpdatedFields,
      [id]: {
        ...productUpdatedFields[id],
        [field]: value
      }
    })
  };

  const saveUpdatedProductField = (item, field) => {
    const updatedFields = productUpdatedFields[item.id];

    if (updatedFields) {
      const data = updatedFields[field];
      catalogEffector.effects.updateCatalogProductEffect({ ...item, [field]: data, branchId });
    }
  };

  const resetUpdatedProductField = (id, field) => {
    if (productUpdatedFields[id] && productUpdatedFields[id][field]) {
      const newProductUpdatedFields = { ...productUpdatedFields[id] };
      delete newProductUpdatedFields[field];

      setProductUpdatedFields(newProductUpdatedFields);
    }
  };

  const onProductsChangePagination = (page) => {
    setProductsFilterProps({ ...productsFilterProps, page: page - 1 });
  };

  const onProductsChangeSize = (current, size) => {
    setProductsFilterProps({ ...productsFilterProps, size });
  };

  const onSearchProducts = (event) => {
    if (event.target.value.length > 2 || event.target.value.length === 0) {
      setProductsFilterProps({ ...productsFilterProps, search: event.target.value });
    }
  };

  const data = $catalogProducts.data.content.map((item, index) => {
    const updatedFields = productUpdatedFields[item.id];
    return {
      id: item.id,
      key: item.id,
      num: (<div className="w-s-n">{($catalogProducts.data.size * $catalogProducts.data.number) + index + 1}</div>),
      name: item.name,
      price: <div className="CP__catalog__products__price-field">
        <div className="CP__catalog__products__price-field__input">
          <InputNumber
            className="custom-input"
            value={updatedFields && updatedFields.salesPrice ? updatedFields.salesPrice: item.salesPrice}
            placeholder="Цена"
            onChange={(value) => updateProductField(item.id, "salesPrice", value)}
          />
        </div>
        <Tooltip placement="bottom" title="Сохранить">
          <Button
            onClick={() => saveUpdatedProductField(item, "salesPrice")}
            loading={$updateCatalogProduct.loading === item.id}
            disabled={!updatedFields || !updatedFields.salesPrice || updatedFields.salesPrice === item.salesPrice}
            type="primary"
            shape="circle"
            icon={<FontAwesomeIcon icon={faCheck} />}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="Отменить">
          <Button
            onClick={() => resetUpdatedProductField(item.id, "salesPrice")}
            disabled={!updatedFields || !updatedFields.salesPrice || updatedFields.salesPrice === item.salesPrice}
            type="primary"
            shape="circle"
            danger
            icon={<FontAwesomeIcon icon={faTimes} />}
          />
        </Tooltip>
      </div>,
      actions: <div className="CP__catalog__products__actions">
        <Tooltip placement="bottom" title="Редактировать">
          <Button
            onClick={() => onEditClick(item.id)}
            type="primary"
            shape="circle"
            icon={<FontAwesomeIcon icon={faPen} />}
          />
        </Tooltip>
        <Popconfirm
          placement="topRight"
          title="Вы действительно хотите удалить товар?"
          onConfirm={() => catalogEffector.effects.deleteCatalogProductEffect({ id: item.id, branchId })}
        >
          <Tooltip placement="bottom" title="Удалить">
            <Button
              loading={$deleteCatalogProduct.loading === item.id}
              type="primary"
              shape="circle"
              danger
              icon={<FontAwesomeIcon icon={faTrashAlt} />}
            />
          </Tooltip>
        </Popconfirm>
      </div>
    };
  });

  return (
    <Card className="CP__catalog__products">
      <div className="CP__catalog__products__head">
        <div>Список товаров {selectedCategory ? `(${selectedCategory.name})`: null}</div>
        <div>
          <div className="filter-block__search">
            <div className="filter-block__search__icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <Input
              className="custom-input"
              placeholder="Поиск"
              disabled={!branchId}
              onChange={onSearchProducts}
            />
          </div>
        </div>
      </div>
      <div className="CP__catalog__products__content">
        <Table
          dataSource={data}
          columns={productsColumns}
          loading={$catalogProducts.loading}
          pagination={{
            total: $catalogProducts.data.totalElements,
            pageSize: $catalogProducts.data.size,
            current: $catalogProducts.data.number + 1,
            hideOnSinglePage: true,
            showSizeChanger: true,
            pageSizeOptions: ["20", "50", "100", "150", "250", "500"],
            onShowSizeChange: onProductsChangeSize,
            onChange: onProductsChangePagination,
          }}
          scroll={{ y: 600 }}
        />
      </div>
    </Card>
  );
};
