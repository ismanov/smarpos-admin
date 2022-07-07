import React, { useEffect, useState } from "react";
import { Button, Popover, Table, Select, Input, notification } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { ExpandedCustomAgreementService } from "../expanded-custom-agreement-service";
//import { getTariffPrice } from "app/presentationLayer/main/clients/agreements/helper";
import { DotsVerticalSvg } from "assets/svg";
import "./styles.scss";
//import { ServicePrice } from "app/presentationLayer/main/clients/agreements/components/service-price";
//import { PriceWrapper } from "app/presentationLayer/components/price-wrapper";
import { NavLink } from "react-router-dom";
import { FormField } from "app/presentationLayer/components/form-field";
import { useStore } from "effector-react";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import effector from "app/presentationLayer/effects/clients";
import { notFilledMessage } from "app/presentationLayer/main/clients/promotions/constants";
import { StringMapI } from "app/businessLogicLayer/models";
import { updateErrors } from "app/utils/utils";
import effectorClient from "app/presentationLayer/effects/clients";
const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Услуга",
    dataIndex: "serviceType",
    classNames: "flex-start",
  },
  // {
  //   title: "Тариф",
  //   dataIndex: "tariff",
  // },
  // {
  //   title: "Филиалы",
  //   dataIndex: "branches",
  // },
  // {
  //   title: "Сумма",
  //   dataIndex: "subTotal",
  // },
  // {
  //   title: "Стоимость",
  //   dataIndex: 'price',
  // },
  {
    title: "Описание",
    dataIndex: "description",
  },
  {
    title: "",
    dataIndex: "actions",
    width: "3%",
  },
];
export const CustomAgreementServices = (props) => {
  const { agreements, getAgreementDetails, data } = props;

  const $tariffsItems = useStore(agreementsEffector.stores.$tariffsItems);
  const $clientStat = useStore(effectorClient.stores.$clientStat);
  const $branchItems = useStore(effector.stores.$branchItems);
  const $createCustomAgreement = useStore(
    agreementsEffector.stores.$createCustomAgreement
  );
  const [customItemFields, setCustomItemFields] = useState<any>({
    branchIds: [],
  });
  const [customItemErrors, setCustomItemErrors] = useState<any>({});
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [aId, setAId] = useState<number | null>(null);

  useEffect(() => {
    if (data.id) setAId(data.id);
  }, [data.id]);

  useEffect(() => {
    agreementsEffector.effects.fetchTariffsItems(
      $clientStat?.data?.branchCount
        ? `?branchInstance=${$clientStat.data.branchCount}`
        : ""
    );
  }, [$clientStat]);

  useEffect(() => {
    if ($createCustomAgreement.successData && $createCustomAgreement.error) {
      notification["success"]({
        message: "Услуги добавлены",
      });
      getAgreementDetails();
      setCustomItemFields({
        branchIds: [],
      });
      setIsAdd(false);
    }
  }, [$createCustomAgreement.successData]);

  useEffect(() => {
    if ($createCustomAgreement.error) {
      notification["success"]({
        message: $createCustomAgreement.error?.title,
      });
    }
  }, [$createCustomAgreement.error]);

  const onCustomItemFieldChange = (fields) => {
    const errors = updateErrors(customItemErrors, fields);
    setCustomItemErrors(errors);
    setCustomItemFields({ ...customItemFields, ...fields });
  };

  const customItemValidation = () => {
    const errors: StringMapI = {};

    if (!customItemFields.serviceCode) errors.serviceCode = notFilledMessage;
    if (!customItemFields.branchIds.length) errors.branchIds = notFilledMessage;

    return errors;
  };

  const onAddCustomItemClick = () => {
    const errors = customItemValidation();

    setCustomItemErrors(errors);
    if (Object.keys(errors).length) {
      return;
    }
    const data = {
      data: {
        serviceType: customItemFields.serviceCode,
        branches: $branchItems.data
          .filter((item) =>
            customItemFields.branchIds.find((b) => b === item.id)
          )
          .map((branch) => ({
            branchId: branch.id,
            branchName: branch.name,
          })),
      },
      id: aId,
    };

    agreementsEffector.effects.createCustomAgreement(data);
  };

  const dataSource = agreements
    .sort((a, b) => {
      const codeVal = {
        CUSTOM_CATALOG_MANAGEMENT: 1,
        CUSTOM_USER_MANAGEMENT: 2,
        CUSTOM_PROMOTION_MANAGEMENT: 3,
        CUSTOM_TELEGRAM: 4,
        CUSTOM_WAREHOUSE_MANAGEMENT: 5,
      };

      if (a?.serviceType?.code) {
        return codeVal[a.serviceType.code] > codeVal[b.serviceType.code]
          ? 1
          : -1;
      } else return 1;
    })
    .map((item, index) => {
      return {
        id: item.id,
        key: item.id,
        num: <div className="w-s-n">{index + 1}</div>,
        serviceType: item.serviceType && item.serviceType.nameRu,
        // tariff: item.xizmat ? (<>
        //   {item.xizmat.title} (<ServicePrice tariff={item.xizmat} />)
        // </>): "-",
        //branches: item.branches.map((branch) => branch.branchName).join(", "),
        // subTotal: (<PriceWrapper price={getTariffPrice(item.xizmat) * item.instances} />),
        description: item.description || "-",
        //attachments: item.attachments,

        actions: (
          <Popover
            overlayClassName="custom__popover"
            placement="bottomRight"
            trigger="click"
            content={
              <div>
                <div className="custom__popover__item">
                  <Button
                    onClick={() => {
                      console.log(item);
                    }}
                  >
                    <NavLink
                      to={{
                        pathname: window.location.pathname
                          .split("/")
                          .slice(0, -2)
                          .join("/")
                          .concat(
                            getPath(
                              item.serviceType ? item.serviceType.nameRu : "def"
                            )
                          ),
                        state: {
                          agreementId: aId,
                        },
                      }}
                      exact
                    >
                      Выполнить
                    </NavLink>
                  </Button>
                </div>
              </div>
            }
          >
            {data?.status.code === "ACTIVE" ? (
              <Button
                className="custom__popover-btn"
                disabled={data?.status.code !== "ACTIVE"}
                type="ghost"
                icon={<DotsVerticalSvg />}
              />
            ) : (
              <span />
            )}
          </Popover>
        ),
      };
    });
  const addButton = {
    id: "addButton",
    key: "add",
    num: (
      <div style={{ marginLeft: -50 }}>
        <Button
          onClick={() => setIsAdd(true)}
          type="primary"
          icon={<PlusOutlined />}
          size={"middle"}
        >
          Добавить услугу
        </Button>
      </div>
    ),
  };
  const add = {
    key: "add",
    num: (
      <div className="flex-start" style={{ marginLeft: -50 }}>
        <Button
          icon={<CloseOutlined />}
          style={{ height: 45 }}
          size={"middle"}
          onClick={() => setIsAdd(false)}
          type="primary"
          danger
        >
          Close
        </Button>
      </div>
    ),
    serviceType: (
      <div className="flex-start">
        <FormField error={customItemErrors.serviceCode}>
          <Select
            className="custom-select"
            placeholder="Выберите услугу"
            loading={$tariffsItems.loading}
            value={customItemFields.serviceCode}
            onChange={(serviceCode) => onCustomItemFieldChange({ serviceCode })}
          >
            {($tariffsItems?.data || [])
              .reduce(
                (acc, item) => {
                  if (
                    item?.serviceType?.code.includes("CUSTOM_") &&
                    !acc.codes.includes(item.serviceType.code)
                  ) {
                    return {
                      items: [...acc.items, item],
                      codes: [...acc.codes, item.serviceType.code],
                    };
                  }
                  return { ...acc };
                },
                { items: [], codes: [] }
              )
              .items.map((item) => (
                <Select.Option
                  value={item?.serviceType?.code ? item.serviceType.code : ""}
                  key={item?.serviceType?.code ? item.serviceType.code : ""}
                >
                  {item?.serviceType?.nameRu ? item.serviceType.nameRu : ""}
                </Select.Option>
              ))}
          </Select>
        </FormField>
      </div>
    ),
    branches: (
      <div className="flex-start">
        <FormField error={customItemErrors.branchIds}>
          <Select
            className="custom-select"
            mode="multiple"
            loading={$branchItems.loading}
            placeholder="Выберите филиалы"
            value={customItemFields.branchIds}
            onChange={(branchIds) => onCustomItemFieldChange({ branchIds })}
          >
            {$branchItems.data.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </FormField>
      </div>
    ),

    description: (
      <FormField>
        <Input.TextArea
          className="custom-input"
          placeholder="Введите описание"
          value={customItemFields.description || ""}
          onChange={(e) =>
            onCustomItemFieldChange({ description: e.target.value })
          }
          rows={4}
        />
      </FormField>
    ),
    actions: (
      <div className="flex-start">
        <Button
          style={{ marginTop: 10 }}
          loading={$createCustomAgreement.loading}
          icon={<PlusOutlined />}
          size={"small"}
          onClick={onAddCustomItemClick}
          type="primary"
        />
      </div>
    ),
  };

  data.status.code === "ACTIVE" &&
    false &&
    dataSource.push(isAdd ? add : addButton);
  return (
    <div className="custom-agreement-services">
      <h2>Услуги</h2>
      <Table
        expandable={{
          rowExpandable: (agreement) => agreement.key !== "add",
          expandedRowRender: (agreement) =>
            !agreement.key ? null : (
              <ExpandedCustomAgreementService
                agreement={agreement}
                getAgreementDetails={getAgreementDetails}
              />
            ),
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

const getPath = (key) => {
  switch (key) {
    case "Работа с каталогом":
      return "/catalog";
    case "Работа с сотрудниками":
      return "/users";
    case "Работа с акциями ":
      return "/promotions";
    case "Работа с Телеграм":
      return "/telegram-accounts";
    case "Работа со складом":
      return "/warehouse/incomes";
    default:
      return "/agreements";
  }
};
