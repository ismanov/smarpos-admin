import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Input,
  InputNumber,
  Checkbox,
  Row,
  Modal,
  Button,
  Form,
  Spin,
  notification,
  Col,
  Select,
  Cascader,
} from "antd";
import { FormField } from "app/presentationLayer/components/form-field";
import catalogEffector from "app/presentationLayer/effects/clients/catalog";
import "./styles.scss";
import {
  faBars,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";

// const vats = [ { id: 0, name: 'Социальный (Без НДС)' }, { id: 1, name: 'Не социальный (с НДС)' } ];

const { Option } = Select;

export const AddEditProductModal = (props) => {
  const { modalProps, setModalProps, branchId } = props;
  const { productId, categoryId } = modalProps;

  const [formFields, setFormFields] = useState<any>({});
  const [fieldsErrors, setFieldsErrors] = useState<any>({});

  const [units, setUnits] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [unitCount, setUnitCount] = useState();
  const [unit, setUnit] = useState<any>();

  // @ts-ignore
  const $currentProduct = useStore(catalogEffector.stores.$currentProduct);
  const $createCatalogProduct = useStore(
    catalogEffector.stores.$createCatalogProduct
  );
  const $updateCatalogProduct = useStore(
    catalogEffector.stores.$updateCatalogProduct
  );
  const $catalog = useStore(catalogEffector.stores.$catalog);
  const $unitsItems = useStore(catalogEffector.stores.$unitsItems);
  const $vatsItems = useStore(catalogEffector.stores.$vatsItems);

  const productDetailsData: any = $currentProduct.data;

  useEffect(() => {
    catalogEffector.effects.fetchUnitsItemsEffect({});
    catalogEffector.effects.fetchVatsItemsEffect({});

    if (productId) {
      catalogEffector.effects.fetchCurrentProductEffect({
        productId,
        branchId,
      });
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      setFormFields({
        category: categoryId,
      });
    }
  }, [categoryId]);

  useEffect(() => {
    if (productDetailsData) {
      setFormFields({
        category: productDetailsData!.categoryDTO.id,
        name: productDetailsData!.name,
        barcode: productDetailsData!.barcode,
        vatBarcode: productDetailsData!.vatBarcode,
        unit: productDetailsData!.unit,
        favorite: productDetailsData!.favorite,
        salesPrice: productDetailsData!.salesPrice,
        vatRate: productDetailsData!.vatRate,
        noVat: productDetailsData!.noVat,
      });

      if ($unitsItems.data.length) {
        // @ts-ignore
        if (productDetailsData.units && productDetailsData.units.length > 0) {
          let firstTime = true;
          // @ts-ignore
          let unitList = productDetailsData.units.map((u) => {
            let found = $unitsItems.data.find((u1) => u1.id === u.unitId);
            if (u.coefficient < 1 && firstTime) {
              firstTime = false;
            }
            return {
              isBase: u.base,
              coefficient: u.coefficient,
              unit: found,
              count: u.count,
            };
          });
          setUnits(unitList);
        }
      }
    }
  }, [productDetailsData, $unitsItems.data]);

  useEffect(() => {
    if ($createCatalogProduct.success) {
      notification["success"]({
        message: "Товар добавлен",
      });

      closeModal();
    }
  }, [$createCatalogProduct.success]);

  useEffect(() => {
    if ($updateCatalogProduct.success) {
      notification["success"]({
        message: "Товар обновлен",
      });

      closeModal();
    }
  }, [$updateCatalogProduct.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (productId) {
      catalogEffector.events.resetUpdateCatalogProductEvent();
      catalogEffector.events.resetCurrentProductEvent();
    } else {
      catalogEffector.events.resetCreateCatalogProductEvent();
    }
    setModalProps({ ...modalProps, shouldRender: false, productId: null });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onCategoryChange = (categories) => {
    setFormFields({
      ...formFields,
      category: categories[categories.length - 1],
    });
  };

  const onUnitChange = (value) => {
    const unit = $unitsItems.data.find((item) => item.id === value);

    onFormFieldChange({ unit });
    setUnits([
      {
        isBase: true,
        unit,
        count: 1,
        coefficient: 1.0,
      },
    ]);
    setEditMode(false);
  };

  const onFinish = () => {
    const notFilledMessage = "Не заполнено поле";
    const errors: any = {};

    if (!formFields.category) errors.category = notFilledMessage;
    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.barcode) {
      errors.barcode = notFilledMessage;
    } else if (isNaN(formFields.barcode)) {
      errors.barcode = "Не валидный штрих код";
    }

    if (!formFields.unit) errors.unit = notFilledMessage;
    if (!formFields.vatBarcode || formFields?.vatBarcode?.length !== 17)
      errors.vatBarcode = "Введите 17-значний код";
    if (!formFields.salesPrice) errors.salesPrice = notFilledMessage;

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    let data: any = {
      branchId,
      custom: true,
      categoryDTO: { id: formFields.category },
      name: formFields.name,
      barcode: formFields.barcode,
      unit: formFields.unit,
      salesPrice: formFields.salesPrice,
      favorite: !!formFields.favorite,
      vatRate: formFields.vatRate,
      noVat: formFields.noVat,
      vatBarcode: formFields.vatBarcode,
    };

    if (units.length > 0) {
      data.units = units
        .filter((u) => u !== undefined)
        .map((u, index) => {
          return {
            coefficient: u.coefficient,
            count: u.count,
            sorder: index,
            unitId: u.unit.id,
            base: u.isBase,
          };
        });
    }
    if (props.agreementId) data.agreementId = props.agreementId;
    if (productId) {
      data = { ...productDetailsData, ...data };

      catalogEffector.effects.updateCatalogProductEffect(data);
    } else {
      catalogEffector.effects.createCatalogProductEffect(data);
    }
  };

  let selectedCategories = [];
  const formatCategoriesOptions = (categories, parents = []) => {
    return categories.map((item) => {
      if (formFields.category && formFields.category === item.id) {
        // @ts-ignore
        selectedCategories = [...parents, item.id];
      }

      const newItem = {
        value: item.id,
        label: item.name,
      };

      if (item.children && item.children.length) {
        const newParents = [...parents, item.id];
        // @ts-ignore
        newItem.children = formatCategoriesOptions(item.children, newParents);
      }

      return newItem;
    });
  };
  const categoriesOptions = formatCategoriesOptions($catalog.data);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the promotions-components
    if (!result.destination) {
      return;
    }
    const items = reorder(units, result.source.index, result.destination.index);

    calculateCoeff(items);
  };

  const calculateCoeff = (units) => {
    if (units && units.length > 1) {
      // coefficient: i < mainIndex ? units[i+1].coefficient/unitCount : units[i-1].coefficient * unitCount,
      let index = 0;
      units.forEach((u, i) => {
        if (u && u.isBase) {
          index = i;
          return;
        }
      });
      if (index > 0 && index !== units.length - 1) {
        for (let i = index - 1; i >= 0; i--) {
          if (units[i] && units[i + 1]) {
            units[i].coefficient =
              parseFloat(units[i + 1].coefficient || 1.0) / units[i].count;
          }
        }
        for (let i = index + 1; i < units.length; i++) {
          if (units[i] && units[i - 1]) {
            units[i].coefficient =
              parseFloat(units[i - 1].coefficient || 1.0) * units[i].count;
          }
        }
      } else if (index === 0) {
        for (let i = 1; i < units.length; i++) {
          if (units[i] && units[i - 1]) {
            units[i].coefficient =
              parseFloat(units[i - 1].coefficient || 1.0) * units[i].count;
          }
        }
      } else if (index === units.length - 1) {
        for (let i = index - 1; i >= 0; i--) {
          if (units[i + 1] && units[i]) {
            units[i].coefficient =
              parseFloat(units[i + 1].coefficient || 1.0) / units[i].count;
          }
        }
      }

      setUnits([...units]);
    }
  };

  const renderUnitItem = (u, i) => {
    if (u && u.isBase) {
      return (
        <>
          <div className="APM__units__item__name">
            Оснавная ед. изм.- {u.unit && u.unit.name}
          </div>
          {editMode ? (
            undefined
          ) : (
            <div>
              1 {u.unit && u.unit.name} -{" "}
              {(formFields.salesPrice || 0).toLocaleString("ru")} сум
            </div>
          )}
        </>
      );
    } else {
      let mainIndex = 0;
      units.forEach((a: any, index) => {
        if (a && a.isBase) {
          mainIndex = index;
        }
      });

      const isUnitBefore = i < mainIndex;

      if (u) {
        let srcUnit, destUnit;

        if (isUnitBefore) {
          if (units[i + 1]) {
            srcUnit = units[i + 1].unit;
          } else {
            srcUnit = units[i + 2].unit;
          }
          destUnit = u.unit;
        } else {
          srcUnit = u.unit;
          if (units[i - 1]) {
            destUnit = units[i - 1].unit;
          } else {
            destUnit = units[i - 2].unit;
          }
        }
        return (
          <>
            <div className="APM__units__item__name">
              {`1 ${srcUnit && srcUnit.name} - ${u.count} ${destUnit &&
                destUnit.name}`}
            </div>
            {!editMode && (
              <div>
                {" "}
                1{" "}
                {destUnit && srcUnit
                  ? u.coefficient > 1
                    ? srcUnit.name
                    : destUnit.name
                  : "-"}{" "}
                -{" "}
                {Number(
                  (u.coefficient || 0) * (formFields.salesPrice || 0)
                ).toFixed(2)}{" "}
                сум
              </div>
            )}
            {!editMode && (
              <div className="APM__units__item__buttons">
                <Button
                  onClick={() => {
                    let u = [...units];
                    u.splice(i, 1);
                    setUnits(u);
                  }}
                  type="primary"
                  danger
                >
                  Удалить
                </Button>
              </div>
            )}
          </>
        );
      } else {
        const unSelectedUnits = $unitsItems.data.filter(
          (a) =>
            a.id !== formFields.unit.id &&
            !units.find((u) => u && u.unit && u.unit.id === a.id)
        );
        const select = (
          <div className="APM__units__item__select">
            <Select
              className={`custom-select`}
              loading={$unitsItems.loading}
              placeholder="Выберите Ед. Изм."
              value={unit}
              onChange={setUnit}
              allowClear
            >
              {unSelectedUnits.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        );
        const input = (
          <div className="APM__units__item__input">
            <Input
              value={unitCount}
              onChange={(event) => {
                // @ts-ignore
                setUnitCount(parseFloat(event.target.value) || "0");
              }}
            />
          </div>
        );
        return (
          <>
            {isUnitBefore ? (
              <div className="APM__units__item__name">
                <div>1 {units[i + 1].unit.name}</div>
                <div className="APM__units__item__equal">=</div>
                <div className="APM__units__item__one">{input}</div>
                {select}
              </div>
            ) : (
              <div className="APM__units__item__name">
                <div className="APM__units__item__one">1</div>
                {select}
                <div className="APM__units__item__equal">=</div>
                {input}
                <div className="APM__units__item__input-unit">
                  {units[i - 1].unit.name}
                </div>
              </div>
            )}
            <div className="APM__units__item__buttons">
              <Button
                type="primary"
                // @ts-ignore
                disabled={unit === undefined || !unitCount || unitCount <= 0}
                onClick={() => {
                  let found = $unitsItems.data.find((a) => a.id === unit);
                  let newUnit = {
                    unit: found,
                    count: unitCount,
                    isBase: false,
                  };
                  let a = [...units];
                  a.splice(i, 0, newUnit);
                  a = a.filter((u) => u !== undefined);
                  setUnits(a);
                  calculateCoeff(a);
                  setUnit(undefined);
                  setUnitCount(undefined);
                  setEditMode(false);
                }}
              >
                Сохранить
              </Button>
              <Button
                type="ghost"
                onClick={() => {
                  let a = [...units];
                  a = a.filter((u) => u !== undefined);
                  setUnits(a);
                  setUnit(undefined);
                  setUnitCount(undefined);
                  setEditMode(false);
                }}
              >
                Отмена
              </Button>
            </div>
          </>
        );
      }
    }
  };

  const vats = [
    { percent: -1, name: "Без НДС" },
    ...$vatsItems.data.map((v) => ({
      id: v.id,
      name: `${v.name} - ${v.percent}%`,
      percent: v.percent,
    })),
  ];

  return (
    <Modal
      className="add-product-modal"
      title={productId ? "Редактирование товара" : "Добавить товар"}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={1400}
    >
      {/*{($createCatalogProduct.error || $updateCatalogProduct.error) && <div className="custom-modal__error">*/}
      {/*  <Alert message={$createCatalogProduct.error.detail || $updateCatalogProduct.error.detail} type="error"/>*/}
      {/*</div>}*/}
      {($currentProduct.loading ||
        $createCatalogProduct.loading ||
        $updateCatalogProduct.loading) && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <div className="APM__row">
        <div className="APM__col-left">
          <h3 className="APM__sub-head">Данные о продукте</h3>
          <Form onFinish={onFinish}>
            <FormField title="Категория" error={fieldsErrors.category}>
              <Cascader
                className={`custom-select ${
                  fieldsErrors.category ? "custom-select-error" : ""
                }`}
                placeholder="Выберите категорию"
                value={selectedCategories}
                options={categoriesOptions}
                onChange={onCategoryChange}
                allowClear
              />
            </FormField>
            <FormField title="Название товара" error={fieldsErrors.name}>
              <Input
                className="custom-input"
                value={formFields.name}
                onChange={(e) => onFormFieldChange({ name: e.target.value })}
                placeholder="Введите название товара"
              />
            </FormField>
            <FormField title="Штрих код" error={fieldsErrors.barcode}>
              <Input
                className="custom-input"
                value={formFields.barcode}
                onChange={(event) =>
                  onFormFieldChange({ barcode: event.target.value })
                }
                placeholder="Введите штрих код"
              />
            </FormField>
            <FormField title="ИКПУ" error={fieldsErrors.vatBarcode}>
              <Input
                className="custom-input"
                value={formFields.vatBarcode || ""}
                onChange={(event) => {
                  if (
                    event.target.value.length < 18 &&
                    String(Number(event.target.value)) !== "NaN"
                  ) {
                    onFormFieldChange({ vatBarcode: event.target.value });
                  }
                }}
                placeholder="Введите ИКПУ код"
              />
            </FormField>
            <Row
              className="CP__catalog__add-popup__bottom"
              justify="space-between"
              align="middle"
              gutter={[20, 0]}
            >
              <Col span={12}>
                <FormField title="Ед. Изм." error={fieldsErrors.unit}>
                  <Select
                    className="custom-select"
                    loading={$unitsItems.loading}
                    placeholder="Выберите Ед. Изм."
                    value={formFields.unit ? formFields.unit.id : undefined}
                    onChange={onUnitChange}
                    allowClear
                  >
                    {$unitsItems.data.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </FormField>
              </Col>
              <Col span={12}>
                <FormField title="&nbsp;">
                  <Checkbox
                    checked={formFields.favorite}
                    onChange={(event) =>
                      onFormFieldChange({ favorite: event.target.checked })
                    }
                  >
                    Избранный
                  </Checkbox>
                </FormField>
              </Col>
            </Row>
            <FormField title="Цена продажи" error={fieldsErrors.salesPrice}>
              <InputNumber
                className="custom-input"
                value={formFields.salesPrice}
                onChange={(salesPrice) => onFormFieldChange({ salesPrice })}
                placeholder="Введите цену продажи"
              />
            </FormField>
            {/*<FormField title="Социальный" error={fieldsErrors.noVat}>*/}
            {/*  <Select*/}
            {/*    className="custom-select"*/}
            {/*    placeholder="Социальный"*/}
            {/*    value={formFields.noVat ? 0 : 1}*/}
            {/*    onChange={(value) => onFormFieldChange("noVat", value)}*/}
            {/*    allowClear*/}
            {/*  >*/}
            {/*    {vats.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}*/}
            {/*  </Select>*/}
            {/*</FormField>*/}

            <FormField title="НДС" error={fieldsErrors.noVat}>
              <Select
                className="custom-select"
                placeholder="НДС"
                value={formFields.vatRate !== null ? formFields.vatRate : -1}
                onChange={(vatRate) => {
                  console.log("vatRate", vatRate);

                  const vat = vatRate === -1 ? null : vatRate;
                  console.log("vat", vat);

                  onFormFieldChange({ vatRate: vat, noVat: !vat });
                }}
              >
                {vats.map((item) => (
                  <Option value={item.percent} key={item.percent}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormField>

            <div className="form-bottom">
              <Row className="custom-modal__button-row" gutter={[20, 0]}>
                <Col span={12}>
                  <Button onClick={closeModal} type="ghost" size="large">
                    Отмена
                  </Button>
                </Col>
                <Col span={12}>
                  <Button htmlType="submit" type="primary" size="large">
                    {productId ? "Сохранить" : "Добавить"}
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
        <div className="APM__col-right">
          <h3 className="APM__sub-head">Единицы измерения</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => {
                return (
                  <div
                    className="APM__units"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {units.map((u: any, i) => {
                      return (
                        <Draggable key={i} draggableId={`${i}`} index={i}>
                          {(provided) => {
                            return (
                              <div
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                className={cn("APM__units__item", {
                                  ["APM__units__item_base"]: u && u.isBase,
                                })}
                              >
                                <div>{i + 1}.</div>
                                <div
                                  {...provided.dragHandleProps}
                                  className="APM__units__item__drag"
                                >
                                  <FontAwesomeIcon icon={faBars} />
                                </div>
                                {renderUnitItem(u, i)}

                                {!editMode && (
                                  <div className="APM__units__item__arrow-buttons">
                                    <Button
                                      onClick={() => {
                                        let a: any = [...units];
                                        a.splice(i, 0, undefined);
                                        setUnits(a);
                                        setEditMode(true);
                                      }}
                                      shape="circle"
                                      icon={
                                        <FontAwesomeIcon icon={faArrowUp} />
                                      }
                                    />
                                    <Button
                                      onClick={() => {
                                        if (i === units.length - 1) {
                                          let a: any = [...units];
                                          a.push(undefined);
                                          setUnits(a);
                                        } else {
                                          let a: any = [...units];
                                          a.splice(i + 1, 0, undefined);
                                          setUnits(a);
                                        }
                                        setEditMode(true);
                                      }}
                                      shape="circle"
                                      icon={
                                        <FontAwesomeIcon icon={faArrowDown} />
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </Modal>
  );
};
