import React from "react";
import BaseError from "app/presentationLayer/error";

export default () => {
  return (
    <BaseError
      code={500}
      description="Ошибка сервера, обратитесь к администратору!"
      text="Внутренная ошибка!"
    />
  );
};
