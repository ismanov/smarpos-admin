import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "effector-react";
import {
  Table,
  Button,
  notification,
  Spin,
  Select,
  Input,
  Popconfirm,
  Upload,
} from "antd";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { DATA_ENTRY } from "app/presentationLayer/main/clients/agreements/constants";
import { UploadOutlined } from "@ant-design/icons";
import { ServicePrice } from "../../service-price";

const customItemsColumns = [
  {
    title: "",
    dataIndex: "sps",
    width: "10%",
  },
  {
    title: "",
    dataIndex: "num",
    width: 40,
  },
  {
    title: "Услуга",
    dataIndex: "service",
    width: "20%",
  },
  {
    title: "",
    dataIndex: "space1",
    width: "12%",
  },
  {
    title: "Описание",
    dataIndex: "description",
    width: "40%",
  },
  {
    title: "",
    dataIndex: "space",
    width: "15%",
  },
  // {
  //   title: "Документ",
  //   dataIndex: "addFile",
  //   width: "25%",
  // },
];

export const AddCustomAgreement = (props) => {
  const {
    services,
    //servicesLoading,
    showPublicOfferModal,
    tin,
    backUrl,
    history,
    tariffDataEntry,
    branchCount,
  } = props;

  const $agreementsList = useStore(agreementsEffector.stores.$agreementsList);

  const $customerPublicOffer = useStore(
    agreementsEffector.stores.$customerPublicOffer
  );
  const $createCustomAgreement = useStore(
    agreementsEffector.stores.$createCustomAgreement
  );

  const customServices = services.map((service) => ({
    service,
    description: "",
    documents: [],
  }));

  const [customItems, setCustomItems] = useState<any[]>([]);

  const [xizmatId, setXizmatId] = useState<any>(
    tariffDataEntry.length === 1 ? tariffDataEntry[0].id : null
  );
  useEffect(() => {
    if (customServices.length !== customItems.length) {
      setCustomItems(customServices);
    }
  }, [customServices]);
  useEffect(() => {
    agreementsEffector.effects.fetchAgreementsList({
      tin,
    });
  }, []);

  useEffect(() => {
    if (customItems.length < 1 && customServices.length > 0)
      setCustomItems(customServices);
  }, [customServices]);
  useEffect(() => {
    if ($createCustomAgreement.successData) {
      notification["success"]({
        message: "Аутсорсовые услуги добавлены",
      });

      agreementsEffector.events.resetCreateCustomAgreement();
      agreementsEffector.events.resetUpdateSubAgreement();
      // @ts-ignore
      history.push(`${backUrl}/${$createCustomAgreement.successData.id}`);
    }
  }, [$createCustomAgreement.successData]);
  const agreementsServicesIds = useMemo(() => {
    return $agreementsList.data.find(
      (item) =>
        item &&
        item.xizmat &&
        item.xizmat.id === xizmatId &&
        item?.status?.code === "ACTIVE"
    );
  }, [xizmatId]);
  const uploadProps = (value, index) => ({
    accept:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onRemove: (file) => {
      change(
        "document",
        customItems[index]?.documents.filter((f) => f.name === file.name),
        index
      );
    },
    beforeUpload: (file: any) => {
      change("document", [...customItems[index]?.documents, file], index);
      return false;
    },
    fileList: value.name,
  });
  const onCustomAgreementSubmit = (id: number | string | null = null) => {
    const data = {
      agreements: customItems.map((item) => {
        const formData = new FormData();
        item.documents && formData.append("file", item.document);
        return {
          serviceType: item.service.code,
          description: item.description,
          instances: 1,
          // branches: item.branches.map((branch) => ({
          //   branchId: branch.id,
          //   branchName: branch.name,
          // })),
        };
      }),
      instances: branchCount,
      companyInn: tin,
      xizmatId: xizmatId,
      serviceType: DATA_ENTRY,
    };
    // if (id)
    //   agreementsEffector.effects.createCustomAgreement({
    //     data: customItems.map((item) => {
    //       return {
    //         serviceType: item.service.code,
    //         branches: item.branches.map((branch) => ({
    //           branchId: branch.id,
    //           branchName: branch.name,
    //         })),
    //       };
    //     }),
    //     id,
    //   });
    agreementsEffector.effects.createCustomAgreement(data);
  };

  const change = (method, value, index) => {
    setCustomItems((prev) => {
      const newObj = prev.slice();
      newObj[index][method] = value;
      return newObj;
    });
  };

  const activateService = (id = null) => {
    if ($customerPublicOffer.data) {
      onCustomAgreementSubmit(id);
    } else if (
      $customerPublicOffer.error &&
      $customerPublicOffer.error.status === 404
    ) {
      showPublicOfferModal(() => {
        onCustomAgreementSubmit(id);
      });
    }
  };

  const selectedServiceTariffs = tariffDataEntry ? tariffDataEntry : [];

  const customItemsDataSource: any[] = (customItems || []).map(
    (item, index) => {
      return {
        key: index,
        num: index + 1,
        service: item?.service.nameRu,
        description: (
          <Input.TextArea
            className="custom-input"
            placeholder="Введите описание"
            value={item.description || ""}
            onChange={(e) => {
              change("description", e.target.value, index);
            }}
            rows={1}
          />
        ),
        addFile: (
          <Upload {...uploadProps(item.documents, index)}>
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
        ),
      };
    }
  );

  useEffect(() => {
    if (selectedServiceTariffs.length === 1) {
      setXizmatId(selectedServiceTariffs[0].id);
    }
  }, [selectedServiceTariffs]);
  return (
    <div className="add-agreement__custom-services add-agreement__block">
      <div className="add-agreement__block__head">
        <div className="add-agreement__block__head__left">
          <span>Аутсорсовые</span>
          <div className="add-agreement__custom-services__select-tariff">
            <Select
              className="custom-select"
              placeholder="Выберите тариф"
              value={xizmatId}
              onChange={(tariffId) => setXizmatId(tariffId)}
              disabled={selectedServiceTariffs.length === 1}
            >
              {selectedServiceTariffs.map((tariff) => (
                <Select.Option value={tariff.id} key={tariff.id}>
                  {tariff.title} - (<ServicePrice tariff={tariff} />)
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <Table
        dataSource={customItemsDataSource}
        columns={customItemsColumns}
        rowClassName={(record) => (record.key === "add" ? "add-row" : "")}
        pagination={false}
      />
      <div className="add-agreement__custom-services__submit"></div>
      <Popconfirm
        disabled={!agreementsServicesIds}
        title={
          <div className="text-align-center">
            У этого клиента уже есть активная подписка на Аутсорс услуги за
            текущий период.
            <br /> Перейти к существующей подписке?
          </div>
        }
        onCancel={() => {
          // activateService();
        }}
        onConfirm={() => {
          history.push(`${backUrl}/${agreementsServicesIds.id}`);
        }}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type="primary"
          loading={$createCustomAgreement.loading}
          disabled={!xizmatId}
          onClick={() => {
            if (!agreementsServicesIds) activateService();
          }}
        >
          Активировать
        </Button>
      </Popconfirm>
      {$createCustomAgreement.loading && (
        <div className="modal-loader">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};
