import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Link, Route, Switch } from "react-router-dom";
import { Button, Menu } from "antd";

import effector from "app/presentationLayer/effects/supplier";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import {
  PAGE_TYPE,
  SUP_COMPANY_DETAILS_STAT,
  SUP_COMPANY_DETAILS_STAT_COMPLETE_ORDERS,
  SUP_COMPANY_DETAILS_STAT_TOTAL_COMPLETE_AMOUNT,
  SUP_COMPANY_DETAILS_STAT_TOTAL_ORDERS,
  SUP_COMPANY_DETAILS_ORDERS
} from "app/presentationLayer/components/with-permission/constants";
import { WithPermission } from "app/presentationLayer/components/with-permission";

import { SupplierDetailsInfo } from "./supplier-details-info";
import { SupplierDetailsOrders } from "./supplier-details-orders";

const getRestStr = (str, subStr) => {
  if (str.indexOf(subStr) > -1) {
    return str.slice(subStr.length);
  } else {
    return "";
  }
};

export const SupplierDetails = (props) => {
  const { location, match, history } = props;
  const supplierId = match.params.supplierId;

  const $supplierDetails = useStore(effector.stores.$supplierDetails);

  const { data: details } = $supplierDetails;

  const openedTabFromUrl = getRestStr(location.pathname, match.url).slice(1);
  const [ openedTab, setOpenedTab ] = useState(openedTabFromUrl || "/");

  const getSupplierDetails = () => {
    effector.effects.fetchSupplierDetailsEffect(supplierId);
  };

  useEffect(() => {
    getSupplierDetails();

    return () => {
      effector.events.resetSupplierCard();
    }
  }, []);

  const onNavigationClick = e => {
    setOpenedTab(e.key);
  };

  return (
    <div className="CP">
      <div className="custom-content__header">
        <div className="custom-content__header__left">
          <Button
            onClick={() => history.goBack()}
            type="ghost"
            shape="circle"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
          <div className="custom-content__header__left-inner">
            <h1>{details ? details.name : ""}</h1>
          </div>
        </div>
      </div>
      <WithPermission className="CP__stats__item" annotation={SUP_COMPANY_DETAILS_STAT} showChecker={false}>
        <div className="CP__stats">
          {details && <>
            <WithPermission
              className="CP__stats__item"
              annotation={SUP_COMPANY_DETAILS_STAT_TOTAL_ORDERS}
              placement={{ left: 5, top: 0, bottom: 0 }}
            >
              <div>
                <div>Кол-во заказов</div>
                <strong>{details.totalOrder.toLocaleString("ru")}</strong>
              </div>
            </WithPermission>
            <WithPermission
              className="CP__stats__item"
              annotation={SUP_COMPANY_DETAILS_STAT_COMPLETE_ORDERS}
              placement={{ left: 5, top: 0, bottom: 0 }}
            >
              <div>
                <div>Завершенные заказы</div>
                <strong>{details.totalCompletedOrder.toLocaleString("ru")}</strong>
              </div>
            </WithPermission>
            <WithPermission
              className="CP__stats__item"
              annotation={SUP_COMPANY_DETAILS_STAT_TOTAL_COMPLETE_AMOUNT}
              placement={{ left: 5, top: 0, bottom: 0 }}
            >
              <div>
                <div>Сумма</div>
                <strong>{details.totalCompletedAmount.toLocaleString("ru")}</strong>
              </div>
            </WithPermission>
          </>}
        </div>
      </WithPermission>
      <div className="CP__content">
        <div className="CP__navigation">
          <Menu onClick={onNavigationClick} selectedKeys={[ openedTab ]} mode="horizontal" triggerSubMenuAction="click">
            <Menu.Item key="/">
              <div className="CP__navigation__item-inner">
                <Link to={match.url}>Информация</Link>
              </div>
            </Menu.Item>
            <Menu.Item key="orders">
              <WithPermission annotation={SUP_COMPANY_DETAILS_ORDERS} placement={{ right: -12, top: 0, bottom: 0 }}>
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/orders`}>Заказы</Link>
                </div>
              </WithPermission>
            </Menu.Item>
          </Menu>
        </div>

        <div>
          <Switch>
            <Route
              exact
              path={match.path}
              render={() => <SupplierDetailsInfo supplierDetails={$supplierDetails} />}
            />
            <Route
              path={`${match.path}/orders`}
              render={(props) => <WithPermission
                annotation={SUP_COMPANY_DETAILS_ORDERS}
                type={PAGE_TYPE}
                showChecker={false}
              >
                <SupplierDetailsOrders {...props} />
              </WithPermission>}
            />
          </Switch>
        </div>
      </div>
    </div>
  )
};