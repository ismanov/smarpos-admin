import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Alert, Button, Table } from "antd";

import effector from "app/presentationLayer/effects/supplier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const columns = [
  {
    title: "",
    dataIndex: 'num',
    width: 50,
  },
  {
    title: "Название товара",
    dataIndex: "productName"
  },
  {
    title: "Ед. изм.",
    dataIndex: "unitName"
  },
  {
    title: "Мин. заказ",
    dataIndex: "minOrder"
  },
  {
    title: "Кол-во",
    dataIndex: "qty"
  },
  {
    title: "НДС",
    dataIndex: "vat"
  },
  {
    title: "Сумма",
    dataIndex: "costPrice"
  },
];

export const SupplierDetailsOrdersPage = (props) => {
  const orderId = props.match.params.orderId;

  const $supplierDetailsCurrentOrder = useStore(effector.stores.$supplierDetailsCurrentOrder);

  const { data: currentOrder, loading, error } = $supplierDetailsCurrentOrder;

  useEffect(() => {
    effector.effects.fetchSupplierDetailsCurrentOrderEffect(orderId);

    return () => {
      effector.events.resetSupplierDetailsCurrentOrder();
    }
  }, []);

  const data = currentOrder ? currentOrder.orderItems.map((item, index) => {
    const selectedUnit = item.units.filter((u) => u.selected);
    const unitName = selectedUnit[0].name;
    const minOrder = selectedUnit[0].minOrder;

    return {
      id: item.id,
      key: item.id,
      num: (<div className="w-s-n">{index + 1}</div>),
      productName: item.product.name,
      unitName,
      minOrder,
      qty: item.qty,
      vat: item.noVat ? "Нет" : "Да",
      costPrice: <><strong>{item.costPrice.toLocaleString("ru")}</strong> сум</>
    }
  }) : [];

  return (
    <>
      <div className="custom-content__header">
        <div className="custom-content__header__left">
          <Button
            onClick={() => props.history.goBack()}
            type="ghost"
            shape="circle"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
          <div className="custom-content__header__left-inner">
            <h1>Заказ №: {currentOrder && currentOrder.number}</h1>
          </div>
        </div>
      </div>
      {error && <div className="custom-content__error">
        <Alert message={error.message} type="error" />
      </div>}
      <div className="custom-content__info">
        <div>Статус: <strong>{currentOrder && currentOrder.status.nameRu}</strong></div>
        <div>Способ доставки: <strong>{currentOrder && currentOrder.deliveryType.nameRu}</strong></div>
        <div>Способ оплаты: <strong>{currentOrder && currentOrder.paymentType.nameRu}</strong></div>
        <div>Сумма заказа: <strong>{currentOrder && currentOrder.total.toLocaleString("ru")} сум</strong></div>
      </div>
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </div>
    </>
  )
};