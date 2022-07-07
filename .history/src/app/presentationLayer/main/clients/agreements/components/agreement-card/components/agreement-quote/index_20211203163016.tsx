import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button, Spin, notification } from "antd";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import ReactToPrint from "react-to-print";
import {
  GENERATED_DOCUMENT,
  quoteStatuses,
  UPLOADED_DOCUMENT,
} from "../../constants";
import { UploadDocumentModal } from "../upload-document-modal";
import { isImage, isPdfOrImage } from "app/utils/file-types";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import effector from "app/presentationLayer/effects/clients";
import { DownloadSvg, PrinterSvg, UploadSvg } from "assets/svg";
import { printIframe } from "app/utils/print";
import { Status } from "app/presentationLayer/components/status";
import { getQuoteStatusColor } from "../../helper";
import Repository from "app/businessLogicLayer/repo";

export const AgreementQuote = (props) => {
  const { quoteId, getAgreementDetails } = props;

  const $quoteDetails = useStore(agreementsEffector.stores.$quoteDetails);
  const $generatedQuote = useStore(agreementsEffector.stores.$generatedQuote);
  const $uploadQuoteFile = useStore(agreementsEffector.stores.$uploadQuoteFile);
  const $changeQuoteStatus = useStore(
    agreementsEffector.stores.$changeQuoteStatus
  );
  const { data } = useStore(effector.stores.$clientDetails);

  const { loading: quoteLoading, data: quoteDetails } = $quoteDetails;

  const [activeDocument, setActiveDocument] = useState(GENERATED_DOCUMENT);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [hasTelegram, setHasTelegram] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const [uploadModalProps, setUploadModalProps] = useState({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    agreementsEffector.effects.fetchQuoteDetails(quoteId);
  }, []);

  useEffect(() => {
    if (quoteDetails) {
      if (quoteDetails.fileName && isPdfOrImage(quoteDetails.fileName)) {
        setActiveDocument(UPLOADED_DOCUMENT);
      } else {
        setActiveDocument(GENERATED_DOCUMENT);
        agreementsEffector.effects.fetchGeneratedQuote(quoteDetails.id);
      }
    }
  }, [quoteDetails]);
  useEffect(() => {
    if (!!data?.phone) {
      Repository.client
        .hasTelegram(data.phone)
        .then((res) => {
          setHasTelegram(res);
        })
        .catch((err) => {
          console.log(err);
          setHasTelegram(false);
        });
    }
  }, [data?.phone]);

  useEffect(() => {
    if ($changeQuoteStatus.success) {
      notification["success"]({
        message: "Статус изменен",
      });

      agreementsEffector.effects.fetchQuoteDetails(quoteId);
      agreementsEffector.events.resetChangeQuoteStatus();
      getAgreementDetails && getAgreementDetails();
    }
  }, [$changeQuoteStatus.success]);

  useEffect(() => {
    if ($uploadQuoteFile.success) {
      notification["success"]({
        message: "Документ current-order__document-btns",
      });

      agreementsEffector.effects.fetchQuoteDetails(quoteId);
      agreementsEffector.events.resetUploadQuoteFile();
    }
  }, [$uploadQuoteFile.success]);

  const sendToClient = () => {
    if (quoteId) {
      setLoader(true);
      Repository.client
        .sendQuoteConfirmToClientWithTelegram(quoteId)
        .then(() => {
          notification["success"]({
            message: "Отчет отправлен клиенту для подтверждение",
          });
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: err.title,
          });
        })
        .finally(() => setLoader(false));
    }
  };

  const onAcceptClick = () => {
    agreementsEffector.effects.changeQuoteStatus({
      id: quoteId,
      contractStatus: quoteStatuses.ACCEPTED,
    });
  };

  const onGenerateDocumentClick = () => {
    setActiveDocument(GENERATED_DOCUMENT);

    if (!$generatedQuote.data) {
      agreementsEffector.effects.fetchGeneratedQuote(quoteId);
    }
  };

  const onPrintDocumentClick = (id: string) => {
    if (activeDocument === GENERATED_DOCUMENT) {
      printIframe(id);
    }
  };

  const showUploadedDocument = () => {
    setActiveDocument(UPLOADED_DOCUMENT);
  };

  const onUploadClick = () => {
    setUploadModalProps({ visible: true, shouldRender: true });
  };

  const onUploadSubmit = (formData: FormData) => {
    agreementsEffector.effects.uploadQuoteFile({
      id: quoteDetails.id,
      file: formData,
    });
  };

  const generatedDocRender = () => {
    if ($generatedQuote.loading) {
      return (
        <div className="custom-loader">
          <Spin />
        </div>
      );
    } else {
      if ($generatedQuote.data) {
        return (
          <div>
            <div className="current-order__document-btns">
              <Button
                icon={<PrinterSvg />}
                onClick={() => onPrintDocumentClick("divToPrint")}
              />
            </div>
            <iframe
              id="divToPrint"
              width="100%"
              height="1000px"
              srcDoc={$generatedQuote.data}
            />
          </div>
        );
      }
    }

    return null;
  };

  if (!quoteDetails && quoteLoading) {
    return (
      <div className="custom-loader current-order-loader">
        <Spin size="large" />
      </div>
    );
  } else if (!quoteDetails) {
    return null;
  }

  let uploadedDocumentRef: any;

  return (
    <div className="current-order">
      <div className="current-order__top">
        <div className="current-order__top-left">
          <Status
            color={getQuoteStatusColor(quoteDetails.status.code)}
            size="large"
          >
            {quoteDetails.status.nameRu}
          </Status>
        </div>
        <div className="current-order__top-right">
          {hasTelegram && quoteDetails.status.code !== "ACCEPTED" && (
            <Button
              type="primary"
              size="middle"
              style={{
                backgroundColor: "#5c9dff",
                border: "#5c9dff",
                marginRight: 15,
              }}
              onClick={sendToClient}
              disabled={loader}
            >
              {loader ? <Spin /> : "Отправить клиенту"}
            </Button>
          )}
          <div className="current-order__btns">
            {quoteDetails.fileName && (
              <>
                <Button
                  onClick={onGenerateDocumentClick}
                  disabled={$generatedQuote.loading}
                >
                  Оригинал
                </Button>
                <div className="current-order__uploaded-file">
                  {isPdfOrImage(quoteDetails.fileName) ? (
                    <Button onClick={showUploadedDocument}>Загруженный</Button>
                  ) : (
                    <a
                      href={quoteDetails.fileUri}
                      target="_blank"
                      download
                      className="ant-btn file-download"
                    >
                      {quoteDetails.fileName}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="current-order__upload">
            <Button onClick={onUploadClick} icon={<UploadSvg />} />
          </div>

          {quoteDetails.status.code !== quoteStatuses.ACCEPTED && (
            <div className="current-order__accept">
              <Button
                type="primary"
                loading={$changeQuoteStatus.loading}
                onClick={onAcceptClick}
              >
                Подтвердить
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="current-order__document">
        {activeDocument === GENERATED_DOCUMENT ? (
          generatedDocRender()
        ) : (
          <div>
            <div className="current-order__document-btns">
              <ReactToPrint
                trigger={() => <Button icon={<PrinterSvg />} />}
                content={() => uploadedDocumentRef}
              />
              <a
                href={quoteDetails.fileUri}
                target="_blank"
                download
                className="ant-btn ant-btn-primary file-download"
              >
                <DownloadSvg />
              </a>
            </div>
            <div
              className="current-order__document-content"
              ref={(el) => (uploadedDocumentRef = el)}
            >
              {isImage(quoteDetails.fileName) ? (
                <div className="current-order__document-img">
                  <img src={quoteDetails.fileUri} alt="" />
                </div>
              ) : (
                <Document
                  file={quoteDetails.fileUri}
                  onLoadSuccess={({ numPages }) => setPdfNumPages(numPages)}
                  className="doc"
                >
                  {Array(pdfNumPages)
                    .fill(null)
                    .map((_, index) => (
                      <Page key={index} pageNumber={index + 1} width={1200} />
                    ))}
                </Document>
              )}
            </div>
          </div>
        )}
      </div>

      {uploadModalProps.shouldRender && (
        <UploadDocumentModal
          modalProps={uploadModalProps}
          setModalProps={setUploadModalProps}
          onUploadSubmit={onUploadSubmit}
          loading={$uploadQuoteFile.loading}
          success={$uploadQuoteFile.success}
          error={$uploadQuoteFile.error}
        />
      )}
    </div>
  );
};
