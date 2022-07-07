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
import { FormField } from "app/presentationLayer/components/form-field";

const { Option } = Select;

export const EditKKMModal = (props) => {
  const { modalProps, setModalProps } = props;
  const company = modalProps.company;
  console.log(company, "company");

  const [branchId, setBranchId] = useState<any>(null);

  const $branchItems = useStore(commonEffector.stores.$branchItems);
  const $createAndUpdateTerminalInfo = useStore(
    commonEffector.stores.$createAndUpdateTerminalInfo
  );

  useEffect(() => {
    if (company.companyId) {
      commonEffector.effects.fetchBranchItemsEffect({
        companyId: company.companyId,
      });
      commonEffector.events.resetCreateAndUpdateInfo();
    }
  }, []);

  useEffect(() => {
    if ($createAndUpdateTerminalInfo.error) {
      closeModal();
      commonEffector.events.resetCreateAndUpdateInfo();
    }
  }, [$createAndUpdateTerminalInfo.error]);

  useEffect(() => {
    if ($createAndUpdateTerminalInfo.success) {
      notification["success"]({
        message: "Филиал обновлен",
      });
      closeModal();
      commonEffector.events.resetCreateAndUpdateInfo();
    }
  }, [$createAndUpdateTerminalInfo.success]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onSubmit = () => {
    const data = {
      branchId,
      id: company?.id,
      serialNumber: company?.serialNumber,
    };
    commonEffector.effects.createAndUpdateTerminalEffect({
      data,
      method: "PUT",
    });
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
      {$createAndUpdateTerminalInfo.error && (
        <div className="custom-modal__error">
          <Alert
            message={$createAndUpdateTerminalInfo.error.title}
            type="error"
          />
        </div>
      )}
      {$createAndUpdateTerminalInfo.loading && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onSubmit}>
        <FormField title="Изменить филиал">
          <Select
            className="custom-select"
            loading={$branchItems.loading}
            disabled={!!$branchItems.error}
            placeholder="Филиал"
            onChange={(branchId) => setBranchId(branchId)}
            allowClear
          >
            {$branchItems.data.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
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
              loading={$createAndUpdateTerminalInfo.loading}
              size="large"
              htmlType="submit"
              disabled={!branchId}
            >
              Обновить
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
