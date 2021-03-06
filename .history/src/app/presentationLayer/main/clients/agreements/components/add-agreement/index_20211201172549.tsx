import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Button } from "antd";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import Card from "app/presentationLayer/components/card";
import { PublicOfferModal } from "../public-offer-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AddSubscribeAgreement } from "./add-subscribe-agreement";
import { AddCustomAgreement } from "./add-custom-agreement";
import "./styles.scss";
import { DATA_ENTRY } from "../../constants";
import effector from "app/presentationLayer/effects/clients";

export const AddAgreement = (props) => {
  const { tin, backUrl, history } = props;
  const { data } = useStore(effector.stores.$clientStat);
  const $tariffsItems = useStore(agreementsEffector.stores.$tariffsItems);

  const { data: tariffsItems, loading: tariffsItemsLoading } = $tariffsItems;

  const [subscribeServicesMap, setSubscribeServicesMap] = useState({});
  const [customServicesMap, setCustomServicesMap] = useState({});
  const [tariffDataEntry, setTariffDataEntry] = useState([]);

  const [publicOfferModalProps, setPublicOfferModalProps] = useState<any>({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    agreementsEffector.effects.fetchTariffsItems(
      data?.branchCount ? `?branchInstance=${data?.branchCount}` : ""
    );
    agreementsEffector.effects.fetchCustomerPublicOffer(tin);

    return () => {
      agreementsEffector.events.resetCustomerPublicOffer();
    };
  }, [data]);

  useEffect(() => {
    const subscribeServices = {};
    const customServices = {};
    const tariffDE: any | never[] = [];

    (tariffsItems || []).forEach((tariff) => {
      const serviceCode = tariff?.serviceType?.code
        ? tariff.serviceType.code
        : "";
      if (serviceCode === DATA_ENTRY) {
        tariffDE.push(tariff);
      }

      if (serviceCode.indexOf("CUSTOM_") === 0) {
        if (customServices[serviceCode]) {
          customServices[serviceCode].tariffs.push(tariff);
        } else {
          customServices[serviceCode] = {
            serviceType: tariff.serviceType,
            tariffs: [tariff],
          };
        }
      } else {
        if (subscribeServices[serviceCode]) {
          subscribeServices[serviceCode].tariffs.push(tariff);
        } else {
          subscribeServices[serviceCode] = {
            serviceType: tariff.serviceType,
            tariffs: [tariff],
          };
        }
      }
    });

    setSubscribeServicesMap(subscribeServices);
    setCustomServicesMap(customServices);
    setTariffDataEntry(tariffDE);
  }, [tariffsItems]);

  const showPublicOfferModal = (callBack) => {
    setPublicOfferModalProps({
      ...publicOfferModalProps,
      visible: true,
      shouldRender: true,
      tin,
      callBack,
    });
  };

  return (
    <Card className="add-agreement">
      <div className="custom-content__header">
        <div className="custom-content__header__left">
          <Button
            type="ghost"
            shape="circle"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            onClick={() => history.push(backUrl)}
          />
          <div className="custom-content__header__left-inner">
            <h1>???????????????? ????????????</h1>
          </div>
        </div>
      </div>

      <AddSubscribeAgreement
        services={subscribeServicesMap}
        servicesLoading={tariffsItemsLoading}
        showPublicOfferModal={showPublicOfferModal}
        tin={tin}
        branchCount={data?.branchCount}
        backUrl={backUrl}
        history={history}
      />
      <AddCustomAgreement
        services={customServicesMap}
        tariffDataEntry={tariffDataEntry}
        servicesLoading={tariffsItemsLoading}
        showPublicOfferModal={showPublicOfferModal}
        branchCount={data?.branchCount}
        tin={tin}
        backUrl={backUrl}
        history={history}
      />

      {publicOfferModalProps.shouldRender && (
        <PublicOfferModal
          modalProps={publicOfferModalProps}
          setModalProps={setPublicOfferModalProps}
        />
      )}
    </Card>
  );
};
