import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import {
  Input,
  Row,
  Modal,
  Button,
  Form,
  Alert,
  Spin,
  Col,
  notification,
} from "antd";
import InputMask from "react-input-mask";
import effector from "app/presentationLayer/effects/clients/telegram-accounts";
import { StringMapI } from "app/businessLogicLayer/models";
import { FormField } from "app/presentationLayer/components/form-field";
import { phoneNumberLength } from "app/constants";

export const AddEditTelegramAccountModal = (props) => {
  const { modalProps, setModalProps, callBack } = props;
  const { telegramAccountId, companyId } = modalProps;

  const [formFields, setFormFields] = useState<any>({});
  const [fieldsErrors, setFieldsErrors] = useState<StringMapI>({});

  const $telegramAccountDetails = useStore(
    effector.stores.$telegramAccountDetails
  );
  const $createTelegramAccount = useStore(
    effector.stores.$createTelegramAccount
  );
  const $updateTelegramAccount = useStore(
    effector.stores.$updateTelegramAccount
  );

  const telegramAccountDetailsData = $telegramAccountDetails.data;

  useEffect(() => {
    if (telegramAccountId) {
      effector.effects.fetchTelegramAccountDetails(telegramAccountId);
    }
  }, []);

  useEffect(() => {
    if (telegramAccountId && telegramAccountDetailsData) {
      setFormFields({
        name: telegramAccountDetailsData.name,
        phone: telegramAccountDetailsData.phone,
      });
    }
  }, [telegramAccountDetailsData]);

  useEffect(() => {
    if ($createTelegramAccount.success) {
      notification["success"]({
        message: "Телеграм аккаунт добавлен",
      });
      callBack && callBack();
      closeModal();
    }

    if ($updateTelegramAccount.success) {
      notification["success"]({
        message: "Телеграм аккаунт обновлен",
      });
      callBack && callBack();
      closeModal();
    }
  }, [$createTelegramAccount.success, $updateTelegramAccount.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (telegramAccountId) {
      effector.events.resetUpdateTelegramAccount();
      effector.events.resetTelegramAccountDetails();
    } else {
      effector.events.resetCreateTelegramAccount();
    }
    setModalProps({
      ...modalProps,
      shouldRender: false,
      telegramAccountId: null,
    });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors: StringMapI = {};

    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.phone) {
      errors.phone = notFilledMessage;
    } else if (formFields.phone.length !== phoneNumberLength) {
      errors.phone = "Неверный формат";
    }

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});
    const data: any = {
      name: formFields.name,
      companyId,
      phone: formFields.phone,
    };
    if (props.location?.state?.agreementId)
      data.agreementId = props.location?.state?.agreementId;
    if (telegramAccountId) {
      effector.effects.updateTelegramAccount({
        ...data,
        id: telegramAccountId,
      });
    } else {
      effector.effects.createTelegramAccount(data);
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={
        telegramAccountId
          ? "Редактирование информации"
          : "Добавить телеграм аккаунт"
      }
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {$createTelegramAccount.error && (
        <div className="custom-modal__error">
          <Alert message={$createTelegramAccount.error.title} type="error" />
        </div>
      )}
      {$updateTelegramAccount.error && (
        <div className="custom-modal__error">
          <Alert message={$updateTelegramAccount.error.title} type="error" />
        </div>
      )}
      {($telegramAccountDetails.loading ||
        $createTelegramAccount.loading ||
        $updateTelegramAccount.loading) && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onSubmit}>
        <FormField title="Имя" error={fieldsErrors.name}>
          <Input
            className="custom-input"
            placeholder="Введите имя"
            value={formFields.name}
            onChange={(e) => onFormFieldChange({ name: e.target.value })}
          />
        </FormField>
        <FormField title="Номер телефона" error={fieldsErrors.phone}>
          <InputMask
            className="ant-input custom-input"
            mask="+(\9\9\8) 99 999-99-99"
            maskChar="*"
            placeholder="Введите номер телефона"
            value={formFields.phone}
            onChange={(event) => {
              let regex = /\d+/g;
              onFormFieldChange({
                phone: event.target.value
                  ? event.target.value.match(regex).join("")
                  : "",
              });
            }}
          />
        </FormField>

        <Row className="custom-modal__button-row" gutter={[24, 0]}>
          <Col span={12}>
            <Button
              className="full-width"
              type="ghost"
              size="large"
              onClick={closeModal}
            >
              Отмена
            </Button>
          </Col>
          <Col span={12}>
            <Button
              className="full-width"
              type="primary"
              size="large"
              htmlType="submit"
            >
              {telegramAccountId ? "Сохранить" : "Добавить"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
