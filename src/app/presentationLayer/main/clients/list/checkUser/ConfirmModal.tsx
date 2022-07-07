import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Step1 from "./Step1";
import Step2 from "./Step2";
import effector from "app/presentationLayer/effects/clients";
import { useStore } from "effector-react";
import { resetConfirmRes } from "./../../../../effects/clients/events";
import Repository from "app/businessLogicLayer/repo";

type propsType = {
  step1Option?: any;
  step2Option: any;
  setStep: (num: number) => void;
  options: any;
  companyId: number | null;
  step: number;
};

const ConfirmModal: React.FC<propsType> = ({
  setStep,
  step1Option,
  step2Option,
  options,
  step,
  companyId,
}) => {
  const $clientDetails = useStore(effector.stores.$clientDetails);
  const $confirmDetails = useStore(effector.stores.$confirmDetails);
  const $confirmRes = useStore(effector.stores.$confirmRes);
  const { data, loading } = $clientDetails;

  const [hasTelegram, setHasTelegram] = useState<boolean>(false);
  const [typeSms, setTypeSms] = useState<string | null>(null);

  useEffect(() => {
    $confirmDetails.data?.id && setStep(2);
  }, [$confirmDetails.data]);

  useEffect(() => {
    $confirmRes.data?.code && step2Option.onConfirm();
  }, [$confirmRes.data]);

  useEffect(() => {
    if (!!companyId) {
      effector.effects.fetchClientDetails(companyId);
    }
  }, [companyId]);

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
  useEffect(() => {
    return () => {
      resetConfirmRes();
    };
  }, []);

  const sendSms = (typeEnum?: string) => {
    let type = typeEnum || typeSms;
    typeEnum && setTypeSms(typeEnum);
    effector.effects.sendConfirmSmsEffect({
      companyId,
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
    <Modal {...options}>
      {step === 1 ? (
        <Step1
          setStep={setStep}
          {...step1Option}
          loading={loading || $confirmDetails.loading}
          error={$confirmDetails.error}
          phone={data?.phone}
          sendSms={sendSms}
          hasTelegram={hasTelegram}
        />
      ) : (
        options.visible && (
          <Step2
            setStep={setStep}
            {...step2Option}
            loading={$confirmRes.loading || loading || $confirmDetails.loading}
            error={$confirmRes.error || $confirmDetails.error}
            phone={data?.phone}
            sendSms={sendSms}
            confirm={confirm}
          />
        )
      )}
    </Modal>
  );
};
export default ConfirmModal;
