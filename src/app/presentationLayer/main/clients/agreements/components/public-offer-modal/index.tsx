import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Row, Modal, Button, Form, Alert, Spin, Checkbox, Col, notification } from "antd";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { FormField } from "app/presentationLayer/components/form-field";


export const PublicOfferModal = (props) => {
  const { modalProps, setModalProps } = props;
  const { tin, callBack } = modalProps;

  const [accept, setAccept] = useState<any>(false);

  const $lastPublicOffer = useStore(agreementsEffector.stores.$lastPublicOffer);
  const $acceptPublicOffer = useStore(agreementsEffector.stores.$acceptPublicOffer);

  const { loading: lastPublicOfferLoading, data: lastPublicOffer, error: lastPublicOfferError } = $lastPublicOffer;

  console.log("$lastPublicOffer", $lastPublicOffer);

  useEffect(() => {
    agreementsEffector.effects.fetchLastPublicOffer({});
  }, []);

  useEffect(() => {
    if ($acceptPublicOffer.success) {
      notification['success']({
        message: "Оферта принята",
      });
      callBack && callBack();
      closeModal();
    }
  }, [$acceptPublicOffer.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    agreementsEffector.events.resetAcceptPublicOffer();
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onSubmit = () => {
    if (accept && lastPublicOffer) {
      agreementsEffector.effects.acceptPublicOffer({
        tin,
        publicOfferId: lastPublicOffer.id
      });
    }
  };

  return (
    <Modal
      className="custom-modal"
      title="Публичная оферта"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={860}
    >
      {$acceptPublicOffer.error && <div className="custom-modal__error">
        <Alert message={$acceptPublicOffer.error.title} type="error"/>
      </div>}
      {lastPublicOfferError && <div className="custom-modal__error">
        <Alert message={lastPublicOfferError.title} type="error"/>
      </div>}
      {($acceptPublicOffer.loading || lastPublicOfferLoading) && <div className="modal-loader">
        <Spin size="large"/>
      </div>}
      <Form onFinish={onSubmit}>
        {lastPublicOffer && (<>
          {/*<div className="m-b-20">{lastPublicOffer.content}</div>*/}
          {lastPublicOffer && <iframe id="divToPrint" width="100%" height="800px" srcDoc={lastPublicOffer.content} />}

          <FormField className="m-t-20">
            <Checkbox
              className="custom-checkbox-2"
              onChange={(e) => setAccept(e.target.checked)}
              checked={accept}
            >Принимаю публичную оферту</Checkbox>
          </FormField>
        </>)}

        <Row className="custom-modal__button-row" gutter={[ 24, 0 ]}>
          <Col span={12}>
            <Button className="full-width" type="ghost" size="large" onClick={closeModal}>Отмена</Button>
          </Col>
          <Col span={12}>
            <Button className="full-width" type="primary" size="large" htmlType="submit" disabled={!accept}>
              Принять
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};