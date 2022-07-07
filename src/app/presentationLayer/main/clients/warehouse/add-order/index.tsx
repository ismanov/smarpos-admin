import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  Table,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  message,
  Alert,
  notification,
} from "antd";
import moment from "moment";

import "./styles.scss";
import Card from "app/presentationLayer/components/card";
import { FormField } from "app/presentationLayer/components/form-field";

import effector from "app/presentationLayer/effects/clients";
import warehouseEffector from "app/presentationLayer/effects/clients/warehouse";
import {
  faChevronLeft,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  OrderProductI,
  AdditionalI,
} from "app/businessLogicLayer/models/Client";
import { StringMapI } from "app/businessLogicLayer/models";

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = "YYYY-MM-DD";
const notFilledMessage = "Не заполнено поле";

const productsColumns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Наименование товара",
    dataIndex: "product",
  },
  {
    title: "Ед. Изм.",
    dataIndex: "unit",
    width: 200,
  },
  {
    title: "Общее количество",
    dataIndex: "qty",
    width: 200,
  },
  {
    title: "Цена закупки",
    dataIndex: "costPrice",
    width: 200,
  },
  {
    title: "Сумма",
    dataIndex: "sum",
    width: 200,
  },
  {
    title: "",
    dataIndex: "action",
    width: 100,
  },
];

const additionalColumns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Расход",
    dataIndex: "name",
  },
  {
    title: "Сумма",
    dataIndex: "amount",
  },
  {
    title: "",
    dataIndex: "action",
    width: 100,
  },
];

