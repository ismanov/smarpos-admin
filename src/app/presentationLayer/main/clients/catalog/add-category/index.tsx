import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Form, Input, Popover, Row, Col, notification } from "antd";
import { FormField } from "app/presentationLayer/components/form-field";
import catalogEffector from "app/presentationLayer/effects/clients/catalog";
import "./styles.scss";

export const AddCategoryPopover = (props) => {
  const { branchId, callBack, children, parentId } = props;
  const $createCategory = useStore(catalogEffector.stores.$createCategory);

  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [fieldsErrors, setFieldsErrors] = useState<any>({});

  useEffect(() => {
    if ($createCategory.success) {
      callBack();

      notification["success"]({
        message: "Категория добавлена",
      });

      setName("");
      catalogEffector.events.resetCreateCategoryEvent();

      closePopover();
    }
  }, [$createCategory.success]);

  const closePopover = () => {
    setVisible(false);
  };

  const onFinish = () => {
    const notFilledMessage = "Не заполнено поле";

    if (!name) {
      setFieldsErrors({ name: notFilledMessage });

      return;
    }
    const data: {
      branchId: number;
      enabled: boolean;
      name: string;
      parentId: number | string;
      agreementId?: number;
    } = {
      branchId,
      enabled: true,
      name,
      parentId,
    };
    if (!!props.agreementId) data.agreementId = props.agreementId;

    catalogEffector.effects.createCategoryEffect(data);
  };

  const content = (
    <div className="CP__catalog__add-popup">
      <h2>Добавить категорию</h2>
      <Form onFinish={onFinish}>
        <FormField error={fieldsErrors.name}>
          <Input
            className={`custom-input ${
              fieldsErrors.name ? "custom-input-error" : ""
            }`}
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>
        <Row
          className="CP__catalog__add-popup__bottom"
          justify="space-between"
          gutter={[20, 5]}
        >
          <Col span={12}>
            <Button onClick={closePopover} type="ghost">
              Отмена
            </Button>
          </Col>
          <Col span={12}>
            <Button
              loading={$createCategory.loading}
              htmlType="submit"
              type="primary"
            >
              Добавить
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );

  if (!branchId) {
    return children;
  }

  return (
    // @ts-ignore
    <Popover
      overlayClassName="add-check-list-item-popover"
      placement="bottom"
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
    >
      {children}
    </Popover>
  );
};
