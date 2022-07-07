import { createEvent } from "effector";
import { AgreementsListFilterI } from "app/businessLogicLayer/models/Agreement";

export const resetCustomerPublicOffer = createEvent();
export const resetAcceptPublicOffer = createEvent();

export const updateAgreementsListFilter = createEvent<AgreementsListFilterI>();
export const resetAgreementsListFilter = createEvent();

export const resetActivateAgreement = createEvent();
export const resetPauseAgreement = createEvent();
export const resetCancelAgreement = createEvent();

export const resetCreateAgreement = createEvent();
export const resetCreateCustomAgreement = createEvent();
export const resetUpdateSubAgreement = createEvent();
export const resetUpdateCustomAgreementServiceDesc = createEvent();
export const resetUploadCustomAgreementFile = createEvent();
export const resetChangeQuoteStatus = createEvent();
export const resetUploadQuoteFile = createEvent();

export const resetAgreementCard = createEvent();