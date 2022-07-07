import { quoteStatuses } from "./constants";


export const getQuoteStatusColor = (statusCode) => {
  switch (statusCode) {
    case quoteStatuses.ACCEPTED:
      return "green";
  }

  return undefined;
};