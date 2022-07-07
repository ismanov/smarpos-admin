import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import moment from "moment";
import { FormField } from "app/presentationLayer/components/form-field";
import {
  Button,
  Form,
  Input,
  notification,
  Spin,
  Switch,
  Tooltip,
  Upload,
} from "antd";
import { UploadOutlined, PaperClipOutlined } from "@ant-design/icons";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import "./styles.scss";

export const ExpandedCustomAgreementService = (props) => {
  const { agreement, getAgreementDetails } = props;
  const [newDescription, setNewDescription] = useState(
    agreement.description || ""
  );
  const [descEditMode, setDescEditMode] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);

  const $updateCustomAgreementServiceDesc = useStore(
    agreementsEffector.stores.$updateCustomAgreementServiceDesc
  );
  const $uploadCustomAgreementFile = useStore(
    agreementsEffector.stores.$uploadCustomAgreementFile
  );

  const updateCustomAgreementDescLoading =
    $updateCustomAgreementServiceDesc.loading &&
    $updateCustomAgreementServiceDesc.agreementId === agreement.id;
  const uploadCustomAgreementFileLoading =
    $uploadCustomAgreementFile.loading &&
    $uploadCustomAgreementFile.agreementId === agreement.id;

  useEffect(() => {
    if (
      $updateCustomAgreementServiceDesc.success &&
      $updateCustomAgreementServiceDesc.agreementId === agreement.id
    ) {
      notification["success"]({
        message: "Описание обновлено",
      });
      getAgreementDetails();
      setDescEditMode(false);
      agreementsEffector.events.resetUpdateCustomAgreementServiceDesc();
    }
  }, [$updateCustomAgreementServiceDesc.success]);

  useEffect(() => {
    if (
      $uploadCustomAgreementFile.success &&
      $uploadCustomAgreementFile.agreementId === agreement.id
    ) {
      notification["success"]({
        message: "Файл прикреплен",
      });
      getAgreementDetails();
      setUploadedDocument(null);
      agreementsEffector.events.resetUploadCustomAgreementFile();
    }
  }, [$uploadCustomAgreementFile.success]);

  const onSaveDescription = () => {
    agreementsEffector.effects.updateCustomAgreementServiceDesc({
      id: agreement.id,
      note: newDescription,
    });
  };

  const uploadProps = {
    onRemove: () => {
      setUploadedDocument(null);
    },
    beforeUpload: (file: any) => {
      setUploadedDocument(file);

      return false;
    },
    fileList: uploadedDocument ? [uploadedDocument] : [],
  };

  const onUploadFileClick = () => {
    const formData = new FormData();
    formData.append("file", uploadedDocument);
    formData.append("relatedTo", "AGREEMENT");
    formData.append("relatedToId", agreement.id);

    agreementsEffector.effects.uploadCustomAgreementFile({
      data: formData,
      id: agreement.id,
    });
  };

  return (
    <div className="custom-agreement-service-expanded">
      <div className="custom-agreement-service-expanded__desc">
        <div className="custom-agreement-service-expanded__desc__head">
          <div className="custom-agreement-service-expanded__desc__head__inner">
            Описание
          </div>
          <div className="custom-agreement-service-expanded__desc__head__switcher">
            <Tooltip placement="topLeft" title="Изменить">
              <Switch checked={descEditMode} onChange={setDescEditMode} />
            </Tooltip>
          </div>
        </div>
        {descEditMode ? (
          <Form onFinish={onSaveDescription}>
            <FormField>
              <Input.TextArea
                className="custom-input"
                placeholder="Введите описание"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={5}
              />
            </FormField>
            <div className="custom-agreement-service-expanded__desc__save">
              <Button
                type="primary"
                htmlType="submit"
                loading={updateCustomAgreementDescLoading}
              >
                Сохранить
              </Button>
            </div>
            {updateCustomAgreementDescLoading && (
              <div className="abs-loader">
                <Spin size="large" />
              </div>
            )}
          </Form>
        ) : (
          <div>{agreement.description}</div>
        )}
      </div>
      <div className="custom-agreement-service-expanded__attachments">
        <div className="custom-agreement-service-expanded__desc__head">
          <div className="custom-agreement-service-expanded__desc__head__inner">
            Файлы
          </div>
        </div>
        <div className="custom-agreement-service-expanded__attachments__list">
          {agreement &&
            agreement.attachments &&
            agreement.attachments.map((item) => (
              <div className="custom-agreement-service-expanded__attachments__item">
                <div className="custom-agreement-service-expanded__attachments__item__icon">
                  <PaperClipOutlined />
                </div>
                <div className="custom-agreement-service-expanded__attachments__item__date">
                  {moment(item.createdDate).format("DD-MM-YYYY")}
                </div>
                <a href={item.url} target="_blank" download>
                  {item.originalFileName}
                </a>
              </div>
            ))}
        </div>
        <div className="custom-agreement-service-expanded__attachments__buttons">
          <Upload
            {...uploadProps}
            className="custom-agreement-service-expanded__attachments__buttons__upload"
          >
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
          <Button
            type="primary"
            onClick={onUploadFileClick}
            loading={uploadCustomAgreementFileLoading}
            disabled={!uploadedDocument}
          >
            Загрузить
          </Button>
        </div>
      </div>
    </div>
  );
};
