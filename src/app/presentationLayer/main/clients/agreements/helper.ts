import { agreementStatuses, PACKAGE, TIER, STANDART } from "./constants";
import { uniqArray } from "app/utils/utils";

export const getTariffPrice = (xizmat) => {
  const pricingModel = xizmat.pricingModel && xizmat.pricingModel.code;
  if (pricingModel === STANDART || pricingModel === TIER) {
    return  xizmat.fee;
  } else if (pricingModel === PACKAGE || pricingModel === TIER) {
    if (xizmat.tiers.length) {
      return xizmat.tiers[0].flatFee;
    }
  }

  return 0;
};

export const getAgreementPrice = (agreement) => {
  const xizmat = agreement.xizmat;

  if (xizmat) {
    const price = getTariffPrice(xizmat);
    const instances = agreement.instances || 1;

    return price * instances;
  } else if (agreement.agreements) {
    return agreement.agreements.reduce((acc, item) => acc + getAgreementPrice(item), 0);
  } else {
    return 0;
  }
};

export const getAgreementTariff = (agreement) => {
  if (agreement.xizmat) {
    return agreement.xizmat.title;
  } else if (agreement.agreements) {
    return uniqArray(agreement.agreements.map((item) => getAgreementTariff(item))).join(", ");
  } else {
    return "-";
  }
};

export const getTariffRecurring = (xizmat) => {
  return xizmat.recurring ? "Повторяющийся": "Разовый";
};

export const getAgreementRecurring = (agreement) => {
  if (agreement.xizmat) {
    return getTariffRecurring(agreement.xizmat);
  } else if (agreement.agreements) {
    return uniqArray(agreement.agreements.map((item) => getAgreementRecurring(item))).join(", ");
  } else {
    return "-";
  }
};

export const getTariffRecurringModel = (xizmat) => {
  if (xizmat && xizmat.recurring) {
    if (xizmat.recurringModel) {
      return ` на ${xizmat.recurringModel.intervalCount} ${xizmat.recurringModel.interval.nameRu}`;
    }
  }

  return "";
};

export const getStatusColor = (statusCode) => {
  switch (statusCode) {
    case agreementStatuses.ACTIVE:
      return "green";
    case agreementStatuses.INACTIVE:
      return "red";
    case agreementStatuses.PAUSE:
      return "orange";
  }

  return undefined;
};