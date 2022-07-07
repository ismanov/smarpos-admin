import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Input, Row, Col, Modal, Button, Form, Alert, Spin, Select, notification } from "antd";

import effector from "app/presentationLayer/effects/clients";
import { FormField } from "app/presentationLayer/components/form-field";


const { Option } = Select;

export const EditClientModal = (props) => {
  const { modalProps, setModalProps } = props;
  const details = modalProps.details;

  const [formFields, setFormFields] = useState<any>({
    ...details
  });

  const $vatsItems = useStore(effector.stores.$vatsItems);
  const $updateClientDetails = useStore(effector.stores.$updateClientDetails);

  useEffect(() => {
    effector.effects.fetchVatsItemsEffect();
  }, []);

  useEffect(() => {
    if ($updateClientDetails.success) {
      notification['success']({
        message: "Информация обновлена",
      });
      closeModal();
    }
  }, [$updateClientDetails.success]);


  const closeModal = () => {
		setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    effector.events.resetUpdateClientDetails();
		setModalProps({ ...modalProps, shouldRender: false });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const detectVat = () => {
    if (!formFields.paysNds) {
      return undefined;
    }
    const foundVat = $vatsItems.data.find(v => v.percent === formFields.ndsPercent);
    return foundVat ? foundVat.id : undefined;
  };

  const onVatChange = (vatId) => {
    let fields = { paysNds: false, ndsPercent: 0 };
    if (vatId) {
      const found = $vatsItems.data.find(v => v.id === vatId);
      if (found) {
        fields = {
          paysNds: true,
          ndsPercent: found.percent || 0
        };
      }
    }

    onFormFieldChange(fields);
  };

  const onSubmit = () => {
    effector.effects.updateClientDetailsEffect(formFields);
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
      {$updateClientDetails.error && <div className="custom-modal__error">
        <Alert message={$updateClientDetails.error.title} type="error"/>
      </div>}
      {$updateClientDetails.loading && <div className="modal-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        <FormField title="ИНН">
          <Input
            className="custom-input"
            placeholder='ИНН'
            value={formFields.inn}
            onChange={(e) => onFormFieldChange({ inn: e.target.value })}
          />
        </FormField>
        <FormField title="НДС">
          <Select
            className="custom-select"
            loading={$vatsItems.loading}
            placeholder='НДС'
            value={detectVat()}
            onChange={onVatChange}
            allowClear
          >
            {$vatsItems.data.map((item) => <Option value={item.id} key={item.id}>{`${item.name} - ${item.percent}%`}</Option>)}
          </Select>
        </FormField>
        <Row className="custom-modal__button-row" gutter={[ 24, 0 ]}>
          <Col span={12}>
            <Button className="full-width" type="ghost" size="large" onClick={closeModal}>Отмена</Button>
          </Col>
          <Col span={12}>
            <Button className="full-width" type="primary" size="large" htmlType="submit">Обновить</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};