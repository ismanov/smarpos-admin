import React, { useEffect, useRef, useState } from "react";
import { Button, notification, Spin, Tag } from "antd";
import ReactToPrint from "react-to-print";
import { PrinterSvg } from "assets/svg";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { useStore } from "effector-react";
import moment from "moment";
import CurrentUserStore from "app/presentationLayer/effects/main";
import Repository from "app/businessLogicLayer/repo";
import effector from "app/presentationLayer/effects/clients";

type propsType = {
  agreementId: number;
  agreementDetails: any;
};

const Report: React.FC<propsType> = ({ agreementId, agreementDetails }) => {
  const componentRef = useRef<HTMLTableElement>(null);
  const $dataEntry = useStore(agreementsEffector.stores.$dataEntry);
  const { data } = useStore(effector.stores.$clientDetails);
  const $statusUpdate = useStore(agreementsEffector.stores.$statusUpdate);
  const $currentUser = useStore(CurrentUserStore.stores.$currentUser);
  const isAdmin = $currentUser?.data?.authorities?.includes(
    "ROLE_SMARTPOS_ADMIN"
  );
  const [hasTelegram, setHasTelegram] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const firstActivatedDate = agreementDetails.firstActivatedDate
    ? moment(agreementDetails.firstActivatedDate).format("DD.MM.YYYY")
    : "-";
  const nextPeriodStart = agreementDetails.nextPeriodStart
    ? moment(agreementDetails.nextPeriodStart).format("DD.MM.YYYY")
    : "-";

  useEffect(() => {
    agreementsEffector.effects.fetchDataEntryByAgreementId(agreementId);
  }, []);
  useEffect(() => {
    !$statusUpdate?.loading &&
      agreementsEffector.effects.fetchDataEntryByAgreementId(agreementId);
  }, [$statusUpdate?.loading]);

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

  const statusParse = (statusCode) => {
    switch (statusCode) {
      case "DRAFT":
        return "ОЖИДАЕТСЯ ПОДТВЕРЖДЕНИЕ КЛИЕНТА";
      case "APPROVED":
        return "ПОДТВЕРЖДЕН";
      default:
        return statusCode;
    }
  };

  const approve = () =>
    agreementsEffector.effects.updateStatusDataEntry({
      id: $dataEntry?.data?.id,
    });

  const sendToClient = () => {
    if ($dataEntry?.data?.id) {
      setLoader(true);
      Repository.client
        .setToClientWithTelegram({ id: $dataEntry.data.id })
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

  if ($dataEntry?.loading) return <Spin />;
  return (
    <div className="agreements-report">
      <div>
        <div className="agreements-report__header">
          {$dataEntry?.data?.status ? (
            <Tag color="success" className="agreements-report__header__status">
              {statusParse($dataEntry?.data?.status || "")}
            </Tag>
          ) : (
            <span />
          )}
          {$dataEntry?.data?.status !== "APPROVED" ? (
            $statusUpdate?.loading ? (
              <Spin />
            ) : (
              $dataEntry?.data && (
                <div style={{ display: "flex" }}>
                  {hasTelegram && (
                    <Button
                      type="primary"
                      size="middle"
                      style={{ backgroundColor: "#5c9dff", border: "#5c9dff" }}
                      onClick={sendToClient}
                      disabled={loader}
                    >
                      {loader ? <Spin /> : "Отправить клиенту"}
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      type="primary"
                      size="middle"
                      onClick={approve}
                      style={{ marginLeft: 15 }}
                    >
                      Подтвердить
                    </Button>
                  )}
                </div>
              )
            )
          ) : (
            <span>{$dataEntry?.data?.approvedDate}</span>
          )}
        </div>
        <div className="flex-end">
          <ReactToPrint
            trigger={() => (
              <Button
                type="primary"
                style={{
                  background: "white",
                  border: "black solid .5px",
                  padding: 5,
                }}
                icon={<PrinterSvg size={"256"} />}
                size={"middle"}
              />
            )}
            content={() => componentRef.current}
          />
        </div>
        <table ref={componentRef} style={{ border: "none" }}>
          <div className="agreements-report__info">
            <span className="agreements-report__info__title">
              Отчет об оказанных услугах
            </span>
            <div className="agreements-report__info__body">
              <span>Заказ: {agreementDetails.agreementNumber}</span>
              <span>
                Период: {firstActivatedDate + " - " + nextPeriodStart}
              </span>
            </div>
          </div>
          <table>
            <colgroup span={4}></colgroup>
            <tr>
              <th>Услуга</th>
              <th>Филиал</th>
              <th>Количество</th>
              <th>Исполнитель</th>
            </tr>
            {($dataEntry?.data?.items || []).map((item, index) => (
              <tr key={item.id}>
                <td>{item.serviceType.nameRu}</td>
                <td>{item.branchName}</td>
                <td>{item.count}</td>
                <td>{item.updateName}</td>
              </tr>
            ))}
          </table>
        </table>
      </div>
    </div>
  );
};

export default Report;
