import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Row, Col, Modal, Button, Form, Alert, Spin, notification } from "antd";
import InputMask from 'react-input-mask';

import effector from "app/presentationLayer/effects/staff";
import { FormField } from "app/presentationLayer/components/form-field";


export const UpdateLoginModal = (props) => {
  const { modalProps, setModalProps } = props;
  const user = modalProps.user;

  const [formFields, setFormFields] = useState<any>({
    ...user
  });

  const $updateUserLogin = useStore(effector.stores.$updateUserLogin);

  useEffect(() => {
    if ($updateUserLogin.success) {
      notification['success']({
        message: "Логин обновлен",
      });
      closeModal();
    }
  }, [$updateUserLogin.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    effector.events.resetUpdateUserLogin();
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onSubmit = () => {
    effector.effects.updateUserLoginEffect(formFields);
  };

  return (
    <Modal
      className="custom-modal"
      title="Изменить логин"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {$updateUserLogin.error && <div className="custom-modal__error">
        <Alert message={$updateUserLogin.error.title} type="error"/>
      </div>}
      {$updateUserLogin.loading && <div className="modal-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        <FormField title="Логин">
          <InputMask
            className="ant-input custom-input"
            mask="+(\9\9\8) 99 999-99-99"
            maskChar="*"
            value={formFields.login}
            onChange={event => {
              let regex = /\d+/g;
              onFormFieldChange({ login: event.target.value.match(regex).join('') });
            }}
          />
        </FormField>
        <Row className="custom-modal__button-row" gutter={[ 24, 0 ]}>
          <Col span={12}>
            <Button className="full-width" type="ghost" size="large" onClick={closeModal}>Отмена</Button>
          </Col>
          <Col span={12}>
            <Button className="full-width" type="primary" size="large" htmlType="submit">Сохранить</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};