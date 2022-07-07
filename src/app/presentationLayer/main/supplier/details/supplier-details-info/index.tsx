import React from "react";
import { Spin } from "antd";
import moment from "moment";

import KeyPair from "app/presentationLayer/components/keyPair";
import Card from "app/presentationLayer/components/card";

export const SupplierDetailsInfo = (props) => {
  const { data: details, loading } = props.supplierDetails;

  return (
    <Card className="CP__info">
      <div className="CP__info__head">
        <h2>Информация о поставщике</h2>
      </div>
      <div className="CP__info__content">
        {details && <>
          <div className="CP__info__data">
            <div className="CP__info__data__item">
              <KeyPair title="Название компании" value={details.name} />
            </div>
            <div className="CP__info__data__item">
              <KeyPair title="ИНН" value={details.tin} />
            </div>
            <div className="CP__info__data__item">
              <KeyPair title="Регион" value={details.address.region.name} />
            </div>
            <div className="CP__info__data__item">
              <KeyPair title="Район" value={details.address.city.name} />
            </div>
            <div className="CP__info__data__item">
              <KeyPair title="Кол-во филиалов" value={`${details.totalBranch}`} />
            </div>
            <div className="CP__info__data__item">
              <KeyPair title="Номер телефона" value={details.owner.phone} />
            </div>
            {details.address.address &&
              <div className="CP__info__data__item">
                <KeyPair title="Адрес компании" value={details.address.address}/>
              </div>
            }
            <div className="CP__info__data__item">
              <KeyPair title="Дата регистрации" value={moment(details.createdDate).format('DD-MM-YYYY')} />
            </div>
            <div className="CP__info__data__item">
              <KeyPair title="Владелец" value={`${details.owner.lastName} ${details.owner.firstName} ${details.owner.patronymic}`} />
            </div>
          </div>
        </>}
        {loading && <div className="abs-loader">
          <Spin />
        </div>}
      </div>
    </Card>
  )
};