import React, { useState } from "react";
import { useStore } from "effector-react";
import { Radio, Row, Modal, Button, Form, Alert, Spin, Col } from "antd";
import effector from "app/presentationLayer/effects/clients/telegram-accounts";


export const SelectAgreementModal = (props) => {
  const { modalProps, setModalProps } = props;
  const { telegramAccountId, availableTelegramAgreements } = modalProps;

  const $enableTelegramAccount = useStore(effector.stores.$enableTelegramAccount);

  const [agreementId, setAgreementId] = useState<number | null>(null);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false, telegramAccountId: null,  });
  };

  const onSubmit = () => {
    if (!agreementId) {
      return;
    }

    effector.effects.enableTelegramAccount({
      id: telegramAccountId,
      data: {
        agreementId
      }
    });
  };

  return (
    <Modal
      className="custom-modal"
      title="Выбрать заказ"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {$enableTelegramAccount.error && <div className="custom-modal__error">
        <Alert message={$enableTelegramAccount.error.title} type="error"/>
      </div>}
      {$enableTelegramAccount.loading && <div className="modal-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        <Radio.Group onChange={(e) => setAgreementId(e.target.value)} value={agreementId}>
          {availableTelegramAgreements.map((item) => (
            <div className="m-b-10">
              <Radio value={item.id}>{item.agreementNumber}</Radio>
            </div>
          ))}
        </Radio.Group>

        <Row className="custom-modal__button-row" gutter={[ 24, 0 ]}>
          <Col span={12}>
            <Button className="full-width" type="ghost" size="large" onClick={closeModal}>Отмена</Button>
          </Col>
          <Col span={12}>
            <Button className="full-width" type="primary" size="large" htmlType="submit" disabled={!agreementId}>
              Включить
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};