import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import InputMask from "react-input-mask";
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
  Select,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import usersEffector from "app/presentationLayer/effects/users";
import { StringMapI } from "app/businessLogicLayer/models";
import { FormField } from "app/presentationLayer/components/form-field";
import { isValidPassword } from "app/utils/password-validation";
import { phoneNumberLength } from "app/constants";
const { Option } = Select;

export const AddEditUserModal = (props) => {
  const { modalProps, setModalProps } = props;
  const { userId } = modalProps;

  const [formFields, setFormFields] = useState<any>({});
  const [fieldsErrors, setFieldsErrors] = useState<StringMapI>({});

  const $userDetails = useStore(usersEffector.stores.$userDetails);
  const $createUser = useStore(usersEffector.stores.$createUser);
  const $updateUser = useStore(usersEffector.stores.$updateUser);
  const userDetails = $userDetails.data;

  useEffect(() => {
    if (userId) {
      usersEffector.effects.fetchUserDetailsEffect(userId);
    }
    onFormFieldChange({ authorities: roles[0].key });
  }, []);

  useEffect(() => {
    if (userId && userDetails) {
      setFormFields({
        firstName: userDetails.fullName.firstName,
        lastName: userDetails.fullName.lastName,
        patronymic: userDetails.fullName.patronymic,
        authorities: userDetails.authorities[0],
        login: userDetails.login,
      });
    }
  }, [userDetails]);

  useEffect(() => {
    if ($createUser.success) {
      notification["success"]({
        message: "Пользователь добавлен",
      });
      closeModal();
    }

    if ($updateUser.success) {
      notification["success"]({
        message: "Пользователь обновлен",
      });
      closeModal();
    }
  }, [$createUser.success, $updateUser.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (userId) {
      usersEffector.events.resetUpdateUser();
      usersEffector.events.resetUserDetails();
    } else {
      usersEffector.events.resetCreateUser();
    }
    setModalProps({ ...modalProps, shouldRender: false, userId: null });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onSubmit = () => {
    const notFilledMessage = "Не заполнено поле";
    const errors: StringMapI = {};

    if (!formFields.firstName) errors.firstName = notFilledMessage;
    if (!formFields.lastName) errors.lastName = notFilledMessage;
    if (!formFields.authorities) errors.role = notFilledMessage;
    if (!formFields.login) {
      errors.login = notFilledMessage;
    } else if (formFields.login.length !== phoneNumberLength) {
      errors.login = "Неверный формат";
    }

    if (!userId) {
      if (formFields.password) {
        if (!isValidPassword(formFields.password)) {
          errors.password =
            "Пароль должен состоять минимум из 8 символов, включая цифру, строчную и заглавную букву";
        }
      } else {
        errors.password = notFilledMessage;
      }
    }

    setFieldsErrors(errors);
    if (Object.keys(errors).length) {
      return;
    }

    const data: any = {
      authorities: [formFields.authorities],
      fullName: {
        firstName: formFields.firstName,
        lastName: formFields.lastName,
        patronymic: formFields.patronymic,
      },
      login: formFields.login,
    };
    if (props.location?.state?.agreementId)
      data.agreementId = props.location.state.agreementId;

    if (userId) {
      usersEffector.effects.updateUserEffect({
        id: userId,
        ...data,
      });
    } else {
      usersEffector.effects.createUserEffect({
        ...data,
        password: formFields.password,
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={userId ? "Редактирование информации" : `Добавить пользователя`}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {$createUser.error && (
        <div className="custom-modal__error">
          <Alert message={$createUser.error.title} type="error" />
        </div>
      )}
      {$updateUser.error && (
        <div className="custom-modal__error">
          <Alert message={$updateUser.error.title} type="error" />
        </div>
      )}
      {($userDetails.loading || $createUser.loading || $updateUser.loading) && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onSubmit} autoComplete="off">
        <FormField title="Имя" error={fieldsErrors.firstName}>
          <Input
            className="custom-input"
            value={formFields.firstName}
            onChange={(e) => onFormFieldChange({ firstName: e.target.value })}
            placeholder="Введите имя"
          />
        </FormField>
        <FormField title="Фамилия" error={fieldsErrors.lastName}>
          <Input
            className="custom-input"
            value={formFields.lastName}
            onChange={(e) => onFormFieldChange({ lastName: e.target.value })}
            placeholder="Введите фамилию"
          />
        </FormField>
        <FormField title="Отчество" error={fieldsErrors.patronymic}>
          <Input
            className="custom-input"
            value={formFields.patronymic}
            onChange={(e) => onFormFieldChange({ patronymic: e.target.value })}
            placeholder="Введите отчество"
          />
        </FormField>
        <FormField title="Роль" error={fieldsErrors.role}>
          <Select
            placeholder="Выберите роль"
            key="key"
            value={formFields.authorities}
            onChange={(e) => {
              onFormFieldChange({ authorities: e });
            }}
            style={{ width: "100%" }}
          >
            {roles.map((item) => (
              <Option value={item.key} key={item.key}>
                {item.value}
              </Option>
            ))}
          </Select>
        </FormField>
        <FormField title="Логин" error={fieldsErrors.login}>
          <InputMask
            className="ant-input custom-input"
            mask="+(\9\9\8) 99 999-99-99"
            maskChar="*"
            placeholder="Введите номер телефона"
            value={formFields.login}
            onChange={(event) => {
              let regex = /\d+/g;
              onFormFieldChange({
                login: event.target.value.match(regex).join(""),
              });
            }}
            autoComplete={"off"}
          />
        </FormField>
        <div style={{ width: 0, height: 0, overflow: "hidden" }}>
          <Input type="text" />
        </div>
        {!userId && (
          <FormField title="Пароль" error={fieldsErrors.password}>
            <Input.Password
              className="custom-input"
              value={formFields.password}
              onChange={(e) => onFormFieldChange({ password: e.target.value })}
              placeholder="Введите пароль"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              autoComplete="new-password"
            />
          </FormField>
        )}

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
              {userId ? "Сохранить" : "Создать"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const roles = [
  {
    key: "ROLE_ADMIN",
    value: "Админ",
  },
  {
    key: "ROLE_OPERATOR",
    value: "Оператор",
  },
];
