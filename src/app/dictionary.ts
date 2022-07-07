const dictionary = {
  "ROLE_BRANCH_ADMIN": "Администратор филиала",
  "ROLE_OWNER": "Владелец",
  "ROLE_CASHIER": "Кассир",
  "ROLE_INTERN": "Стажер",
  "ROLE_CONTENT_MANAGER": "Контент менеджер",
};

export const getFromDictionary = (value) => {
  return dictionary[value] || value;
};

