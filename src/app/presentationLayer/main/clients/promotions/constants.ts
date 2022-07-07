export const DAILY = "DAILY";
export const WEEK_DAYS = "WEEKDAYS";
export const MONTH_DAYS = "MONTH_DAYS";
export const PRODUCT = "PRODUCT";
export const BASKET = "BASKET";
export const PERCENTAGE = "PERCENTAGE";
export const AMOUNT = "AMOUNT";

export const ACTIVE = "ACTIVE";
export const PLANNED = "PLANNED";
export const ENDED = "ENDED";
export const PAUSED = "PAUSED";
export const CANCELLED = "CANCELLED";

export const notFilledMessage = "Поле не заполнено";
export const dateFormat = 'YYYY-MM-DD';

export const repeatTypes = [
  { name: "Каждый день", code: DAILY },
  { name: "Дни недели", code: WEEK_DAYS },
  { name: "Дни в месяц", code: MONTH_DAYS }
];

export const promotionOnItems = [
  { name: "Товар", code: PRODUCT, disabled: false },
  { name: "Корзина", code: BASKET, disabled: false },
];

export const bonusOnItems = [
  { name: "Товар", code: PRODUCT, disabled: false },
  { name: "Корзина", code: BASKET, disabled: false },
];

export const bonusTypeItems = [
  { name: "%", code: PERCENTAGE },
  { name: "Сумма", code: AMOUNT },
];