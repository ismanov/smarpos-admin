import React from "react";
import {
  getTariffPrice,
  getAgreementPrice,
  getTariffRecurringModel,
} from "app/presentationLayer/main/clients/agreements/helper";
import { PriceWrapper } from "app/presentationLayer/components/price-wrapper";

export const ServicePrice = (props) => {
  const { agreement, tariff } = props;

  let price = 0;
  let recurring;

  if (agreement) {
    price = agreement.total ? agreement.total : getAgreementPrice(agreement);
    recurring = getTariffRecurringModel(agreement.xizmat);
  } else if (tariff) {
    price = getTariffPrice(tariff);
    recurring = getTariffRecurringModel(tariff);
  }

  return (
    <span className="w-s-n">
      <PriceWrapper price={price} />
      {recurring}
    </span>
  );
};