export default (props) => {
  const { match } = props;
  const companyId = match.params.companyId;
  const $branchItems = useStore(effector.stores.$branchItems);
  const $contractorsItems = useStore(effector.stores.$contractorsItems);
  const $productUnitsItems = useStore(effector.stores.$productUnitsItems);

  const $createWarehouseOrder = useStore(
    warehouseEffector.stores.$createWarehouseOrder
  );
  const $searchProducts = useStore(warehouseEffector.stores.$searchProducts);

  const [formFields, setFormFields] = useState<any>({});
  const [fieldsErrors, setFieldsErrors] = useState<StringMapI>({});

  const [products, setProducts] = useState<OrderProductI[]>([]);
  const [productFormFields, setProductFormFields] = useState<any>({});
  const [productFormErrors, setProductFormErrors] = useState<StringMapI>({});

  const [additional, setAdditional] = useState<AdditionalI[]>([]);
  const [additionalFormFields, setAdditionalFormFields] = useState<any>({});
  const [additionalFormErrors, setAdditionalFormErrors] = useState<StringMapI>(
    {}
  );

  useEffect(() => {
    effector.effects.fetchBranchItems({ companyId });
    effector.effects.fetchContractorsItemsEffect({ companyId });
  }, []);

  useEffect(() => {
    if ($createWarehouseOrder.success) {
      notification["success"]({
        message: "Заказ добавлен",
      });

      setFormFields({});
      warehouseEffector.events.resetCreateWarehouseOrderEvent();
      props.history.goBack();
    }
  }, [$createWarehouseOrder.success]);

  const onFormFieldChange = (field, value) => {
    setFormFields({ ...formFields, [field]: value });

    const newErrors = { ...fieldsErrors };
    delete newErrors[field];
    setFieldsErrors(newErrors);
  };

  const onProductFormFieldChange = (field, value) => {
    setProductFormFields({ ...productFormFields, [field]: value });

    const newErrors = { ...productFormErrors };
    delete newErrors[field];
    setProductFormErrors(newErrors);
  };

  const onProductSearch = (search) => {
    if (search.length >= 2) {
      warehouseEffector.effects.searchProductsEffect({
        search,
        withBalance: true,
        branchId: formFields.branchId,
      });
    } else {
      warehouseEffector.events.resetSearchProducts();
    }
  };

  const onProductChange = (productId) => {
    if (productId) {
      const product = $searchProducts.data.find(
        (item) => item.id === parseInt(productId)
      );
      setProductFormFields({ ...productFormFields, product });

      effector.effects.fetchProductUnitsItemsEffect({
        productId,
        branchId: formFields.branchId,
      });

      const newErrors = { ...productFormErrors };
      delete newErrors.product;
      setProductFormErrors(newErrors);
    } else {
      setProductFormFields({
        ...productFormFields,
        product: undefined,
        unit: undefined,
      });
      warehouseEffector.events.resetSearchProducts();
      effector.events.resetProductUnitsItems();
    }
  };

  const onUnitChange = (unitId) => {
    if (unitId) {
      const unit = $productUnitsItems.data.find(
        (item) => item.id === parseInt(unitId)
      );
      setProductFormFields({ ...productFormFields, unit });

      const newErrors = { ...productFormErrors };
      delete newErrors.unit;
      setProductFormErrors(newErrors);
    } else {
      setProductFormFields({ ...productFormFields, unit: undefined });
    }
  };

  const onAddProductClick = () => {
    const errors: StringMapI = {};

    if (!productFormFields.product) errors.product = notFilledMessage;
    if (!productFormFields.unit) errors.unit = notFilledMessage;
    if (!productFormFields.qty) errors.qty = notFilledMessage;

    if (Object.keys(errors).length) {
      setProductFormErrors(errors);
      message.error("Ошибка валидации");
      return;
    }

    setProductFormErrors({});

    setProducts([
      ...products,
      {
        product: productFormFields.product,
        unitId: productFormFields.unit.id,
        unitName: productFormFields.unit.name,
        qty: productFormFields.qty,
        costPrice: productFormFields.costPrice,
        totalCost: productFormFields.costPrice * productFormFields.qty,
      },
    ]);

    setProductFormFields({});
    warehouseEffector.events.resetSearchProducts();
    effector.events.resetProductUnitsItems();
  };

  const onRemoveProductClick = (productId) => {
    setProducts(products.filter((item) => item.product.id !== productId));
  };

  const onAdditionalFormFieldChange = (field, value) => {
    setAdditionalFormFields({ ...additionalFormFields, [field]: value });

    const newErrors = { ...additionalFormErrors };
    delete newErrors[field];
    setAdditionalFormErrors(newErrors);
  };

  const onAddAdditionalClick = () => {
    const errors: StringMapI = {};

    if (!additionalFormFields.name) errors.name = notFilledMessage;
    if (!additionalFormFields.amount) errors.amount = notFilledMessage;

    if (Object.keys(errors).length) {
      setAdditionalFormErrors(errors);
      message.error("Ошибка валидации");
      return;
    }

    setAdditionalFormErrors({});

    setAdditional([...additional, { ...additionalFormFields }]);

    setAdditionalFormFields({});
  };

  const onRemoveAdditionalClick = (index) => {
    const newItems = [...additional];
    newItems.splice(index, 1);
    setAdditional(newItems);
  };

  const onOrderClick = (status) => {
    const errors: StringMapI = {};

    if (!formFields.contractorId) errors.contractorId = notFilledMessage;
    if (!formFields.branchId) errors.branchId = notFilledMessage;
    if (!formFields.orderDate) errors.orderDate = notFilledMessage;
    if (!formFields.expectedDate) errors.expectedDate = notFilledMessage;
    if (!products.length) errors.products = "Нет товаров";

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data = {
      status: { code: status },
      contractor: { id: formFields.contractorId },
      orderDate: formFields.orderDate,
      expectedDate: formFields.expectedDate,
      orderItems: products,
      additionalCosts: additional,
      description: formFields.description,
    };

    if (status === "DRAFT") {
      data["toBranch"] = { id: formFields.branchId };
    } else {
      data["toBranchId"] = formFields.branchId;
    }

    warehouseEffector.effects.createWarehouseOrderEffect(data);
  };

  const orderDateValue = formFields.orderDate
    ? moment(formFields.orderDate)
    : null;
  const expectedDateValue = formFields.expectedDate
    ? moment(formFields.expectedDate)
    : null;

  const productsData: any[] = products.map((item, index) => {
    return {
      key: item.product.id,
      num: index + 1,
      product: item.product.name,
      unit: item.unitName,
      qty: item.qty,
      costPrice: item.costPrice,
      sum: item.qty * item.costPrice,
      action: (
        <Button
          onClick={() => onRemoveProductClick(item.product.id)}
          type="primary"
          danger
          shape="circle"
          icon={<FontAwesomeIcon icon={faTrash} />}
        />
      ),
    };
  });

  const additionalData: any[] = additional.map((item, index) => {
    return {
      key: index,
      num: index + 1,
      name: item.name,
      amount: item.amount,
      action: (
        <Button
          onClick={() => onRemoveAdditionalClick(index)}
          type="primary"
          danger
          shape="circle"
          icon={<FontAwesomeIcon icon={faTrash} />}
        />
      ),
    };
  });

  productsData.push({
    key: "form",
    num: "",
    product: (
      <FormField
        className="add-order__add-product__form-field"
        error={productFormErrors.product}
      >
        <Select
          showSearch
          className={`custom-select ${
            productFormErrors.product ? "custom-select-error" : ""
          }`}
          loading={$searchProducts.loading}
          value={
            productFormFields.product
              ? productFormFields.product.id.toString()
              : undefined
          }
          placeholder="Выберите товар"
          onSearch={onProductSearch}
          onChange={(value) => onProductChange(value)}
          filterOption={false}
          defaultActiveFirstOption={false}
          allowClear
        >
          {$searchProducts.data.map((item) => (
            <Option value={item.id.toString()} key={item.id}>
              {item.name}; баркод: {item.description}
            </Option>
          ))}
        </Select>
      </FormField>
    ),
    unit: (
      <FormField
        className="add-order__add-product__form-field"
        error={productFormErrors.unit}
      >
        <Select
          className="custom-select"
          loading={$contractorsItems.loading}
          placeholder="Выберите Ед. Изм."
          value={
            productFormFields.unit
              ? productFormFields.unit.id.toString()
              : undefined
          }
          onChange={(value) => onUnitChange(value)}
          allowClear
        >
          {$productUnitsItems.data.map((item) => (
            <Option value={item.id.toString()} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </FormField>
    ),
    qty: (
      <FormField
        className="add-order__add-product__form-field"
        error={productFormErrors.qty}
      >
        <InputNumber
          className="custom-input"
          value={productFormFields.qty || undefined}
          placeholder="0"
          onChange={(value) => onProductFormFieldChange("qty", value)}
        />
      </FormField>
    ),
    costPrice: (
      <FormField className="add-order__add-product__form-field">
        <InputNumber
          className="custom-input"
          value={productFormFields.costPrice || undefined}
          placeholder="0"
          onChange={(value) => onProductFormFieldChange("costPrice", value)}
        />
      </FormField>
    ),
    sum: (
      <FormField className="add-order__add-product__form-field">
        <Input
          className="custom-input"
          readOnly
          value={
            productFormFields.qty && productFormFields.costPrice
              ? productFormFields.qty * productFormFields.costPrice
              : 0
          }
        />
      </FormField>
    ),
    action: (
      <Button
        onClick={onAddProductClick}
        type="primary"
        shape="circle"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    ),
  });

  additionalData.push({
    key: "form",
    num: "",
    name: (
      <FormField
        className="add-order__add-product__form-field"
        error={additionalFormErrors.name}
      >
        <Input
          className="custom-input"
          value={additionalFormFields.name}
          onChange={(event) =>
            onAdditionalFormFieldChange("name", event.target.value)
          }
        />
      </FormField>
    ),
    amount: (
      <FormField
        className="add-order__add-product__form-field"
        error={additionalFormErrors.amount}
      >
        <InputNumber
          className="custom-input"
          value={additionalFormFields.amount}
          onChange={(value) => onAdditionalFormFieldChange("amount", value)}
        />
      </FormField>
    ),
    action: (
      <Button
        onClick={onAddAdditionalClick}
        type="primary"
        shape="circle"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    ),
  });

  return (
    <div className="add-order">
      <div className="page-header">
        <Button
          onClick={() => props.history.goBack()}
          type="ghost"
          shape="circle"
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
        />
        <div>Добавить Заказ</div>
      </div>
      <Card>
        <div>
          <Row justify="space-between" gutter={[20, 5]}>
            <Col span={12}>
              <FormField error={fieldsErrors.contractorId}>
                <Select
                  className="custom-select"
                  loading={$contractorsItems.loading}
                  placeholder="Выберите поставщика"
                  value={formFields.contractorId}
                  onChange={(value) => onFormFieldChange("contractorId", value)}
                  allowClear
                >
                  {$contractorsItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </FormField>
            </Col>
            <Col span={12}>
              <FormField error={fieldsErrors.branchId}>
                <Select
                  className="custom-select"
                  loading={$branchItems.loading}
                  placeholder="Выберите филиал"
                  value={formFields.branchId}
                  onChange={(value) => onFormFieldChange("branchId", value)}
                  allowClear
                >
                  {$branchItems.data.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </FormField>
            </Col>
          </Row>
          <Row justify="space-between" gutter={[20, 5]}>
            <Col span={12}>
              <FormField error={fieldsErrors.orderDate}>
                <DatePicker
                  format={dateFormat}
                  placeholder={"Дата заказа"}
                  className="custom-date-picker"
                  // @ts-ignore
                  value={orderDateValue}
                  onChange={(_, value) =>
                    onFormFieldChange("orderDate", value ? value : undefined)
                  }
                />
              </FormField>
            </Col>
            <Col span={12}>
              <FormField error={fieldsErrors.expectedDate}>
                <DatePicker
                  format={dateFormat}
                  placeholder={"Дата желаемого заказа"}
                  className="custom-date-picker"
                  // @ts-ignore
                  value={expectedDateValue}
                  onChange={(_, value) =>
                    onFormFieldChange("expectedDate", value ? value : undefined)
                  }
                />
              </FormField>
            </Col>
          </Row>
          {fieldsErrors.products && !products.length && (
            <Alert
              className="custom-alert"
              message={fieldsErrors.products}
              type="error"
            />
          )}
          <Table
            className="add-order__products table-with-out-empty"
            rowClassName={(_, index) =>
              index === productsData.length - 1 ? "last-row" : ""
            }
            dataSource={productsData}
            columns={productsColumns}
            pagination={false}
          />
        </div>

        <div className="add-order__additional">
          <h3>Дополнительные расходы</h3>
          <Table
            className="add-order__products add-order__additional-table table-with-out-empty"
            rowClassName={(_, index) =>
              index === additionalData.length - 1 ? "last-row" : ""
            }
            dataSource={additionalData}
            columns={additionalColumns}
            pagination={false}
          />
          <FormField>
            <TextArea
              className="custom-input"
              placeholder="Оставьте комментарий"
              value={formFields.description}
              onChange={(event) =>
                onFormFieldChange("description", event.target.value)
              }
            />
          </FormField>
        </div>

        <Row className="add-order__buttons" justify="end" align="middle">
          <Button type="ghost" onClick={() => onOrderClick("DRAFT")}>
            Сохранить как черновик
          </Button>
          <Button type="primary" onClick={() => onOrderClick("ORDERED")}>
            Заказать
          </Button>
        </Row>
      </Card>
    </div>
  );
};
