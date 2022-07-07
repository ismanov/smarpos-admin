import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  Table,
  Form,
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
import { WarehouseIncomeProductI } from "app/businessLogicLayer/models/Client";
import { StringMapI } from "app/businessLogicLayer/models";

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = "YYYY-MM-DD";
const notFilledMessage = "Не заполнено поле";

const productsColumns = [
  {
    title: "",
    dataIndex: "num",
    width: 40,
  },
  {
    title: "Наименование товара",
    dataIndex: "product",
  },
  {
    title: "Ед. Изм.",
    dataIndex: "unit",
    width: 100,
  },
  {
    title: "Количество",
    dataIndex: "qty",
    width: 100,
  },
  {
    title: "Себестоимость",
    dataIndex: "costPrice",
    width: 200,
  },
  {
    title: <div className="t-a-c w-s-n">НДС/Прод.Цена</div>,
    dataIndex: "vat",
    width: 150,
  },
  {
    title: <div className="w-s-n">Наценка (Сумма/Процент)</div>,
    dataIndex: "markup",
    width: 300,
  },
  {
    title: "Продажная цена",
    dataIndex: "salesPrice",
    width: 200,
  },
  {
    title: "",
    dataIndex: "action",
  },
];

const calculateMarkup = (data, changeBy, product, clientNdsPercent) => {
  const { costPrice, markup, markupPercent, salesPrice } = data;

  if (costPrice) {
    let nds = 1;
    if (product && !product.noVat && clientNdsPercent) {
      nds = 1 + Number(parseFloat(clientNdsPercent) / 100);
    }

    switch (changeBy) {
      case "costPrice":
        return {
          ...data,
          salesPrice: Number(((markup + costPrice) * nds).toFixed(2)),
          markupPercent: Number(((100 * markup) / costPrice).toFixed(2)),
        };
        break;
      case "markupPercent":
        return {
          ...data,
          salesPrice: Number(
            ((costPrice + (markupPercent * costPrice) / 100) * nds).toFixed(2)
          ),
          markup: Number(((costPrice * markupPercent) / 100).toFixed(2)),
        };
        break;
      case "markup":
        return {
          ...data,
          salesPrice: Number(((markup + costPrice) * nds).toFixed(2)),
          markupPercent: Number(((100 * markup) / costPrice).toFixed(2)),
        };
        break;
      case "salesPrice":
        return {
          ...data,
          markupPercent: Number(
            ((salesPrice / costPrice - 1) * 100 * nds).toFixed(2)
          ),
          markup: Number((salesPrice - costPrice).toFixed(2)),
        };
        break;
      default:
        break;
    }
  }

  return { ...data };
};

