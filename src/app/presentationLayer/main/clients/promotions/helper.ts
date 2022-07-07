import moment from "moment";
import { formatPrice } from "app/utils/utils";


// export const disabledDate = (current) => {
//   return current && current < moment().startOf('day');
// };

export const disabledDate = (current, { toDate = null, fromDate = null }: { toDate?: moment.Moment | null, fromDate?: moment.Moment | null }) => {
  return !!(!current || (toDate && current < toDate.startOf('day')) || (fromDate && current > fromDate.endOf('day')));
};

export const getNameByCode = (items, code) => {
  const promotionOn = items.find((item) => item.code === code);
  return promotionOn ? promotionOn.name: undefined;
};

export const formatRepeats = (repeats) => {
  if (!repeats || !repeats.length) return {};

  return repeats.reduce((acc, item) => {
    return { ...acc, [item]: true };
  }, {});
};

export const getPriceFromUnit = (unit, noPrice = undefined) => {
  if (!unit) return null;

  let price = noPrice || "Не указана";
  if (unit.price !== null) {
    price = formatPrice(unit.price);
  }

  return `Цена товара: ${price}`;
};