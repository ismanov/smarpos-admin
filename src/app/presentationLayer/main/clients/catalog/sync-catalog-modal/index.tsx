import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import {
  Row,
  Modal,
  Button,
  Form,
  Spin,
  notification,
  Col,
  Select,
} from "antd";
import { FormField } from "app/presentationLayer/components/form-field";
import effector from "app/presentationLayer/effects/clients";
import catalogEffector from "app/presentationLayer/effects/clients/catalog";

const { Option } = Select;

export const SyncCatalogModal = (props) => {
  const { modalProps, setModalProps, branchId } = props;

  const [ selectedBranchId, setSelectedBranchId ] = useState<number | undefined>(undefined);

  const $branchItems = useStore(effector.stores.$branchItems);
  const $syncCatalog = useStore(catalogEffector.stores.$syncCatalog);


  useEffect(() => {
    if ($syncCatalog.success) {

      notification['success']({
        message: "Синхронизация прошла успешно",
      });

      catalogEffector.events.resetSyncCatalogEvent();

      closeModal();
    }
  }, [ $syncCatalog.success ]);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    catalogEffector.events.resetCreateCatalogProductEvent();
    setModalProps({ ...modalProps, shouldRender: false, productId: null });
  };

  const onFinish = () => {
    catalogEffector.effects.syncCatalogEffect({
      fromBranchId: branchId,
      toBranchId: selectedBranchId
    });
  };

  const filteredBranchItems = $branchItems.data.filter(b => b.id !== branchId);

  return (
    <Modal
      title={"Синхронизация каталога"}
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {/*{($createCatalogProduct.error || $updateCatalogProduct.error) && <div className="custom-modal__error">*/}
      {/*  <Alert message={$createCatalogProduct.error.detail || $updateCatalogProduct.error.detail} type="error"/>*/}
      {/*</div>}*/}
      {$syncCatalog.loading && <div className="modal-loader">
        <Spin size="large" />
      </div>}
      <Form onFinish={onFinish}>
        <FormField title="Филиал">
          <Form.Item name="layout" rules={[{ required: true, message: "Выберите филиал" }]}>
            <Select
              className="custom-select"
              loading={$branchItems.loading}
              placeholder="Выберите филиал"
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              allowClear
            >
              {filteredBranchItems.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
        </FormField>

        <div className="form-bottom">
          <Row justify='space-between' gutter={[ 20, 0 ]}>
            <Col span={12}>
              <Button onClick={closeModal} type="ghost">Отмена</Button>
            </Col>
            <Col span={12}>
              <Button htmlType="submit" type="primary">Синхронизировать</Button>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};