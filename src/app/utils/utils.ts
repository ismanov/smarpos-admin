import { debounce } from "app/utils/debounce-lodash";

export const groupBy = (key, array) =>
  (array || []).reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const RegionCodesForMap = Object.seal({
  'UZ-TO': 27,
  'UZ-AN': 3,
  'UZ-SA': 18,
  'UZ-BU': 6,
  'UZ-FA': 30,
  'UZ-JI': 8,
  'UZ-NG': 14,
  'UZ-NW': 12,
  'UZ-QA': 10,
  'UZ-SI': 24,
  'UZ-SU': 22,
  'UZ-XO': 33,
  'UZ-QR': 35
});

export const formatPrice = function (value: string | number | undefined = 0, n = 0, x = 3) {
  var re = '\\d(?=(\\d{' + (x) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return Number(value).toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

export const formatNumber = (price: string | number | undefined = 0) => {
  const n = String(price),
    p = n.indexOf('.');

  return n.replace(
    /\d(?=(?:\d{3})+(?:\.|$))/g,
    (m, i) => p < 0 || i < p ? `${m} ` : m
  );
};

export const onPaths = (paths) => {
  return (match, location) => {
    for (let i = 0; i < paths.length; i++) {
      const item = paths[i];
      let path;
      let exact = false;

      if (typeof item === "object") {
        path = item.path;
        exact = !!item.exact;
      } else {
        path = item;
      }

      if (location.pathname === path || (!exact && location.pathname.includes(path))) {
        return true;
      }
    }

    return false;
  };
};

export const withDebounce = debounce((action) => {
  action();
}, 500, false);

export const getRestStr = (str, subStr) => {
  if (str.indexOf(subStr) > -1) {
    return str.slice(subStr.length);
  } else {
    return "";
  }
};

export const updateErrors = (errors, fields) => {
  const newErrors = { ...errors };

  for (const [key, value] of Object.entries(fields)) {
    if (value) {
      delete newErrors[key];
    }
  }
  return newErrors;
};

export const insertToArray = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
];

export const uniqArray = (array) => {
  const hash = {};
  return array.filter((item) => {
    return hash[item] ? false : (hash[item] = true);
  });
};