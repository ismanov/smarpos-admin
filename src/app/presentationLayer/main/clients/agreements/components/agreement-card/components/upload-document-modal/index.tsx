import React, { useEffect, useState } from "react";
import { Row, Modal, Button, Form, Upload, message, Alert, Spin, Col } from "antd";
import { FormField } from "app/presentationLayer/components/form-field";
import { StringMapI } from "app/businessLogicLayer/models";


export const UploadDocumentModal = (props) => {
  const {
    modalProps,
    setModalProps,
    onUploadSubmit,
		loading,
    success,
		error,
  } = props;

  const [ uploadedDocument, setUploadedDocument ] = useState<any>([]);
  const [ fieldsErrors, setFieldsErrors ] = useState<StringMapI>({});

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  useEffect(() => {
    if (success) {
      closeModal();
    }
  }, [success]);

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors: StringMapI = {};

    if (!uploadedDocument.length) errors.document = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    setFieldsErrors(errors);

    if (Object.keys(errors).length) {
      message.error("Ошибка валидации");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedDocument[0]);

    onUploadSubmit(formData);
  };

  const uploadProps = {
    onRemove: () => {
      setUploadedDocument([]);
    },
    beforeUpload: (file: any) => {
      setUploadedDocument([ file ]);

      return false;
    },
    fileList: uploadedDocument,
  };

  return (
    <Modal
      className="custom-modal"
      title="Загрузить документ"
      visible={modalProps.visible}
      onCancel={closeModal}
      afterClose={afterClose}
      footer={null}
      width={440}
    >
      {error && <div className="m-b-20">
        <Alert message={error.detail || error.title} type="error" />
      </div>}
      {loading && <div className="modal-loader">
        <Spin size="large" />
      </div>}
      <Form onFinish={onSubmit}>
        <FormField title="Документ" error={fieldsErrors.document}>
          <Upload {...uploadProps}>
            <Button>Выбрать файл</Button>
          </Upload>
        </FormField>
        <Row className="custom-modal__button-row" gutter={[ 24, 0 ]}>
          <Col span={12}>
            <Button className="full-width" type="ghost" size="large" onClick={closeModal}>Отмена</Button>
          </Col>
          <Col span={12}>
            <Button className="full-width" type="primary" size="large" htmlType="submit">Отправить</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};