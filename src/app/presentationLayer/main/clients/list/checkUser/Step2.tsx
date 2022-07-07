import React, { useEffect, useRef, useState } from "react";
import { Button, Spin } from "antd";
import PinInput from "react-pin-input";

type PropsType = {
  setStep: (step: number) => void;
  onConfirm: () => void;
  loading: boolean;
  error: any;
  confirm: (code: string) => void;
  sendSms: () => void;
  phone: any;
};

const Step2: React.FC<PropsType> = ({
  setStep,
  confirm,
  loading,
  sendSms,
  error,
  phone,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  // const [value1, setValue1] = useState("");
  // const [value2, setValue2] = useState("");
  // const [value3, setValue3] = useState("");
  // const [value4, setValue4] = useState("");
  // const [value5, setValue5] = useState("");
  const [res, setRes] = useState("");

  // useEffect(() => {
  //   document.getElementById("1")?.focus();
  // }, []);

  // const onChangeText = (e, id: number) => {
  //   let text = e.target.value.slice(-1);
  //   if (!text && id > 1) back(id);
  //   if (!"0123456789".includes(text)) return;
  //   else if (!!text && id < 5) next(id);
  //   switch (String(id)) {
  //     case "1":
  //       setValue1(text);
  //       break;
  //     case "2":
  //       setValue2(text);
  //       break;
  //     case "3":
  //       setValue3(text);
  //       break;
  //     case "4":
  //       setValue4(text);
  //       break;
  //     case "5":
  //       setValue5(text);
  //       break;
  //   }
  // };
  // const reset = () => {
  //   setValue1("");
  //   setValue2("");
  //   setValue3("");
  //   setValue4("");
  //   setValue5("");
  // };

  // const next = (id: number) => {
  //   document.getElementById(String(id))?.blur();
  //   document.getElementById(String(id + 1))?.focus();
  // };
  // const back = (id: number) => {
  //   document.getElementById(String(id))?.blur();
  //   document.getElementById(String(id - 1))?.focus();
  // };
  // const onKeyDown = (e) => {
  //   const id = Number(e.currentTarget.id);
  //   switch (e.key) {
  //     case "ArrowLeft":
  //       if (id > 1) {
  //         e.preventDefault();
  //         back(id);
  //       }
  //       break;
  //     case "ArrowRight":
  //       if (id < 5) {
  //         e.preventDefault();
  //         next(id);
  //       }
  //       break;
  //     case "Enter":
  //       if (res.length === 5) {
  //         confirm(res);
  //       }
  //       break;
  //     case "Backspace":
  //       if (e.target?.value === "") {
  //         if (id > 1) {
  //           e.preventDefault();
  //           back(id);
  //         }
  //       }
  //       break;
  //   }
  // };
  return (
    <div className="checkModal">
      {loading && (
        <div className="loaderContainer">
          <Spin />
        </div>
      )}
      <span className="checkModal__title">
        Мы отправили код на номер клиента: +{phone}. <br />
        Введите код ниже:
      </span>
      {error && <span className="error-text">{error?.title}</span>}
      <div className="checkModal__input-field" ref={divRef}>
        {/* <input
          id="1"
          type="text"
          value={value1}
          onKeyDown={onKeyDown}
          onChange={(e) => onChangeText(e, 1)}
        />
        <input
          id="2"
          onKeyDown={onKeyDown}
          type="text"
          value={value2}
          onChange={(e) => onChangeText(e, 2)}
        />
        <input
          id="3"
          type="text"
          onKeyDown={onKeyDown}
          value={value3}
          onChange={(e) => onChangeText(e, 3)}
        />
        <input
          id="4"
          type="text"
          onKeyDown={onKeyDown}
          value={value4}
          onChange={(e) => onChangeText(e, 4)}
        />
        <input
          id="5"
          type="text"
          onKeyDown={onKeyDown}
          value={value5}
          onChange={(e) => onChangeText(e, 5)}
        /> */}

        <PinInput
          length={5}
          initialValue=""
          type="numeric"
          inputStyle={{
            borderColor: "#d9d9d9",
            width: "25px",
            height: "24px",
            margin: "0 8px 0 0",
          }}
          inputFocusStyle={{ borderColor: "#908DE1" }}
          onChange={(value) => {
            setRes(value);
          }}
        />
        <ButtonWithTimer
          onClick={() => {
            sendSms();
            setRes("");
          }}
        >
          Отправить еще раз
        </ButtonWithTimer>
      </div>
      <div className="checkModal__button-field">
        <Button type="link" size="small" onClick={() => setStep(1)}>
          Назад
        </Button>
        <Button
          disabled={res.length !== 5 || loading}
          type="primary"
          size="middle"
          onClick={() => {
            confirm(res);
          }}
        >
          Подтвердить код
        </Button>
      </div>
    </div>
  );
};

export default Step2;

const ButtonWithTimer: React.FC<{ onClick: () => void }> = React.memo(
  (props) => {
    const [timer, setTimer] = useState(60);

    useEffect(() => {
      if (timer > 0)
        setTimeout(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
    }, [timer]);
    return (
      <Button
        disabled={timer > 0}
        type="link"
        size="small"
        onClick={() => {
          props.onClick();
          setTimer(60);
        }}
      >
        <span style={timer > 0 ? { color: "grey" } : {}}>{`${props.children} ${
          timer > 0 ? timer : ""
        }`}</span>
      </Button>
    );
  }
);