export default (props) => {
  const { match, clientNdsPercent } = props;
  const companyId = match.params.companyId;
  const $branchItems = useStore(effector.stores.$branchItems);
  const $contractorsItems = useStore(effector.stores.$contractorsItems);
  const $productUnitsItems = useStore(effector.stores.$productUnitsItems);

  const $createWarehouseIncome = useStore(
    warehouseEffector.stores.$createWarehouseIncome
  );
  const $searchProducts = useStore(warehouseEffector.stores.$searchProducts);

  const [formFields, setFormFields] = useState<any>({});
  const [fieldsErrors, setFieldsErrors] = useState<StringMapI>({});

  const [products, setProducts] = useState<WarehouseIncomeProductI[]>([]);
  const [productFormFields, setProductFormFields] = useState<any>({});
  const [productFormErrors, setProductFormErrors] = useState<StringMapI>({});

  useEffect(() => {
    effector.effects.fetchContractorsItemsEffect({ companyId });
  }, []);

  useEffect(() => {
    if ($createWarehouseIncome.success) {
      notification["success"]({
        message: "Приход товаров добавлен",
      });

      setFormFields({});
      warehouseEffector.events.resetCreateWarehouseIncomeEvent();
      props.history.goBack();
    }
  }, [$createWarehouseIncome.success]);

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

  const onProductPriceFieldChange = (field, value) => {
    const data = {
      costPrice: Number(productFormFields.costPrice || 0),
      markup: Number(productFormFields.markup || 0),
      markupPercent: Number(productFormFields.markupPercent || 0),
      salesPrice: Number(productFormFields.salesPrice || 0),
      [field]: Number(value || 0),
    };
    const priceFields = calculateMarkup(
      data,
      field,
      productFormFields.product,
      clientNdsPercent
    );

    setProductFormFields({ ...productFormFields, ...priceFields });
  };

  const onProductSearch = (search) => {
    if (search.length >= 2) {
      warehouseEffector.effects.searchProductsEffect({
        search,
        withBalance: false,
        companyId,
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
    if (!productFormFields.costPrice) errors.costPrice = notFilledMessage;
    if (!productFormFields.salesPrice) errors.salesPrice = notFilledMessage;

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
        costPrice: productFormFields.costPrice,
        totalCost: productFormFields.costPrice * productFormFields.qty,
        markup: productFormFields.markup,
        salesPrice: productFormFields.salesPrice,
        qty: productFormFields.qty,
        unit: productFormFields.unit,
        unitId: productFormFields.unit.id,
        unitName: productFormFields.unit.name,
      },
    ]);

    setProductFormFields({});
    warehouseEffector.events.resetSearchProducts();
    effector.events.resetProductUnitsItems();
  };

  const onRemoveProductClick = (productId) => {
    setProducts(products.filter((item) => item.product.id !== productId));
  };

  const onSubmit = () => {
    const errors: StringMapI = {};

    if (!formFields.branchId) errors.branchId = notFilledMessage;
    // if (!formFields.contractorId) errors.contractorId = notFilledMessage;
    if (!formFields.documentDate) errors.documentDate = notFilledMessage;
    if (!products.length) errors.products = "Нет товаров";

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data: any = {
      toBranchId: formFields.branchId,
      contractor: { id: formFields.contractorId },
      documentDate: formFields.documentDate,
      incomeOfProductDetails: products,
      comment: formFields.description,
    };
    if (!!props.location?.state?.agreementId)
      data.agreementId = props.location.state.agreementId;

    warehouseEffector.effects.createWarehouseIncomeEffect(data);
  };

  const documentDateValue = formFields.documentDate
    ? moment(formFields.documentDate)
    : null;

  const productsData: any[] = products.map((item, index) => {
    return {
      key: item.product.id,
      num: index + 1,
      product: item.product.name,
      unit: item.unitName,
      qty: item.qty,
      costPrice: item.costPrice,
      vat: (
        <div className="add-income__products__vat">
          <div className="add-income__products__vat__title">
            {!item.product.noVat && clientNdsPercent
              ? `НДС - ${clientNdsPercent}%`
              : "Без НДС"}
          </div>
          <div>
            {`${item.unit && item.unit.price ? item.unit.price : 0}
          сум${item.unit && item.unit.name ? "/" + item.unit.name : ""}`}
          </div>
        </div>
      ),
      markup: item.markup,
      salesPrice: item.salesPrice,
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

  productsData.push({
    key: "form",
    num: "",
    product: (
      <FormField
        className="add-income__add-product__form-field"
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
          placeholder="Товар"
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
        className="add-income__add-product__form-field"
        error={productFormErrors.unit}
      >
        <Select
          className="custom-select"
          loading={$productUnitsItems.loading}
          placeholder="Ед. Изм."
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
        className="add-income__add-product__form-field"
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
      <FormField
        className="add-income__add-product__form-field"
        error={productFormErrors.costPrice}
      >
        <InputNumber
          className="custom-input"
          value={productFormFields.costPrice || undefined}
          placeholder="0"
          onChange={(value) => onProductPriceFieldChange("costPrice", value)}
        />
      </FormField>
    ),
    vat: (
      <div className="add-income__products__vat">
        <div className="add-income__products__vat__title">
          {productFormFields.product &&
          !productFormFields.product.noVat &&
          clientNdsPercent
            ? `НДС - ${clientNdsPercent}%`
            : "Без НДС"}
        </div>
        <div>
          {`${
            productFormFields.unit && productFormFields.unit.price
              ? productFormFields.unit.price
              : 0
          }
          сум${
            productFormFields.unit && productFormFields.unit.name
              ? "/" + productFormFields.unit.name
              : ""
          }`}
        </div>
      </div>
    ),
    markup: (
      <div className="add-income__add-product__markup-row">
        <FormField className="add-income__add-product__form-field">
          <InputNumber
            className="custom-input"
            value={productFormFields.markup || undefined}
            placeholder="0"
            onChange={(value) => onProductPriceFieldChange("markup", value)}
          />
        </FormField>
        <div className="add-income__add-product__markup-row__divider">/</div>
        <FormField className="add-income__add-product__form-field add-income__add-product__percent-field">
          <InputNumber
            className="custom-input"
            value={productFormFields.markupPercent || undefined}
            placeholder="0"
            onChange={(value) =>
              onProductPriceFieldChange("markupPercent", value)
            }
          />
        </FormField>
      </div>
    ),
    salesPrice: (
      <FormField
        className="add-income__add-product__form-field"
        error={productFormErrors.salesPrice}
      >
        <InputNumber
          className="custom-input"
          value={productFormFields.salesPrice || undefined}
          placeholder="0"
          onChange={(value) => onProductPriceFieldChange("salesPrice", value)}
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

  return (
    <Card>
      <div className="add-income">
        <div className="custom-content__header">
          <div className="custom-content__header__left">
            <Button
              onClick={() => props.history.goBack()}
              type="ghost"
              shape="circle"
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
            />
            <div className="custom-content__header__left-inner">
              <h1>Добавить Приход</h1>
            </div>
          </div>
        </div>
        <Form onFinish={onSubmit}>
          <div className="add-income__products">
            <Row justify="space-between" gutter={[20, 5]}>
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
              <Col span={12}>
                <FormField error={fieldsErrors.contractorId}>
                  <Select
                    className="custom-select"
                    loading={$contractorsItems.loading}
                    placeholder="Выберите поставщика"
                    value={formFields.contractorId}
                    onChange={(value) =>
                      onFormFieldChange("contractorId", value)
                    }
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
            </Row>
            <Row justify="space-between" gutter={[20, 5]}>
              <Col span={12}>
                <FormField error={fieldsErrors.documentDate}>
                  <DatePicker
                    format={dateFormat}
                    placeholder={"Дата заказа"}
                    className="custom-date-picker"
                    // @ts-ignore
                    value={documentDateValue}
                    onChange={(_, value) =>
                      onFormFieldChange(
                        "documentDate",
                        value ? value : undefined
                      )
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
              className="add-income__products-table table-with-out-empty"
              rowClassName={(_, index) =>
                index === productsData.length - 1 ? "last-row" : ""
              }
              dataSource={productsData}
              columns={productsColumns}
              pagination={false}
            />
          </div>

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

          <Row className="add-income__buttons" justify="end" align="middle">
            <Button
              htmlType="submit"
              type="primary"
              disabled={$createWarehouseIncome.loading}
            >
              Заказать
            </Button>
          </Row>
        </Form>
      </div>
    </Card>
  );
};
