import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
} from "antd";
import moment from "moment";

import Card from "app/presentationLayer/components/card";
import { FormField } from "app/presentationLayer/components/form-field";

import effector from "app/presentationLayer/effects/clients";
import promotionsEffector from "app/presentationLayer/effects/clients/promotions";
import { faChevronLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SelectDays } from "app/presentationLayer/components/select-days";
import {
  ProductUnitI,
  SearchProductI,
} from "app/businessLogicLayer/models/Product";
import { CreatePromotionI } from "app/businessLogicLayer/models/Promotions";
import { formatNumber, updateErrors, withDebounce } from "app/utils/utils";
import {
  AMOUNT,
  BASKET,
  bonusOnItems,
  bonusTypeItems,
  DAILY,
  dateFormat,
  MONTH_DAYS,
  notFilledMessage,
  PERCENTAGE,
  PRODUCT,
  promotionOnItems,
  repeatTypes,
  WEEK_DAYS,
} from "../constants";

import { disabledDate, getPriceFromUnit } from "../helper";
import "./styles.scss";
import { StringMapI } from "app/businessLogicLayer/models";

const { Option } = Select;

interface ProductI extends SearchProductI {
  units: ProductUnitI[];
  unitsForBonus: ProductUnitI[];
}

interface ProductsForBonusI extends ProductI {
  disabled?: boolean;
  selectedUnit: ProductUnitI;
}

class Condition {
  promotionOn: typeof PRODUCT | typeof BASKET | undefined;
  promotedProduct: ProductI | undefined;
  unit: ProductUnitI | undefined;
  amount: number;
  amountTo: number | undefined;
  connected: boolean;
  errors: StringMapI;

  constructor(props) {
    const { promotionOn } = props;

    this.promotionOn = promotionOn;
    this.promotedProduct = undefined;
    this.unit = undefined;
    this.amount = 1;
    this.amountTo = undefined;
    this.connected = false;
    this.errors = {};
  }
}

class Bonus {
  bonusOn: typeof PRODUCT | typeof BASKET | undefined;
  bonusProduct: ProductI | undefined;
  unitId: number | undefined;
  allProducts: boolean;
  productCount: number | undefined;
  bonusType: typeof PERCENTAGE | typeof AMOUNT;
  bonusAmount: number | undefined;
  errors: StringMapI;

  constructor(props) {
    const {
      bonusOn,
      bonusProduct,
      unitId,
      allProducts = false,
      productCount,
      bonusType = PERCENTAGE,
      bonusAmount,
    } = props;

    this.bonusOn = bonusOn;
    this.bonusProduct = bonusProduct;
    this.unitId = unitId;
    this.allProducts = allProducts;
    this.productCount = productCount;
    this.bonusType = bonusType;
    this.bonusAmount = bonusAmount;
    this.errors = {};
  }
}

