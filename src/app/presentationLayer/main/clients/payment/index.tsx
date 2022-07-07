import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Alert,
  Button,
  InputNumber,
  Row,
  Col,
  Card,
  Spin,
  notification,
} from "antd";
import InputMask from "react-input-mask";
import PinInput from "react-pin-input";
import "./styles.scss";
import Repository from "app/businessLogicLayer/repo";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { useStore } from "effector-react";

export const Payment = (props) => {
  const { clientTin, match, history } = props;

  const [form] = Form.useForm();

  const { data } = useStore(agreementsEffector.stores.$customerBalance);

  const [step, setStep] = useState(1);
  const [smsCode, setSmsCode] = useState("");
  const [resData, setResData] = useState<any>(null);

  const [countDownActive, setCountDownActive] = useState(false);
  const [createPaymentError, setCreatePaymentError] = useState<any>(null);
  const [acceptPaymentError, setAcceptPaymentError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);
  useEffect(() => {
    agreementsEffector.effects.fetchCustomerBalance(clientTin);
  }, [clientTin]);
  const onResendActivationKeyClick = () => {
    // const phone = getDigitsNums(form.getFieldValue("phone"));
    //
    // userEffector.effects.changeLoginInit({
    // 	login: phone,
    // });
  };
  const onFinish = (formData) => {
    console.log("formData", formData);

    if (step === 1) {
      const pan = getDigitsNums(formData.pan);
      const expiry = getDigitsNums(formData.expiry);

      if (!validatePan(pan)) {
        form.setFields([
          {
            name: "pan",
            errors: ["Неверный формат"],
          },
        ]);

        return;
      }

      if (!validateExpiry(expiry)) {
        form.setFields([
          {
            name: "expiry",
            errors: ["Неверный формат"],
          },
        ]);

        return;
      }
      setLoading(true);
      Repository.payment
        .createTransaction({
          amount: formData.amount,
          expiry: String(expiry[0] + expiry[1] + expiry[2] + expiry[3]),
          pan,
          tin: clientTin,
        })
        .then((result) => {
          if (result?.status === "PENDING") {
            setResData(result);
            setStep(2);
            setCountDownActive(true);
            setAcceptPaymentError(null);
            setCreatePaymentError(null);
          }
        })
        .catch(async (err) => {
          setCreatePaymentError(err.response.data);
        })
        .finally(() => setLoading(false));
    } else if (step === 2) {
      if (!smsCode || smsCode.length !== 5) {
        form.setFields([
          {
            name: "smsCode",
            errors: ["Заполните поле"],
          },
        ]);

        return;
      }

      Repository.payment
        .confirmTransaction({
          billId: resData?.id,
          confirmationKey: smsCode,
          transactionId: resData?.localId,
        })
        .then(() => {
          notification["success"]({
            message: "Оплата прошла успешно",
          });
          history.push(match.url.split("/payment")[0]);
        })
        .catch(async (err) => {
          setAcceptPaymentError(err.response.data);
        })
        .finally(() => setLoading(false));
    }
  };

  const renderByStep = () => {
    if (step === 1) {
      return (
        <>
          <Row justify="space-between" gutter={[20, 0]}>
            <Col span={16}>
              <Form.Item
                label="Номер карты"
                name="pan"
                rules={[{ required: true, message: "Заполните поле" }]}
              >
                <InputMask
                  mask="9999 9999 9999 9999"
                  placeholder="---- ---- ---- ----"
                  maskChar="-"
                >
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Срок действия"
                name="expiry"
                rules={[{ required: true, message: "Заполните поле" }]}
              >
                <InputMask mask="99 / 99" placeholder="-- / --" maskChar="-">
                  {(inputProps) => <Input {...inputProps} />}
                </InputMask>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Сумма перевода"
            name="amount"
            rules={[
              {
                required: true,
                message: "Пожалуйста заполните поле!",
              },
            ]}
          >
            <InputNumber
              placeholder="Введите сумму"
              formatter={formatNumber}
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <Form.Item
            label="Код из CMC"
            name="smsCode"
            rules={[{ required: true, message: "Заполните поле" }]}
          >
            <SmsCodeField
              codeSize={5}
              phoneNum={resData?.maskedPhoneNumber}
              onChange={setSmsCode}
              error={form.getFieldError("smsCode").length}
              countDownActive={countDownActive}
              onTimerFinish={() => setCountDownActive(false)}
              onResendClick={onResendActivationKeyClick}
              inputStyle={{ width: "56px", marginRight: "20px" }}
            />
          </Form.Item>
        </>
      );
    } else return null;
  };

  return (
    <Card>
      <Row>
        <Col span={12}>
          <Form
            className="CKBP"
            form={form}
            layout={"vertical"}
            requiredMark={false}
            onFinish={onFinish}
          >
            {/*<ContentHeader className={classes.header} title={t("settings:security.changePhone.title")} />*/}

            {createPaymentError && (
              <div className="CKBP__error">
                <Alert message={createPaymentError.title} type="error" />
              </div>
            )}
            {acceptPaymentError && (
              <div className="CKBP__error">
                <Alert message={acceptPaymentError?.title} type="error" />
              </div>
            )}
            {loading && (
              <div className="abs-loader">
                <Spin />
              </div>
            )}

            {data && (
              <div className="CKBP__client-info">
                <div className="CKBP__client-info__item">
                  <strong>Баланс:</strong> <PriceWrapper price={data} />
                </div>
                {/* <div className="CKBP__client-info__item">
            <strong>Нужно оплатить:</strong>{" "}
            <PriceWrapper price={clientInfoData?.needAmount} />
          </div> */}
              </div>
            )}

            {renderByStep()}

            <div className="CKBP__button">
              <Button type="primary" htmlType="submit" loading={loading}>
                {step === 1 ? "Продолжить" : "Подтвердить"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

const validatePan = (num: string) => num.length === 16;
const validateExpiry = (num: string) => num.length === 4;

const PriceWrapper = ({ price }: { price?: number }) => {
  if (!price) {
    return null;
  }

  return (
    <span className="w-s-n">
      <strong>{(price || 0).toLocaleString("ru")}</strong> сум
    </span>
  );
};

export const formatNumber = (price: string | number = 0) => {
  const n = String(price),
    p = n.indexOf(".");

  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m} ` : m
  );
};

export const getDigitsNums = (phone) => {
  return phone.replace(/\D/g, "");
};

export const SmsCodeField = (props) => {
  const {
    className = "",
    codeSize = 5,
    timerSeconds = 59,
    onChange,
    error,
    countDownActive,
    onTimerFinish,
    phoneNum,

    inputStyle = {},
  } = props;

  const [pinCodeComplete, setPinCodeComplete] = useState(false);
  const timerTime = useCountDown({
    start: countDownActive,
    onTimerFinish,
    seconds: timerSeconds,
  });

  const onSmsCodeChange = (value) => {
    onChange(value);

    if (value.length === codeSize) {
      setPinCodeComplete(true);
    } else {
      setPinCodeComplete(false);
    }
  };

  const onComplete = (value) => {
    onSmsCodeChange(value);
  };

  return (
    <>
      <div
        className={`SCF__pinCode ${
          pinCodeComplete ? "SCF__pinCodeComplete" : ""
        } ${error ? "SCF__pinCodeError" : ""} ${className}`}
      >
        <PinInput
          length={codeSize}
          initialValue=""
          type="numeric"
          inputStyle={{
            borderColor: "#d9d9d9",
            width: "52px",
            height: "48px",
            margin: "0 16px 0 0",
            ...inputStyle,
          }}
          inputFocusStyle={{ borderColor: "#908DE1" }}
          onChange={onSmsCodeChange}
          onComplete={onComplete}
        />
      </div>
      <Alert
        className="SCF__alert"
        message={
          <>
            <div>СМС было отправлено на номер {phoneNum}</div>
            <div>
              Срок действия кода 00:
              {timerTime < 10 ? `0${timerTime}` : timerTime}
            </div>
            {/*{!countDownActive && <div className="SCF__resendBtn" onClick={onResendHandler}>*/}
            {/*  Отправить СМС еще раз*/}
            {/*  {$resendKey && $resendKey.loading && <span className="SCF__resendBtnLoading">*/}
            {/*    <Spin indicator={antLoadingIcon} />*/}
            {/*  </span>}*/}
            {/*</div>}*/}
          </>
        }
        type="info"
        showIcon
      />
    </>
  );
};

function useCountDown({ start, onTimerFinish, seconds = 60 }) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    let interval;
    if (start) {
      interval = setInterval(() => {
        if (count <= 0) {
          onTimerFinish && onTimerFinish();
          clearInterval(interval);
        } else {
          setCount((value) => value - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [start, count]);

  useEffect(() => {
    if (start && count === 0) {
      setCount(seconds);
    }
  }, [start]);

  return count;
}

export default Payment;
