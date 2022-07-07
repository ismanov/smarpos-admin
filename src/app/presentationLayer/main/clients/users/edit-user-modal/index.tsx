import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import {
  Row,
  Col,
  Modal,
  Button,
  Form,
  Alert,
  Spin,
  notification,
  Select,
} from "antd";

import commonEffector from "app/presentationLayer/effects/common";
import effector from "app/presentationLayer/effects/staff";
import { FormField } from "app/presentationLayer/components/form-field";

const { Option } = Select;

export const EditUserModal = (props) => {
  const { modalProps, setModalProps, roleList } = props;
  const user = modalProps.user;

  const [formFields, setFormFields] = useState<any>({
    ...user,
  });

  const $usersRoles = useStore(commonEffector.stores.$usersRoles);
  const $updateUser = useStore(effector.stores.$updateUser);

  useEffect(() => {
    if (!$usersRoles.data.length) {
      //commonEffector.effects.fetchUsersRolesEffect();
    }
  }, []);

  useEffect(() => {
    if ($updateUser.success) {
      notification["success"]({
        message: "Информация обновлена",
      });
      closeModal();
    }
  }, [$updateUser.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    effector.events.resetUpdateUser();
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onSubmit = () => {
    effector.effects.updateUserEffect(formFields);
  };

  return (
    <Modal
      className="custom-modal"
      title="Редактирование информации"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {$updateUser.error && (
        <div className="custom-modal__error">
          <Alert message={$updateUser.error.title} type="error" />
        </div>
      )}
      {$updateUser.loading && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onSubmit}>
        <FormField title="Роль">
          <Select
            className="custom-select"
            placeholder="Выберите роль"
            value={
              formFields.authorities && formFields.authorities.length
                ? formFields.authorities.find((item) =>
                    roleList.includes(item)
                  ) || undefined
                : undefined
            }
            onChange={(role) => onFormFieldChange({ authorities: [role] })}
          >
            {roleList.map((item) => (
              <Option value={item.roleCode} key={item.roleCode}>
                {item.nameRu}
              </Option>
            ))}
          </Select>
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
              Обновить
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
