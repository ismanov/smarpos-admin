import React from "react";
import BaseError from "app/presentationLayer/error";

export default () => {
  return (
    <BaseError
      code={403}
      description="Ждите, возможно сервер перезагружается"
      text="Нет доступа!"
    />
  );
};