export const AddPromotion = (props) => {
  const { match } = props;
  const { companyId } = match.params;
  console.log(props, "last props >>>>>//");

  const $branchItems = useStore(effector.stores.$branchItems);
  const $createPromotion = useStore(promotionsEffector.stores.$createPromotion);
  const $searchProducts = useStore(promotionsEffector.stores.$searchProducts);
  const $productUnitsItems = useStore(
    promotionsEffector.stores.$productUnitsItems
  );

  const [commonFormFields, setCommonFormFields] = useState<any>({
    repeatType: DAILY,
    includeVAT: true,
    dateFrom: moment().format(dateFormat),
  });
  const [commonFieldsErrors, setCommonFieldsErrors] = useState<StringMapI>({});

  const [conditions, setConditions] = useState<Condition[]>([
    new Condition({}),
  ]);
  const [bonuses, setBonuses] = useState<Bonus[]>([new Bonus({})]);

  const [countRepetitionsEnabled, setCountRepetitionsEnabled] = useState<
    boolean
  >(false);

  useEffect(() => {
    setCommonFormFields({ ...commonFormFields, repeats: {} });
  }, [commonFormFields.repeatType]);

  useEffect(() => {
    if ($productUnitsItems.productId) {
      setConditions(
        conditions.map((item) => {
          if (
            item.promotedProduct &&
            item.promotedProduct.id === $productUnitsItems.productId
          ) {
            const units = $productUnitsItems.data;

            const selectedUnit =
              units.length === 1 ? units[0] : units.find((item) => item.base);
            const unitsForBonus = selectedUnit ? [selectedUnit] : [];

            return {
              ...item,
              promotedProduct: {
                ...item.promotedProduct,
                units,
                unitsForBonus: unitsForBonus,
              },
              unit: selectedUnit,
            };
          }

          return item;
        })
      );
    }
  }, [$productUnitsItems.data]);

  useEffect(() => {
    if ($createPromotion.success) {
      notification["success"]({
        message: "Акция добавлена",
      });

      setCommonFormFields({});
      promotionsEffector.events.resetCreatePromotionEvent();
      props.history.goBack();
    }
  }, [$createPromotion.success]);

  const onFormFieldChange = (fields) => {
    setCommonFormFields({ ...commonFormFields, ...fields });

    const errors = updateErrors(commonFieldsErrors, fields);
    setCommonFieldsErrors(errors);
  };

  useEffect(() => {
    const enabled =
      conditions.find(
        (item) => !item.amount || !item.amountTo || item.promotionOn === BASKET
      ) === undefined;
    setCountRepetitionsEnabled(enabled);

    if (!enabled) {
      onFormFieldChange({ countRepetitions: false });
    }
  }, [conditions]);

  const onBranchChange = (branchId) => {
    onFormFieldChange({ branchId });

    setConditions([new Condition({})]);
    setBonuses([new Bonus({})]);

    promotionsEffector.events.resetSearchProducts();
    promotionsEffector.events.resetProductUnitsItems();
  };

  const onProductSearch = (search) => {
    if (search.length > 2 || search.length == 0) {
      withDebounce(() => {
        promotionsEffector.effects.searchProductsEffect({
          search,
          withBalance: false,
          companyId,
          branchId: commonFormFields.branchId,
        });
      });
    }
  };

  const conditionsValidation = () => {
    let conditionsErrors: StringMapI = {};

    const newConditions = conditions.map((condition) => {
      const errors: StringMapI = {};
      if (!condition.promotionOn) errors.promotionOn = notFilledMessage;
      if (!condition.amount) errors.amount = notFilledMessage;

      if (condition.promotionOn === PRODUCT) {
        if (!condition.promotedProduct)
          errors.promotedProduct = notFilledMessage;
        if (!condition.unit) errors.unit = notFilledMessage;
      }

      conditionsErrors = { ...conditionsErrors, ...errors };

      return { ...condition, errors };
    });
    setConditions(newConditions);

    return conditionsErrors;
  };

  const bonusesValidation = () => {
    let bonusesErrors: StringMapI = {};

    const newBonuses = bonuses.map((bonus) => {
      const errors: StringMapI = {};

      if (!bonus.bonusOn) errors.bonusOn = notFilledMessage;
      if (bonus.bonusOn === PRODUCT) {
        if (!bonus.bonusProduct) errors.bonusProduct = notFilledMessage;
        if (!bonus.unitId) errors.unitId = notFilledMessage;

        if (!bonus.allProducts) {
          if (!bonus.productCount) errors.productCount = notFilledMessage;
        }
      }

      if (!bonus.bonusType) errors.bonusType = notFilledMessage;
      if (!bonus.bonusAmount) errors.bonusAmount = notFilledMessage;

      bonusesErrors = { ...bonusesErrors, ...errors };

      return { ...bonus, errors };
    });
    setBonuses(newBonuses);

    return bonusesErrors;
  };

  const updateConditionByIndex = (index, updatedCondition: Condition) => {
    const conditionsClone = [...conditions];
    conditionsClone.splice(index, 1, updatedCondition);
    setConditions(conditionsClone);
  };

  const onConditionFieldChange = (index, fields) => {
    const condition = conditions[index];
    const errors = updateErrors(condition.errors, fields);

    const updatedCondition: Condition = { ...condition, errors, ...fields };

    updateConditionByIndex(index, updatedCondition);
  };

  const onConditionPromotionOnChange = (index, promotionOn) => {
    onConditionFieldChange(index, new Condition({ promotionOn }));
  };

  const onConditionProductChange = (index, productId) => {
    if (productId) {
      const promotedProduct = productId
        ? $searchProducts.data.find((item) => item.id === productId)
        : undefined;

      onConditionFieldChange(index, {
        promotedProduct: { ...promotedProduct, units: [] },
        unit: undefined,
      });
      promotionsEffector.effects.fetchProductUnitsItemsEffect({
        productId,
        branchId: commonFormFields.branchId,
      });
    } else {
      onConditionFieldChange(index, {
        promotedProduct: undefined,
        unit: undefined,
      });
      promotionsEffector.events.resetSearchProducts();
      promotionsEffector.events.resetProductUnitsItems();
    }
  };

  const onConditionProductUnitChange = (index, unitId) => {
    const promotedProduct = conditions[index].promotedProduct;

    if (promotedProduct) {
      const selectedUnit = promotedProduct.units.find(
        (item) => item.id === unitId
      );
      const unitsForBonus = [selectedUnit];

      onConditionFieldChange(index, {
        unit: selectedUnit,
        promotedProduct: { ...promotedProduct, unitsForBonus },
      });
    }
  };

  const onAddConditionClick = () => {
    const errors = conditionsValidation();

    if (!Object.keys(errors).length) {
      setConditions([...conditions, new Condition({})]);
    }
  };

  const onRemoveConditionClick = (index) => {
    const conditionsClone = [...conditions];
    conditionsClone.splice(index, 1);
    if (!conditionsClone.length) {
      conditionsClone.push(new Condition({}));
    }
    setConditions(conditionsClone);
  };

  const updateBonusByIndex = (index, updatedBonus) => {
    const bonusesClone = [...bonuses];
    bonusesClone.splice(index, 1, updatedBonus);
    setBonuses(bonusesClone);
  };

  const onBonusFieldChange = (index, fields) => {
    const bonus = bonuses[index];
    const errors = updateErrors(bonus.errors, fields);

    const updatedBonus = { ...bonus, errors, ...fields };

    updateBonusByIndex(index, updatedBonus);
  };

  const onBonusOnFieldChange = (index, bonusOn) => {
    const newBonus = new Bonus({ bonusOn });
    onBonusFieldChange(index, newBonus);
  };

  const onBonusProductChange = (index, productId) => {
    const bonusProduct = productId
      ? productsForBonus.find((item) => item.id === productId)
      : undefined;

    if (bonusProduct) {
      const selectedUnit = bonusProduct.unitsForBonus[0];
      const newBonus = new Bonus({
        bonusOn: PRODUCT,
        bonusProduct,
        unitId: selectedUnit.id,
      });

      onBonusFieldChange(index, newBonus);
    }
  };

  const onAddBonusClick = () => {
    const errors = bonusesValidation();

    if (!Object.keys(errors).length) {
      setBonuses([...bonuses, new Bonus({})]);
    }
  };

  const onRemoveBonusClick = (index) => {
    const bonusesClone = [...bonuses];
    bonusesClone.splice(index, 1);

    if (!bonusesClone.length) {
      bonusesClone.push(new Bonus({}));
    }
    setBonuses(bonusesClone);
  };

  const onCreateClick = () => {
    const commonErrors: StringMapI = {};

    if (!commonFormFields.name) commonErrors.name = notFilledMessage;
    if (!commonFormFields.branchId) commonErrors.branchId = notFilledMessage;
    if (!commonFormFields.dateFrom) commonErrors.dateFrom = notFilledMessage;
    if (!commonFormFields.dateTo) commonErrors.dateTo = notFilledMessage;
    if (!commonFormFields.repeatType)
      commonErrors.repeatType = notFilledMessage;

    if (
      commonFormFields.repeatType === WEEK_DAYS ||
      commonFormFields.repeatType === MONTH_DAYS
    ) {
      if (
        !commonFormFields.repeats ||
        !Object.keys(commonFormFields.repeats).length
      )
        commonErrors.repeats = notFilledMessage;
    }

    setCommonFieldsErrors(commonErrors);

    const conditionsErrors = conditionsValidation();
    const bonusesErrors = bonusesValidation();

    if (
      Object.keys(commonErrors).length ||
      Object.keys(conditionsErrors).length ||
      Object.keys(bonusesErrors).length
    ) {
      console.log("errors", commonErrors, conditionsErrors, bonusesErrors);
      return;
    }

    const conditionsData = conditions.map((condition, index) => {
      const item: any = {
        promotionOn: condition.promotionOn,
        amount: condition.amount,
        amountTo: condition.amountTo,
        sortIndex: index + 1,
      };

      if (condition.promotionOn === PRODUCT) {
        item.promotedProductId = condition.promotedProduct?.id;
        item.promotedProductName = condition.promotedProduct?.name;
        item.unitId = condition.unit?.id;
      }

      return item;
    });

    const bonusesData = bonuses.map((bonus, index) => {
      const item: any = {
        bonusOn: bonus.bonusOn,
        allProducts: bonus.allProducts,
        bonusType: bonus.bonusType,
        bonusAmount: bonus.bonusAmount,
        sortIndex: index + 1,
      };

      if (bonus.bonusOn === PRODUCT) {
        item.bonusProductId = bonus.bonusProduct?.id;
        item.bonusProductName = bonus.bonusProduct?.name;
        item.unitId = bonus.unitId;
      }

      if (!bonus.allProducts) {
        item.productCount = bonus.productCount;
      }

      return item;
    });

    const data: CreatePromotionI = {
      companyId,
      branchId: commonFormFields.branchId,
      name: commonFormFields.name,
      dateFrom: commonFormFields.dateFrom,
      dateTo: commonFormFields.dateTo,
      repeatType: commonFormFields.repeatType,
      includeVAT: commonFormFields.includeVAT,
      countRepetitions: countRepetitionsEnabled
        ? commonFormFields.countRepetitions
        : false,
      conditions: conditionsData,
      bonuses: bonusesData,
    };

    if (
      commonFormFields.repeatType === WEEK_DAYS ||
      commonFormFields.repeatType === MONTH_DAYS
    ) {
      data.repeats = Object.keys(commonFormFields.repeats).map((item) =>
        parseInt(item)
      );
    }
    if (props.agreementId) data.agreementId = props.agreementId;

    promotionsEffector.effects.createPromotionEffect(data);
  };

  const conditionsWithConnections = conditions.map((condition) => {
    if (condition.promotionOn === BASKET) {
      const bonusWithBasket = bonuses.find((item) => item.bonusOn === BASKET);
      if (bonusWithBasket) {
        return { ...condition, connected: true };
      }
    } else if (condition.promotionOn === PRODUCT) {
      const bonus = bonuses.find(
        (item) =>
          item.bonusProduct &&
          item.bonusProduct.id &&
          condition.promotedProduct &&
          item.bonusProduct.id === condition.promotedProduct.id
      );
      if (bonus) {
        return { ...condition, connected: true };
      }
    }

    return condition;
  });

  const conditionsWithProducts = conditions.filter(
    (item) => item.promotedProduct && !!item.unit
  );

  const conditionWithBasket = conditions.find(
    (item) => item.promotionOn === BASKET
  );
  const promotionOnItemsChecked = promotionOnItems.map((item) => {
    return item.code === BASKET
      ? { ...item, disabled: !!conditionWithBasket }
      : item;
  });

  const searchProductsFiltered: any = $searchProducts.data.map((item) => {
    if (
      conditions.find(
        (cond) => cond.promotedProduct && cond.promotedProduct.id === item.id
      )
    ) {
      return { ...item, disabled: true };
    }

    return item;
  });

  // @ts-ignore
  const productsForBonus: ProductsForBonusI[] = conditionsWithProducts
    .map((item) => item.promotedProduct)
    .map((item) => {
      if (
        bonuses.find(
          (bonus) =>
            bonus.bonusProduct && item && bonus.bonusProduct.id === item.id
        )
      ) {
        return { ...item, disabled: true };
      }

      return item;
    });

  const getMinConditionAmount = (type) => {
    console.log("getMinConditionAmount", conditionsWithProducts);
    if (type === BASKET) {
      return conditionsWithProducts.reduce((acc, item) => {
        // @ts-ignore
        return acc + item.unit.price * item.amount;
      }, 0);
    }

    return 1;
  };

  const bonusOnItemsCheck = (bonusIndex) => {
    let basketBonusExist = false;
    let productBonusExist = false;

    bonuses.forEach((item, index) => {
      if (index !== bonusIndex) {
        if (item.bonusOn === BASKET) {
          basketBonusExist = true;
        } else if (item.bonusOn === PRODUCT) {
          productBonusExist = true;
        }
      }
    });

    return bonusOnItems.map((item) => {
      if (item.code === BASKET) {
        return {
          ...item,
          disabled:
            !conditionWithBasket || basketBonusExist || productBonusExist,
        };
      } else if (item.code === PRODUCT) {
        return {
          ...item,
          disabled: !productsForBonus.length || basketBonusExist,
        };
      }

      return item;
    });
  };

  const getMaxProductCount = (bonusProductId) => {
    const condition = conditions.find(
      (item) =>
        item.promotedProduct && item.promotedProduct.id === bonusProductId
    );

    return condition ? condition.amount : Number.MAX_SAFE_INTEGER;
  };

  const getMaxBonusAmount = (bonus: Bonus) => {
    if (bonus.bonusType === PERCENTAGE) {
      return 100;
    }

    if (bonus.bonusOn === BASKET) {
      return conditionWithBasket ? conditionWithBasket.amount : 0;
    } else if (bonus.bonusOn === PRODUCT) {
      if (bonus.bonusProduct && bonus.unitId) {
        const unit = bonus.bonusProduct.unitsForBonus.find(
          (item) => item.id === bonus.unitId
        );

        return unit && unit.price ? unit.price : 0;
      }
    }

    return 0;
  };

  console.log("conditionsWithConnections", conditionsWithConnections);
  console.log("bonuses", bonuses);

  return (
    <Card className="add-promotion">
      <div className="custom-content__header">
        <div className="custom-content__header__left">
          <Button
            type="ghost"
            shape="circle"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            onClick={() => props.history.goBack()}
          />
          <div className="custom-content__header__left-inner">
            <h1>Добавить Акцию</h1>
          </div>
        </div>
      </div>

      <div className="add-promotion__common-fields">
        <h2>Общая информация</h2>
        <Row justify="space-between" gutter={[24, 0]}>
          <Col span={12}>
            <FormField title="Название акции" error={commonFieldsErrors.name}>
              <Input
                className="custom-input"
                placeholder="Введите название акции"
                value={commonFormFields.name}
                onChange={(event) =>
                  onFormFieldChange({ name: event.target.value })
                }
                maxLength={60}
              />
            </FormField>
          </Col>
          <Col span={12}>
            <FormField title="Филиал" error={commonFieldsErrors.branchId}>
              <Select
                className="custom-select"
                placeholder="Выберите филиал"
                value={commonFormFields.branchId}
                onChange={onBranchChange}
                loading={$branchItems.loading}
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
        <Row justify="space-between" gutter={[24, 0]}>
          <Col span={12}>
            <FormField
              title="Период проведения - от"
              error={commonFieldsErrors.dateFrom}
            >
              <DatePicker
                format={dateFormat}
                placeholder="От"
                className="custom-date-picker"
                value={
                  commonFormFields.dateFrom
                    ? moment(commonFormFields.dateFrom)
                    : null
                }
                disabledDate={(current) =>
                  disabledDate(current, {
                    toDate: moment(),
                    fromDate: commonFormFields.dateTo
                      ? moment(commonFormFields.dateTo)
                      : null,
                  })
                }
                onChange={(_, value) =>
                  onFormFieldChange({ dateFrom: value ? value : undefined })
                }
              />
            </FormField>
          </Col>
          <Col span={12}>
            <FormField
              error={commonFieldsErrors.dateTo}
              title="Период проведения - до"
            >
              <DatePicker
                format={dateFormat}
                placeholder="До"
                className="custom-date-picker"
                value={
                  commonFormFields.dateTo
                    ? moment(commonFormFields.dateTo)
                    : null
                }
                disabledDate={(current) =>
                  disabledDate(current, {
                    toDate: commonFormFields.dateFrom
                      ? moment(commonFormFields.dateFrom)
                      : moment(),
                  })
                }
                onChange={(_, value) =>
                  onFormFieldChange({ dateTo: value ? value : undefined })
                }
              />
            </FormField>
          </Col>
        </Row>
        <Row justify="space-between" gutter={[24, 0]}>
          <Col span={12}>
            <FormField title="Повторять" error={commonFieldsErrors.repeatType}>
              <Select
                className="custom-select"
                placeholder="Выберите повторения"
                value={commonFormFields.repeatType}
                onChange={(repeatType) => onFormFieldChange({ repeatType })}
              >
                {repeatTypes.map((item) => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormField>
          </Col>
          {commonFormFields.repeatType &&
            commonFormFields.repeatType !== DAILY && (
              <Col span={12}>
                <FormField
                  title={`Выберите ${
                    commonFormFields.repeatType === WEEK_DAYS
                      ? "дни недели"
                      : "даты"
                  }`}
                  error={commonFieldsErrors.repeats}
                >
                  <SelectDays
                    type={
                      commonFormFields.repeatType === WEEK_DAYS
                        ? "week"
                        : "month"
                    }
                    selectedDays={commonFormFields.repeats}
                    onChange={(repeats) => onFormFieldChange({ repeats })}
                  />
                </FormField>
              </Col>
            )}
        </Row>
      </div>
      {commonFormFields.branchId && (
        <div className="add-promotion__details">
          <div className="add-promotion__details__col">
            <div className="add-promotion__details__block">
              <h2 className="add-promotion__details__head">
                Условия проведения акции
              </h2>
              {commonFieldsErrors.conditions && (
                <Alert message={commonFieldsErrors.conditions} type="error" />
              )}
              <div className="add-promotion__details__inner">
                {conditionsWithConnections.map((condition, index) => (
                  <div
                    key={index}
                    className="add-promotion__details__block__item"
                  >
                    <div className="add-promotion__details__block__item__remove">
                      <Button
                        onClick={() => onRemoveConditionClick(index)}
                        type="primary"
                        danger
                        shape="circle"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        disabled={condition.connected}
                      />
                    </div>
                    <FormField error={condition.errors.promotionOn}>
                      <Select
                        className="custom-select"
                        placeholder="Выберите на что скидка"
                        value={condition.promotionOn}
                        onChange={(promotionOn) =>
                          onConditionPromotionOnChange(index, promotionOn)
                        }
                        disabled={condition.connected}
                      >
                        {promotionOnItemsChecked.map((item) => (
                          <Option
                            key={item.code}
                            value={item.code}
                            disabled={item.disabled}
                          >
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </FormField>
                    {condition.promotionOn === PRODUCT && (
                      <Row justify="space-between" gutter={[16, 0]}>
                        <Col span={16}>
                          <FormField
                            desc={getPriceFromUnit(condition.unit)}
                            error={condition.errors.promotedProduct}
                          >
                            <Select
                              showSearch
                              className="custom-select"
                              loading={$searchProducts.loading}
                              value={
                                condition.promotedProduct
                                  ? condition.promotedProduct.id
                                  : undefined
                              }
                              placeholder="Выберите товар"
                              onSearch={onProductSearch}
                              onChange={(value) =>
                                onConditionProductChange(index, value)
                              }
                              filterOption={false}
                              defaultActiveFirstOption={false}
                              allowClear
                              disabled={condition.connected}
                            >
                              {// @ts-ignore
                              searchProductsFiltered.map((item) => (
                                <Option
                                  key={item.id}
                                  value={item.id}
                                  disabled={item.disabled}
                                >
                                  {item.name}; баркод: {item.barcode}
                                </Option>
                              ))}
                            </Select>
                          </FormField>
                        </Col>
                        <Col span={8}>
                          {condition.promotedProduct && (
                            <FormField>
                              <Select
                                className="custom-select"
                                loading={
                                  $productUnitsItems.loading &&
                                  $productUnitsItems.productId ===
                                    condition.promotedProduct.id
                                }
                                placeholder="Ед. Изм."
                                value={
                                  condition.unit ? condition.unit.id : undefined
                                }
                                onChange={(value) =>
                                  onConditionProductUnitChange(index, value)
                                }
                                disabled={
                                  condition.connected ||
                                  condition.promotedProduct.units.length === 1
                                }
                              >
                                {condition.promotedProduct.units.map((item) => (
                                  <Option value={item.id} key={item.id}>
                                    {item.name}
                                  </Option>
                                ))}
                              </Select>
                            </FormField>
                          )}
                        </Col>
                      </Row>
                    )}
                    <div className="row-with-desc">
                      <Row justify="space-between" gutter={[16, 0]}>
                        <Col span={12}>
                          <FormField error={condition.errors.amount}>
                            <InputNumber
                              className="custom-input"
                              placeholder="От"
                              value={condition.amount}
                              onChange={(value) =>
                                onConditionFieldChange(index, {
                                  amount:
                                    value ||
                                    getMinConditionAmount(
                                      condition.promotionOn
                                    ),
                                })
                              }
                              min={getMinConditionAmount(condition.promotionOn)}
                              formatter={formatNumber}
                            />
                          </FormField>
                        </Col>
                        <Col span={12}>
                          <FormField error={condition.errors.amountTo}>
                            <InputNumber
                              className="custom-input"
                              placeholder="До"
                              value={condition.amountTo}
                              onChange={(amountTo) =>
                                onConditionFieldChange(index, { amountTo })
                              }
                              min={condition.amount}
                              formatter={formatNumber}
                            />
                          </FormField>
                        </Col>
                      </Row>
                      {condition.promotionOn === BASKET && (
                        <Alert
                          className="row-with-desc__desc"
                          type="info"
                          message="Значение “Сумма от” может меняться в зависимости от стоимости и количества добавленных товаров."
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="primary"
                className="add-promotion__details__add-btn"
                onClick={onAddConditionClick}
              >
                Добавить ещё условие
              </Button>
            </div>
          </div>
          <div className="add-promotion__details__col add-promotion__details__col_right">
            <div className="add-promotion__details__block">
              <h2 className="add-promotion__details__head">Получаемый бонус</h2>
              {commonFieldsErrors.bonuses && (
                <Alert message={commonFieldsErrors.bonuses} type="error" />
              )}
              <div className="add-promotion__details__inner">
                {bonuses.map((bonus, bonusIndex) => {
                  return (
                    <div
                      key={bonusIndex}
                      className="add-promotion__details__block__item"
                    >
                      <div className="add-promotion__details__block__item__remove">
                        <Button
                          onClick={() => onRemoveBonusClick(bonusIndex)}
                          type="primary"
                          danger
                          shape="circle"
                          icon={<FontAwesomeIcon icon={faTrash} />}
                        />
                      </div>
                      <FormField error={bonus.errors.bonusOn}>
                        <Select
                          className="custom-select"
                          placeholder="Выберите на что бонус"
                          value={bonus.bonusOn}
                          onChange={(value) =>
                            onBonusOnFieldChange(bonusIndex, value)
                          }
                        >
                          {bonusOnItemsCheck(bonusIndex).map((item) => (
                            <Option
                              key={item.code}
                              value={item.code}
                              disabled={item.disabled}
                            >
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </FormField>
                      {bonus.bonusOn === PRODUCT && (
                        <Row justify="space-between" gutter={[16, 0]}>
                          <Col span={16}>
                            <FormField error={bonus.errors.bonusProduct}>
                              <Select
                                className="custom-select"
                                placeholder="Выберите товар"
                                value={
                                  bonus.bonusProduct
                                    ? bonus.bonusProduct.id
                                    : undefined
                                }
                                onChange={(value) =>
                                  onBonusProductChange(bonusIndex, value)
                                }
                              >
                                {productsForBonus.map((item) => (
                                  <Option
                                    key={item.id}
                                    value={item.id}
                                    disabled={item.disabled}
                                  >
                                    {item.name}; баркод: {item.barcode}
                                  </Option>
                                ))}
                              </Select>
                            </FormField>
                          </Col>
                          <Col span={8}>
                            {bonus.bonusProduct && (
                              <FormField>
                                <Select
                                  className="custom-select"
                                  placeholder="Ед. Изм."
                                  value={bonus.unitId}
                                  onChange={(unitId) =>
                                    onBonusFieldChange(bonusIndex, { unitId })
                                  }
                                  disabled={
                                    bonus.bonusProduct.unitsForBonus.length ===
                                    1
                                  }
                                >
                                  {bonus.bonusProduct.unitsForBonus.map(
                                    (item) => (
                                      <Option value={item.id} key={item.id}>
                                        {item.name}
                                      </Option>
                                    )
                                  )}
                                </Select>
                              </FormField>
                            )}
                          </Col>
                        </Row>
                      )}
                      {bonus.bonusOn === PRODUCT && (
                        <FormField className="add-promotion__details__block__check">
                          <Checkbox
                            checked={bonus.allProducts}
                            onChange={(e) =>
                              onBonusFieldChange(bonusIndex, {
                                allProducts: e.target.checked,
                              })
                            }
                          >
                            На все количество
                          </Checkbox>
                        </FormField>
                      )}
                      <Row justify="space-between" gutter={[16, 0]}>
                        <Col span={7}>
                          {bonus.bonusOn === PRODUCT && bonus.bonusProduct && (
                            <FormField error={bonus.errors.productCount}>
                              <InputNumber
                                className="custom-input"
                                placeholder="Кол-во"
                                value={
                                  bonus.allProducts
                                    ? undefined
                                    : bonus.productCount
                                }
                                disabled={bonus.allProducts}
                                onChange={(productCount) =>
                                  onBonusFieldChange(bonusIndex, {
                                    productCount,
                                  })
                                }
                                min={1}
                                max={getMaxProductCount(bonus.bonusProduct.id)}
                                formatter={formatNumber}
                              />
                            </FormField>
                          )}
                        </Col>
                        <Col span={6}>
                          <FormField error={bonus.errors.bonusType}>
                            <Select
                              className="custom-select"
                              placeholder="Тип"
                              value={bonus.bonusType}
                              onChange={(bonusType) =>
                                onBonusFieldChange(bonusIndex, { bonusType })
                              }
                            >
                              {bonusTypeItems.map((item) => (
                                <Option key={item.code} value={item.code}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          </FormField>
                        </Col>
                        <Col span={11}>
                          <FormField error={bonus.errors.bonusAmount}>
                            <InputNumber
                              className="custom-input"
                              placeholder="Бонус"
                              value={bonus.bonusAmount}
                              onChange={(bonusAmount) =>
                                onBonusFieldChange(bonusIndex, { bonusAmount })
                              }
                              min={1}
                              max={getMaxBonusAmount(bonus)}
                              formatter={formatNumber}
                            />
                          </FormField>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </div>
              <Button
                type="primary"
                className="add-promotion__details__add-btn"
                onClick={onAddBonusClick}
              >
                Добавить ещё бонус
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="add-promotion__additional-fields">
        <h2>Дополнительные параметры: </h2>
        <FormField>
          <Checkbox
            checked={commonFormFields.includeVAT}
            onChange={(event) =>
              onFormFieldChange({ includeVAT: event.target.checked })
            }
          >
            Учитывать НДС
          </Checkbox>
        </FormField>
        <FormField>
          <Checkbox
            checked={
              countRepetitionsEnabled && commonFormFields.countRepetitions
            }
            onChange={(event) =>
              onFormFieldChange({ countRepetitions: event.target.checked })
            }
            disabled={!countRepetitionsEnabled}
          >
            Применять бонус при каждом случае соблюдения условия
          </Checkbox>
        </FormField>
        <Alert
          className="add-promotion__additional-fields__desc"
          type="info"
          message={`Данная настройка работает только для товаров и может быть включена только при заполнении полей "Количество/Сумма от" и "Количество/Сумма до"`}
        />
      </div>

      <Row className="add-promotion__buttons" justify="end" align="middle">
        <Button type="primary" onClick={onCreateClick}>
          Создать
        </Button>
      </Row>
    </Card>
  );
};
