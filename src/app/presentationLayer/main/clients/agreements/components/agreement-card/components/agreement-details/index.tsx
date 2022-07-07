import React from "react";
import { CustomAgreementServices } from "../custom-agreement-services";
import { DATA_ENTRY } from "app/presentationLayer/main/clients/agreements/constants";
import moment from "moment";
import { ServicePrice } from "app/presentationLayer/main/clients/agreements/components/service-price";
import {
  getAgreementRecurring,
  getAgreementTariff,
} from "app/presentationLayer/main/clients/agreements/helper";

export const AgreementDetails = (props) => {
  const { data, getAgreementDetails } = props;

  return (
    <div className="agreement-card__details-wrap">
      <div className="agreement-card__details">
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Услуга</div>
          <div className="agreement-card__details__value">
            {data.serviceType && data.serviceType.nameRu}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Тариф</div>
          <div className="agreement-card__details__value">
            {getAgreementTariff(data)}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Тип услуги</div>
          <div className="agreement-card__details__value">
            {getAgreementRecurring(data)}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Статус</div>
          <div className="agreement-card__details__value">
            {data.status && data.status.nameRu}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Дата активации</div>
          <div className="agreement-card__details__value">
            {data.firstActivatedDate
              ? moment(data.firstActivatedDate).format("DD.MM.YYYY")
              : "-"}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Следующий платеж</div>
          <div className="agreement-card__details__value">
            {data.nextPeriodStart
              ? moment(data.nextPeriodStart).format("DD.MM.YYYY")
              : "-"}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">Стоимость</div>
          <div className="agreement-card__details__value">
            <ServicePrice agreement={data} />
          </div>
        </div>
      </div>
      {data.serviceType && data.serviceType.code === DATA_ENTRY && (
        <CustomAgreementServices
          data={data}
          agreements={data.agreements}
          getAgreementDetails={getAgreementDetails}
        />
      )}
    </div>
  );
};
