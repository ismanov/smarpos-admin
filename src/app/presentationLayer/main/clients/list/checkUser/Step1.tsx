import React from "react";
import { Button, Spin } from "antd";

type PropsType = {
  setStep: (step: number) => void;
  sendSms: (typeEnum) => void;
  loading: boolean;
  error: any;
  phone: any;
  hasTelegram: boolean;
};

const Step1: React.FC<PropsType> = ({
  setStep,
  loading,
  error,
  sendSms,
  phone,
  hasTelegram,
}) => {
  return (
    <div className="checkModal">
      {loading && (
        <div className="loaderContainer">
          <Spin />
        </div>
      )}
      <span className="checkModal__title">
        Дополнительные детали будут показыватся по согласию клиента. Система
        отправит код подтверждения на номер +{phone}
      </span>
      {error && <span className="error-text">{error?.title}</span>}
      <div className="checkModal__buttons">
        <Button
          type="primary"
          style={{ background: "#0088cc" }}
          size="middle"
          className="checkModal__buttons__telegram"
          disabled={!hasTelegram}
          onClick={() => {
            sendSms("TELEGRAM");
          }}
        >
          Отправить по Телеграм
        </Button>
        <Button
          type="primary"
          disabled={!phone}
          size="middle"
          onClick={() => {
            sendSms("SMS");
          }}
        >
          Отправить SMS
        </Button>
      </div>
    </div>
  );
};

export default Step1;
