import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import {
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  notification,
  Checkbox,
  Spin,
  DatePicker,
} from "antd";
import moment from "moment";

import Card from "app/presentationLayer/components/card";
import { FormField } from "app/presentationLayer/components/form-field";

import promotionsEffector from "app/presentationLayer/effects/clients/promotions";
import { SelectDays } from "app/presentationLayer/components/select-days";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  DAILY,
  WEEK_DAYS,
  MONTH_DAYS,
  PRODUCT,
  ACTIVE,
  PAUSED,
  CANCELLED,
  ENDED,
  notFilledMessage,
  dateFormat,
  repeatTypes,
  promotionOnItems,
  bonusOnItems,
  bonusTypeItems,
} from "../constants";
import {
  disabledDate,
  getNameByCode,
  formatRepeats,
} from "app/presentationLayer/main/clients/promotions/helper";
import { UpdatePromotionI } from "app/businessLogicLayer/models/Promotions";
import { StringMapI } from "app/businessLogicLayer/models";
import { updateErrors } from "app/utils/utils";

const { Option } = Select;

export const UpdatePromotion = (props) => {
  const { match } = props;
  const { promotionId } = match.params;

  const $promotionDetails = useStore(
    promotionsEffector.stores.$promotionDetails
  );
  const $updatePromotion = useStore(promotionsEffector.stores.$updatePromotion);
  const $changePromotionStatus = useStore(
    promotionsEffector.stores.$changePromotionStatus
  );

  const {
    loading: promotionDetailsLoading,
    data: promotionDetails,
  } = $promotionDetails;

  const [commonFormFields, setCommonFormFields] = useState<any>({
    repeatType: DAILY,
  });
  const [commonFieldsErrors, setCommonFieldsErrors] = useState<StringMapI>({});

  useEffect(() => {
    if (promotionId) {
      promotionsEffector.effects.fetchPromotionDetailsEffect(promotionId);
    }
  }, []);

  useEffect(() => {
    if (promotionDetails) {
      setCommonFormFields({
        name: promotionDetails.name,
        dateFrom: promotionDetails.dateFrom,
        dateTo: promotionDetails.dateTo,
        repeatType: promotionDetails.repeatType,
        repeats: formatRepeats(promotionDetails.repeats),
      });
    }
  }, [promotionDetails]);

  useEffect(() => {
    if ($updatePromotion.success) {
      notification["success"]({
        message: "?????????? ??????????????????",
      });

      setCommonFormFields({});
      promotionsEffector.events.resetUpdatePromotionEvent();
      promotionsEffector.effects.fetchPromotionDetailsEffect(promotionId);
    }

    if ($changePromotionStatus.success) {
      let message = "???????????? ?????????? ????????????????";

      switch ($changePromotionStatus.success) {
        case ACTIVE:
          message = "?????????? ????????????????????????";
          break;
        case PAUSED:
          message = "?????????? ????????????????????????????";
          break;
        case CANCELLED:
          message = "?????????? ????????????????";
          break;
      }

      notification["success"]({
        message,
      });

      promotionsEffector.events.resetChangePromotionStatusEvent();
      promotionsEffector.effects.fetchPromotionDetailsEffect(promotionId);
    }
  }, [$updatePromotion.success, $changePromotionStatus.success]);

  const onFormFieldChange = (fields) => {
    setCommonFormFields({ ...commonFormFields, ...fields });

    const errors = updateErrors(commonFieldsErrors, fields);
    setCommonFieldsErrors(errors);
  };

  const onUpdateClick = () => {
    const commonErrors: StringMapI = {};

    if (!commonFormFields.name) commonErrors.name = notFilledMessage;
    if (!commonFormFields.dateFrom) commonErrors.dateFrom = notFilledMessage;
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

    if (!promotionDetails || Object.keys(commonErrors).length) {
      return;
    }

    const data: UpdatePromotionI | any = {
      id: promotionId,
      companyId: promotionDetails.companyId,
      branchId: promotionDetails.branchId,
      name: commonFormFields.name,
      dateFrom: commonFormFields.dateFrom,
      dateTo: commonFormFields.dateTo,
      repeatType: commonFormFields.repeatType,
    };

    if (
      commonFormFields.repeatType === WEEK_DAYS ||
      commonFormFields.repeatType === MONTH_DAYS
    ) {
      data.repeats = Object.keys(commonFormFields.repeats).map((item) =>
        parseInt(item)
      );
    }

    promotionsEffector.effects.updatePromotionEffect({
      ...data,
      agreementId: props.agreementId,
    });
  };

  const onChangeStatusClick = (status) => {
    const data: any = {
      promotionId,
      status,
      agreementId: props.agreementId,
    };
    if (!!props.agreementId) data.agreementId = props.agreementId;
    promotionsEffector.effects.changePromotionStatusEffect(data);
  };

  const renderDetails = (details) => {
    return (
      <>
        <div className="add-promotion__common-fields">
          <h2>?????????? ????????????????????</h2>
          <Row justify="space-between" gutter={[24, 0]}>
            <Col span={12}>
              <FormField title="???????????????? ??????????" error={commonFieldsErrors.name}>
                <Input
                  className="custom-input"
                  placeholder="?????????????? ???????????????? ??????????"
                  value={commonFormFields.name}
                  onChange={(event) =>
                    onFormFieldChange({ name: event.target.value })
                  }
                />
              </FormField>
            </Col>
            <Col span={12}>
              <FormField title="????????????">
                <Input
                  className="custom-input"
                  value={details.branchName}
                  disabled
                />
              </FormField>
            </Col>
          </Row>
          <Row justify="space-between" gutter={[24, 0]}>
            <Col span={12}>
              <FormField
                title="???????????? ???????????????????? - ????"
                error={commonFieldsErrors.dateFrom}
              >
                <DatePicker
                  format={dateFormat}
                  placeholder="????"
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
              <FormField title="???????????? ???????????????????? - ????">
                <DatePicker
                  format={dateFormat}
                  placeholder="????"
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
              <FormField title="??????????????????">
                <Select
                  className="custom-select"
                  placeholder="???????????????? ????????????????????"
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
                    title={`???????????????? ${
                      commonFormFields.repeatType === WEEK_DAYS
                        ? "?????? ????????????"
                        : "????????"
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
        <div className="add-promotion__details">
          <div className="add-promotion__details__col">
            <div className="add-promotion__details__block">
              <h2 className="add-promotion__details__head">
                ?????????????? ???????????????????? ??????????
              </h2>
              <div className="add-promotion__details__inner">
                {details.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="add-promotion__details__block__item"
                  >
                    <FormField>
                      <Input
                        className="custom-input"
                        value={getNameByCode(
                          promotionOnItems,
                          condition.promotionOn
                        )}
                        disabled
                      />
                    </FormField>
                    {condition.promotionOn === PRODUCT && (
                      <Row justify="space-between" gutter={[16, 0]}>
                        <Col span={16}>
                          <FormField>
                            <Input
                              className="custom-input"
                              value={condition.promotedProductName}
                              disabled
                            />
                          </FormField>
                        </Col>
                        <Col span={8}>
                          <FormField>
                            <Input
                              className="custom-input"
                              value={condition.productUnitName}
                              disabled
                            />
                          </FormField>
                        </Col>
                      </Row>
                    )}
                    <Row justify="space-between" gutter={[16, 0]}>
                      <Col span={12}>
                        <FormField>
                          <InputNumber
                            className="custom-input"
                            value={condition.amount}
                            disabled
                          />
                        </FormField>
                      </Col>
                      <Col span={12}>
                        <FormField>
                          <InputNumber
                            className="custom-input"
                            value={condition.amountTo}
                            disabled
                          />
                        </FormField>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="add-promotion__details__col add-promotion__details__col_right">
            <div className="add-promotion__details__block">
              <h2 className="add-promotion__details__head">???????????????????? ??????????</h2>
              <div className="add-promotion__details__inner">
                {details.bonuses.map((bonus, bonusIndex) => {
                  return (
                    <div
                      key={bonusIndex}
                      className="add-promotion__details__block__item"
                    >
                      <FormField>
                        <Input
                          className="custom-input"
                          value={getNameByCode(bonusOnItems, bonus.bonusOn)}
                          disabled
                        />
                      </FormField>
                      {bonus.bonusOn === PRODUCT && (
                        <Row justify="space-between" gutter={[16, 0]}>
                          <Col span={16}>
                            <FormField>
                              <Input
                                className="custom-input"
                                value={bonus.bonusProductName}
                                disabled
                              />
                            </FormField>
                          </Col>
                          <Col span={8}>
                            <FormField>
                              <Input
                                className="custom-input"
                                value={bonus.productUnitName}
                                disabled
                              />
                            </FormField>
                          </Col>
                        </Row>
                      )}
                      {bonus.bonusOn === PRODUCT && (
                        <FormField className="add-promotion__details__block__check">
                          <Checkbox checked={bonus.allProducts} disabled>
                            ???? ?????? ????????????????????
                          </Checkbox>
                        </FormField>
                      )}
                      <Row justify="space-between" gutter={[16, 0]}>
                        <Col span={7}>
                          {bonus.bonusOn === PRODUCT && (
                            <FormField>
                              <InputNumber
                                className="custom-input"
                                value={bonus.productCount}
                                disabled
                              />
                            </FormField>
                          )}
                        </Col>
                        <Col span={6}>
                          <FormField>
                            <Input
                              className="custom-input"
                              value={getNameByCode(
                                bonusTypeItems,
                                bonus.bonusType
                              )}
                              disabled
                            />
                          </FormField>
                        </Col>
                        <Col span={11}>
                          <FormField>
                            <InputNumber
                              className="custom-input"
                              value={bonus.bonusAmount}
                              disabled
                            />
                          </FormField>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="add-promotion__additional-fields">
          <h2>???????????????????????????? ??????????????????: </h2>
          <FormField>
            <Checkbox checked={details.includeVAT} disabled>
              ?????????????????? ??????
            </Checkbox>
          </FormField>
          <FormField>
            <Checkbox checked={details.countRepetitions} disabled>
              ?????????????????? ?????????? ?????? ???????????? ???????????? ???????????????????? ??????????????
            </Checkbox>
          </FormField>
        </div>

        {details.promotionStatus !== CANCELLED &&
          details.promotionStatus !== ENDED && (
            <Row
              className="add-promotion__buttons-row"
              justify="end"
              align="middle"
            >
              <Button type="primary" onClick={onUpdateClick}>
                ??????????????????
              </Button>
            </Row>
          )}
      </>
    );
  };

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
            <h1>???????????? ??????????</h1>
          </div>
        </div>
        {promotionDetails &&
          promotionDetails.promotionStatus !== CANCELLED &&
          promotionDetails.promotionStatus !== ENDED && (
            <div className="add-promotion__change-status-btns">
              {promotionDetails.promotionStatus === ACTIVE ? (
                <Button
                  type="ghost"
                  loading={$changePromotionStatus.loading === PAUSED}
                  onClick={() => onChangeStatusClick(PAUSED)}
                >
                  ??????????????????????????
                </Button>
              ) : promotionDetails.promotionStatus === PAUSED ? (
                <Button
                  type="primary"
                  loading={$changePromotionStatus.loading === ACTIVE}
                  onClick={() => onChangeStatusClick(ACTIVE)}
                >
                  ????????????????????????
                </Button>
              ) : null}
              <Button
                type="primary"
                danger
                loading={$changePromotionStatus.loading === CANCELLED}
                onClick={() => onChangeStatusClick(CANCELLED)}
              >
                ????????????????
              </Button>
            </div>
          )}
      </div>

      {promotionDetails && renderDetails(promotionDetails)}

      {promotionDetailsLoading && (
        <div className="abs-loader">
          <Spin />
        </div>
      )}
    </Card>
  );
};
