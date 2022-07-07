import React from "react";
import BaseError from "app/presentationLayer/error";

export default () => {
  return (
    <BaseError
      code={404}
      description="Такой страницы не существует"
      text="Страница не найдена!"
    />
  );
};
