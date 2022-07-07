import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Input, Row, Modal, Button, Form, Alert, Spin, Checkbox, Col, notification } from "antd";
import effector from "app/presentationLayer/effects/permissions";
import { StringMapI } from "app/businessLogicLayer/models";
import { FormField } from "app/presentationLayer/components/form-field";


export const AddEndpointModal = (props) => {
  const { modalProps, setModalProps } = props;
  const { appRouteId, parent } = modalProps;

  const [formFields, setFormFields] = useState<any>({});
  const [fieldsErrors, setFieldsErrors] = useState<StringMapI>({});

  const $appRouteDetails = useStore(effector.stores.$appRouteDetails);
  const $createAppRoute = useStore(effector.stores.$createAppRoute);
  const $updateAppRoute = useStore(effector.stores.$updateAppRoute);
  const appRouteDetailsData = $appRouteDetails.data;

  useEffect(() => {
    if (appRouteId) {
      effector.effects.getAppRouteDetailsEffect(appRouteId);
    }
  }, []);

  useEffect(() => {
    if (appRouteId && appRouteDetailsData) {
      setFormFields({
        annotationName: appRouteDetailsData.annotationName,
        menuName: appRouteDetailsData.menuName,
        section: appRouteDetailsData.section,
        parentId: appRouteDetailsData.parentId,
      });
    }
  }, [appRouteDetailsData]);

  useEffect(() => {
    if ($createAppRoute.success) {
      notification['success']({
        message: "Эндпоинт добавлен",
      });
      closeModal();
    }

    if ($updateAppRoute.success) {
      notification['success']({
        message: "Эндпоинт обновлен",
      });
      closeModal();
    }
  }, [$createAppRoute.success, $updateAppRoute.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (appRouteId) {
      effector.events.resetUpdateAppRouteEvent();
      effector.events.resetAppRouteDetailsEvent();
    } else {
      effector.events.resetCreateAppRouteEvent();
    }
    setModalProps({ ...modalProps, shouldRender: false, parentId: null, appRouteId: null });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors: StringMapI = {};

    if (!formFields.menuName) errors.menuName = notFilledMessage;
    if (!formFields.annotationName) errors.annotationName = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    if (appRouteId) {
      effector.effects.updateAppRouteEffect({
        id: appRouteId,
        annotationName: formFields.annotationName,
        menuName: formFields.menuName,
        section: formFields.section,
        parentId: formFields.parentId,
      });
    } else {
      effector.effects.createAppRouteEffect({
        annotationName: formFields.annotationName,
        menuName: formFields.menuName,
        section: formFields.section,
        parentId: parent ? parent.id : undefined,
        position: 1,
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={appRouteId ? "Редактирование информации" : `Добавить эндпоинт ${parent ? "в " + parent.menuName : ""}`}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {$createAppRoute.error && <div className="custom-modal__error">
        <Alert message={$createAppRoute.error.title} type="error"/>
      </div>}
      {$updateAppRoute.error && <div className="custom-modal__error">
        <Alert message={$updateAppRoute.error.title} type="error"/>
      </div>}
      {($appRouteDetails.loading || $createAppRoute.loading || $updateAppRoute.loading) && <div className="modal-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        <FormField title="Название" error={fieldsErrors.menuName}>
          <Input
            className={`custom-input ${fieldsErrors.menuName ? 'custom-input-error' : ''}`}
            value={formFields.menuName}
            onChange={(e) => onFormFieldChange({ menuName: e.target.value })}
            placeholder='Введите название'
          />
        </FormField>
        <FormField title="Аннотация" error={fieldsErrors.annotationName}>
          <Input
            className={`custom-input ${fieldsErrors.annotationName ? 'custom-input-error' : ''}`}
            value={formFields.annotationName}
            onChange={(e) => onFormFieldChange({ annotationName: e.target.value })}
            placeholder='Введите аннотацию'
          />
        </FormField>

        <FormField className="m-t-20">
          <Checkbox
            className="custom-checkbox-2"
            onChange={(e) => onFormFieldChange({ section: e.target.checked })}
            checked={formFields.section}
          >Раздел</Checkbox>
        </FormField>

        <Row className="custom-modal__button-row" gutter={[ 24, 0 ]}>
          <Col span={12}>
            <Button className="full-width" type="ghost" size="large" onClick={closeModal}>Отмена</Button>
          </Col>
          <Col span={12}>
            <Button className="full-width" type="primary" size="large" htmlType="submit">{appRouteId ? "Сохранить" : "Создать"}</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};