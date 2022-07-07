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
  Select,
  Input,
  notification,
} from "antd";
import commonEffector from "app/presentationLayer/effects/common";
import { withDebounce } from "app/utils/utils";
import { FormField } from "app/presentationLayer/components/form-field";

const { Option } = Select;

export const AddKKMModal = (props) => {
  const { modalProps, setModalProps, fromCompany, companyId } = props;

  const [branchId, setBranchId] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [serialNumber, setSerialNumber] = useState<string>("");

  const $branchItems = useStore(commonEffector.stores.$branchItems);
  const $companyItems = useStore(commonEffector.stores.$companyItems);
  const $createAndUpdateTerminalInfo = useStore(
    commonEffector.stores.$createAndUpdateTerminalInfo
  );

  useEffect(() => {
    if (company) {
      commonEffector.effects.fetchBranchItemsEffect({
        companyId: company,
      });
    }
  }, [company]);

  useEffect(() => {
    if (companyId && fromCompany) {
      commonEffector.effects.fetchBranchItemsEffect({
        companyId,
      });
    }
  }, []);

  useEffect(() => {
    commonEffector.effects.searchCompanyItemsEffect({});

    return () => {
      commonEffector.events.resetCompanyItemsEvent();
      commonEffector.events.resetBranchItemsEvent();
    };
  }, []);

  useEffect(() => {
    if ($createAndUpdateTerminalInfo.success && branchId && serialNumber) {
      notification["success"]({
        message: "ККМ добавлен",
      });
      closeModal();
      commonEffector.events.resetCreateAndUpdateInfo();
    }
  }, [$createAndUpdateTerminalInfo.success]);
  useEffect(() => {
    if ($createAndUpdateTerminalInfo.error) {
      closeModal();
      commonEffector.events.resetCreateAndUpdateInfo();
    }
  }, [$createAndUpdateTerminalInfo.error]);

  const onCompanySearch = (search) => {
    if (search.length > 2 || search.length == 0) {
      withDebounce(() => {
        commonEffector.effects.searchCompanyItemsEffect({ search, size: 100 });
      });
    }
  };

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onSubmit = () => {
    const data = {
      branchId,
      serialNumber,
    };
    commonEffector.effects.createAndUpdateTerminalEffect({
      data,
      method: "POST",
    });
  };

  return (
    <Modal
      className="custom-modal"
      title="Добавить терминал"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {false && (
        <div className="custom-modal__error">
          <Alert message={"$updateUser.error.title"} type="error" />
        </div>
      )}
      {false && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
      <Form onFinish={onSubmit}>
        {!fromCompany && (
          <FormField title="Компания">
            <Select
              showSearch
              className="custom-select"
              loading={$companyItems.loading}
              placeholder="Компания"
              onSearch={onCompanySearch}
              onChange={(value) => setCompany(value)}
              filterOption={false}
              defaultActiveFirstOption={false}
              allowClear
            >
              {$companyItems.data.content.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormField>
        )}
        <FormField title="Филиал">
          <Select
            className="custom-select"
            loading={$branchItems.loading}
            placeholder="Филиал"
            onChange={(branchId) => setBranchId(branchId)}
            disabled={!company && !fromCompany}
            allowClear
          >
            {$branchItems.data.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormField>
        <FormField title="Серийный номер">
          <Input
            className="custom-input"
            placeholder="Серийный номер"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
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
              loading={$createAndUpdateTerminalInfo.loading}
              htmlType="submit"
              disabled={!branchId || !serialNumber}
            >
              Добавить
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
