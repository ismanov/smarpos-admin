import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Collapse, Table, Button, Popconfirm, notification, Spin } from "antd";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import {
  getTariffPrice,
  getTariffRecurring,
} from "app/presentationLayer/main/clients/agreements/helper";
import { ServicePrice } from "app/presentationLayer/main/clients/agreements/components/service-price";
import { PriceWrapper } from "app/presentationLayer/components/price-wrapper";
import { DATA_ENTRY } from "app/presentationLayer/main/clients/agreements/constants";

const { Panel } = Collapse;

const subscribeColumns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Название",
    dataIndex: "title",
  },
  {
    title: "Тип покупки",
    dataIndex: "recurring",
  },
  {
    title: "Тип тарифа",
    dataIndex: "pricingModel",
  },
  {
    title: "Стоимость услуги",
    dataIndex: "price",
  },
  {
    title: "Стоимость активации",
    dataIndex: "totalSum",
  },
  {
    title: "",
    dataIndex: "actions",
    width: 50,
  },
];

export const AddSubscribeAgreement = (props) => {
  const {
    services,
    servicesLoading,
    showPublicOfferModal,
    tin,
    backUrl,
    history,
    branchCount,
  } = props;

  const $customerPublicOffer = useStore(
    agreementsEffector.stores.$customerPublicOffer
  );
  const $createAgreement = useStore(
    agreementsEffector.stores.$createSubscriptionAgreement
  );
  const $branchesCount = useStore(agreementsEffector.stores.$branchesCount);
  const branchesCount = $branchesCount.data;

  useEffect(() => {
    agreementsEffector.effects.fetchBranchesCount({ tin });
  }, []);

  useEffect(() => {
    if ($createAgreement.success) {
      notification["success"]({
        message: "Услуга добавлена",
      });

      agreementsEffector.events.resetCreateAgreement();
      history.push(backUrl);
    }
  }, [$createAgreement.success]);

  const onSubscribeAgreementSubmit = (tariffId, serviceType, instances) => {
    agreementsEffector.effects.createSubscriptionAgreement({
      customer: {
        inn: tin,
      },
      serviceType: serviceType.code,
      instances: branchCount,
      xizmat: {
        id: tariffId,
      },
    });
  };

  const activateService = (tariffId, serviceType, instances) => {
    if ($customerPublicOffer.data) {
      onSubscribeAgreementSubmit(tariffId, serviceType, instances);
    } else if (
      $customerPublicOffer.error &&
      $customerPublicOffer.error.status === 404
    ) {
      showPublicOfferModal(() => {
        onSubscribeAgreementSubmit(tariffId, serviceType, instances);
      });
    }
  };

  const mapTariffs = (tariffs, serviceType) => {
    return tariffs.map((item, index) => {
      const price = getTariffPrice(item);
      let totalSum;
      let instances = 1;

      if (item.calculatePer) {
        if (branchesCount) {
          totalSum = (
            <div>
              <PriceWrapper price={price * branchesCount} /> за {branchesCount}{" "}
              филиалов
            </div>
          );
          instances = branchesCount;
        }
      } else {
        totalSum = (
          <div>
            <PriceWrapper price={price} />
          </div>
        );
      }

      return {
        key: item.id,
        num: <div className="w-s-n">{index + 1}</div>,
        title: item.title,
        recurring: getTariffRecurring(item),
        pricingModel: item.pricingModel && item.pricingModel.nameRu,
        price: <ServicePrice tariff={item} />,
        totalSum: totalSum,
        actions: (
          <div>
            <Popconfirm
              placement="topRight"
              title="Вы действительно хотите активировать тариф?"
              onConfirm={() => activateService(item.id, serviceType, instances)}
            >
              <Button
                className="add-agreement__activate-btn"
                type="primary"
                loading={
                  $createAgreement.loading &&
                  $createAgreement.tariffId === item.id
                }
                disabled={!$customerPublicOffer.loaded}
              >
                Активировать
              </Button>
            </Popconfirm>
          </div>
        ),
      };
    });
  };

  return (
    <div className="add-agreement__services add-agreement__block">
      <div className="add-agreement__block__head">
        <div className="add-agreement__block__head__left">Подписки</div>
      </div>
      {!!Object.keys(services).length && (
        <Collapse>
          {Object.keys(services)
            .filter((sc) => !!sc && sc !== DATA_ENTRY)
            .map((serviceCode) => {
              const serviceType = services[serviceCode].serviceType;
              const tariffs = services[serviceCode].tariffs;

              return (
                <Panel header={serviceType?.nameRu} key={serviceCode}>
                  <div>
                    <Table
                      dataSource={mapTariffs(tariffs, serviceType)}
                      columns={subscribeColumns}
                      pagination={false}
                    />
                  </div>
                </Panel>
              );
            })}
        </Collapse>
      )}
      {servicesLoading && (
        <div className="abs-loader">
          <Spin />
        </div>
      )}
    </div>
  );
};
