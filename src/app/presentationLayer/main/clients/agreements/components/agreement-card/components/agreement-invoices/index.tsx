import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import moment from "moment";
import { Table } from "antd";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { ExpandedAgreementInvoice } from "./expanded-agreement-invoice";
import { pageSizeOptions } from "app/constants";
import { getQuoteStatusColor } from "app/presentationLayer/main/clients/agreements/components/agreement-card/helper";
import { Status } from "app/presentationLayer/components/status";

const columns = [
  {
    title: "",
    dataIndex: "num",
    width: 50,
  },
  {
    title: "Номер",
    dataIndex: "documentNumber",
  },
  {
    title: "Публичная оферта",
    dataIndex: "publicOffer",
  },
  {
    title: "Сумма",
    dataIndex: "totalPriceWithVat",
  },
  {
    title: "Дата счет-фактуры",
    dataIndex: "invoiceDate",
  },
  {
    title: "Статус",
    dataIndex: "status",
  },
  {
    title: "Статус x-file",
    dataIndex: "xfileStatus",
  },
];

export const AgreementInvoices = (props) => {
  const { quoteId } = props;

  const $agreementInvoices = useStore(
    agreementsEffector.stores.$agreementInvoices
  );
  const [filterProps, setFilterProps] = useState({});

  const { loading: invoicesLoading, data: invoicesData } = $agreementInvoices;
  const {
    content: invoices,
    // @ts-ignore
    page: invoicesPage,
    size: invoicesSize,
    totalElements: invoicesTotal,
  } = invoicesData;

  useEffect(() => {
    agreementsEffector.effects.fetchAgreementInvoices({
      quoteId,
      params: filterProps,
    });
  }, [quoteId, filterProps]);

  const onFilterChange = (fields) => {
    setFilterProps({ ...filterProps, page: 0, ...fields });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ ...filterProps, page: page - 1, size });
  };

  const data = invoices.map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{invoicesSize * invoicesPage + index + 1}</div>,
    documentNumber: item.documentNumber,
    publicOffer: item.customerPublicOfferNumber,
    totalPriceWithVat: (
      <>
        <strong>{item.totalPriceWithVat.toLocaleString("ru")}</strong> сум
      </>
    ),
    invoiceDate: moment(item.invoiceDate)
      .locale("ru")
      .format("DD.MM.YYYY"),
    status: item.status && (
      <Status color={getQuoteStatusColor(item.status.code)}>
        {item.status.nameRu}
      </Status>
    ),
    xfileStatus: item.xfileStatus ? "" : "-",
  }));

  return (
    <div>
      <Table
        expandable={{
          expandedRowRender: (invoice) => (
            <ExpandedAgreementInvoice invoiceId={invoice.id} />
          ),
        }}
        dataSource={data}
        columns={columns}
        loading={invoicesLoading}
        pagination={{
          total: invoicesTotal,
          pageSize: invoicesSize,
          current: invoicesPage + 1,
          hideOnSinglePage: true,
          showSizeChanger: true,
          pageSizeOptions,
          onChange: onChangePagination,
        }}
      />
    </div>
  );
};
