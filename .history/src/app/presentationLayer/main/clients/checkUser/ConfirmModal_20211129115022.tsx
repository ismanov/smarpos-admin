import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Step1 from "./Step1";
import Step2 from "./Step2";
import effector from "app/presentationLayer/effects/clients";
import { useStore } from "effector-react";
import { resetConfirmRes } from "./../../../effects/clients/events";
import Repository from "app/businessLogicLayer/repo";
import { fullRedirect } from "app/coreLayer/redirect";

type propsType = {};

const Confirm: React.FC<propsType> = ({}) => {
  const $confirmDetails = useStore(effector.stores.$confirmDetails);
  const $confirmRes = useStore(effector.stores.$confirmRes);
  const loading = false;

  const [hasTelegram, setHasTelegram] = useState<boolean>(false);
  const [typeSms, setTypeSms] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<{ id: number; phone: string } | null>(null);

  useEffect(() => {
    const cF = async () => {
      try {
        const cData = await sessionStorage.getItem("cData");
        if (!!cData) {
          setData(JSON.parse(cData));
        } else {
          fullRedirect("/signin");
        }
      } catch (error) {
        console.log(await error);

        fullRedirect("/signin");
      }
    };
    cF();

    return () => {
      resetConfirmRes();
    };
  }, []);

  useEffect(() => {
    $confirmDetails.data?.id && setStep(2);
  }, [$confirmDetails.data]);

  useEffect(() => {
    if (!!$confirmRes.data?.code) {
      fullRedirect(
        sessionStorage.getItem("lastUrl") || "/main/monitoring/companies"
      );
    }
  }, [$confirmRes.data]);

  useEffect(() => {
    if (!!data?.phone) {
      Repository.client
        .hasTelegram(data.phone)
        .then((res) => {
          setHasTelegram(res);
        })
        .catch((err) => {
          console.log(err);
          setHasTelegram(false);
        });
    }
  }, [data?.phone]);

  const sendSms = (typeEnum?: string) => {
    let type = typeEnum || typeSms;
    typeEnum && setTypeSms(typeEnum);
    effector.effects.sendConfirmSmsEffect({
      companyId: data?.id,
      phoneNumber: data?.phone,
      typeEnum: type,
    });
  };
  const confirm = (code: string) => {
    effector.effects.ConfirmResEffect({
      code,
      permissionId: $confirmDetails?.data?.id,
    });
  };

  return (
    <Modal
      {...{
        title: "",
        centered: true,
        width: 600,
        footer: null,
        maskStyle: { background: "white" },
        visible: true,
        onCancel: () => {
          fullRedirect("/main/monitoring/companies");
          setStep(1);
          sessionStorage.setItem("cData", "");
        },
      }}
    >
      {step === 1 ? (
        <Step1
          setStep={setStep}
          loading={loading || $confirmDetails.loading}
          error={$confirmDetails.error}
          phone={data?.phone}
          sendSms={sendSms}
          hasTelegram={hasTelegram}
        />
      ) : (
        <Step2
          setStep={setStep}
          loading={$confirmRes.loading || loading || $confirmDetails.loading}
          error={$confirmRes.error || $confirmDetails.error}
          phone={data?.phone}
          sendSms={sendSms}
          confirm={confirm}
        />
      )}
    </Modal>
  );
};
export default Confirm;
