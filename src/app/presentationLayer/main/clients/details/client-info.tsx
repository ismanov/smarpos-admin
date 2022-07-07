import React, { useState } from "react";
import { Button, Spin } from "antd";
import moment from "moment";

import effector from "app/presentationLayer/effects/clients";
import CurrentUserStore from "app/presentationLayer/effects/main";

import KeyPair from "app/presentationLayer/components/keyPair";
import { EditClientModal } from "app/presentationLayer/main/clients/details/edit-client-modal";
import Card from "app/presentationLayer/components/card";
import { useStore } from "effector-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export const ClientInfo = (props) => {
  const $clientDetails = useStore(effector.stores.$clientDetails);
  const { loading: detailsLoading, data: details } = $clientDetails;
  const $currentUser = useStore(CurrentUserStore.stores.$currentUser);
  const isAdmin = $currentUser?.data?.authorities?.includes(
    "ROLE_SMARTPOS_ADMIN"
  );
  const [editModalProps, setEditModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  const onEditClick = () => {
    setEditModalProps({ visible: true, shouldRender: true, details });
  };

  return (
    <Card className="CP__info">
      <div className="CP__info__head">
        <h2>Информация о клиенте</h2>
        {isAdmin && (
          <div>
            <Button
              shape="circle"
              icon={<FontAwesomeIcon className="svg" icon={faPen} />}
              onClick={onEditClick}
            />
          </div>
        )}
      </div>

      <div className="CP__info__content">
        {details && (
          <>
            <div className="CP__info__data">
              <div className="CP__info__data__item">
                <KeyPair title="Название компании" value={details.name} />
              </div>
              <div className="CP__info__data__item">
                <KeyPair title="ИНН" value={details.inn} />
              </div>
              <div className="CP__info__data__item">
                <KeyPair
                  title="Тип компании"
                  value={
                    details.businessType ? details.businessType.nameRu : ""
                  }
                />
              </div>
              <div className="CP__info__data__item">
                <KeyPair
                  title="Сфера деятельности"
                  value={
                    details.types
                      ? details.types.map((at) => at.name).join(", ")
                      : ""
                  }
                />
              </div>
              <div className="CP__info__data__item">
                <KeyPair
                  title="Контакт"
                  value={
                    details.contactFullName ? details.contactFullName.name : "-"
                  }
                />
              </div>
              <div className="CP__info__data__item">
                <KeyPair title="Номер телефона" value={details.phone} />
              </div>
              <div className="CP__info__data__item">
                <KeyPair title="Адрес компании" value={details.address} />
              </div>
              <div className="CP__info__data__item">
                <KeyPair
                  title="НДС"
                  value={details.paysNds ? `${details.ndsPercent} %` : "-"}
                />
              </div>
              <div className="CP__info__data__item">
                <KeyPair
                  title="Дата изменения"
                  value={moment(details.lastModifiedDate).format("DD-MM-YYYY")}
                />
              </div>
              <div className="CP__info__data__item">
                <KeyPair
                  title="Дата посл. синхронизации"
                  value={
                    details.syncDate
                      ? moment(details.syncDate).format("DD-MM-YYYY")
                      : "-"
                  }
                />
              </div>
            </div>
            {editModalProps.shouldRender && (
              <EditClientModal
                modalProps={editModalProps}
                setModalProps={setEditModalProps}
              />
            )}
          </>
        )}
        {detailsLoading && (
          <div className="abs-loader">
            <Spin />
          </div>
        )}
      </div>
    </Card>
  );
};
