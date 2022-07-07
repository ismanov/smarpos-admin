import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Alert, Button, Menu, Spin } from "antd";
import { Link, Switch, Route } from "react-router-dom";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import Card from "app/presentationLayer/components/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getRestStr } from "app/utils/utils";
import { AgreementDetails } from "./components/agreement-details";
import { PublicOffer } from "./components/public-offer";
import { AgreementQuote } from "./components/agreement-quote";
import { AgreementInvoices } from "./components/agreement-invoices";
import { Status } from "app/presentationLayer/components/status";
import { getStatusColor } from "app/presentationLayer/main/clients/agreements/helper";
import { PriceWrapper } from "app/presentationLayer/components/price-wrapper";
import "./styles.scss";
import Report from "./components/agreements-reports/index";
import { DATA_ENTRY } from "app/presentationLayer/main/clients/agreements/constants";

export const AgreementCard = (props) => {
  const { match, history, tin, backUrl } = props;
  const agreementId = match.params.agreementId;

  const $agreementDetails = useStore(
    agreementsEffector.stores.$agreementDetails
  );
  const $customerBalance = useStore(agreementsEffector.stores.$customerBalance);

  const {
    data: agreementDetails,
    loading: agreementDetailsLoading,
    error: agreementDetailsError,
  } = $agreementDetails;

  const openedTabFromUrl = getRestStr(location.pathname, match.url).slice(1);
  const [openedTab, setOpenedTab] = useState(openedTabFromUrl || "/");

  const getAgreementDetails = () => {
    agreementsEffector.effects.fetchAgreementDetails(agreementId);
    agreementsEffector.effects.fetchCustomerBalance(tin);
  };

  useEffect(() => {
    getAgreementDetails();

    return () => {
      agreementsEffector.events.resetAgreementCard();
    };
  }, [agreementId]);

  const onNavigationClick = (e) => {
    setOpenedTab(e.key);
  };

  return (
    <div className="agreement-card">
      {agreementDetails && (
        <>
          <div className="custom-content__header">
            <div className="custom-content__header__left">
              <Button
                type="ghost"
                shape="circle"
                icon={<FontAwesomeIcon icon={faChevronLeft} />}
                onClick={() => history.push(backUrl)}
              />
              <div className="custom-content__header__left-inner">
                <h1>Заказ: {agreementDetails.agreementNumber}</h1>
              </div>
              <Status
                color={getStatusColor(agreementDetails.status.code)}
                size="large"
              >
                {agreementDetails.status.nameRu}
              </Status>
            </div>
            <div className="custom-content__header__right">
              <div className="customer-balance">
                <div>
                  Баланс:
                  {$customerBalance.data && (
                    <PriceWrapper price={$customerBalance.data} />
                  )}
                </div>
                {$customerBalance.loading && (
                  <div className="abs-loader">
                    <Spin />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="agreement-card__body">
            <Card className="agreement-card__side">
              <Menu
                className="agreement-card__navigation"
                selectedKeys={[openedTab]}
                mode="vertical"
                triggerSubMenuAction="click"
                onClick={onNavigationClick}
              >
                <Menu.Item key="/">
                  <div className="agreement-card__navigation__item">
                    <Link to={match.url}>Детали</Link>
                  </div>
                </Menu.Item>
                <Menu.Item key="public-offer">
                  <div className="agreement-card__navigation__item">
                    <Link to={`${match.url}/public-offer`}>
                      Публичная оферта
                    </Link>
                  </div>
                </Menu.Item>
                <Menu.Item key="quote">
                  <div className="agreement-card__navigation__item">
                    <Link to={`${match.url}/quote`}>Счет на оплату</Link>
                  </div>
                </Menu.Item>
                <Menu.Item key="invoices">
                  <div className="agreement-card__navigation__item">
                    <Link to={`${match.url}/invoices`}>Счет фактуры</Link>
                  </div>
                </Menu.Item>
                {agreementDetails?.serviceType?.code === DATA_ENTRY && (
                  <Menu.Item key="report">
                    <div className="agreement-card__navigation__item">
                      <Link to={`${match.url}/report`}>Отчет</Link>
                    </div>
                  </Menu.Item>
                )}
              </Menu>
            </Card>
            <Card className="agreement-card__content">
              <Switch>
                <Route
                  exact
                  path={match.url}
                  render={(props) => (
                    <AgreementDetails
                      {...props}
                      agreementId={agreementId}
                      data={agreementDetails}
                      loading={agreementDetailsLoading}
                      getAgreementDetails={getAgreementDetails}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/public-offer`}
                  render={(props) => <PublicOffer {...props} tin={tin} />}
                />
                <Route
                  exact
                  path={`${match.url}/quote`}
                  render={(props) => (
                    <AgreementQuote
                      {...props}
                      getAgreementDetails={getAgreementDetails}
                      quoteId={agreementDetails.quoteId}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/invoices`}
                  render={(props) => (
                    <AgreementInvoices
                      {...props}
                      quoteId={agreementDetails.quoteId}
                    />
                  )}
                />
                {agreementDetails?.serviceType?.code === DATA_ENTRY && (
                  <Route
                    exact
                    path={`${match.url}/report`}
                    render={(props) => (
                      <Report
                        agreementId={agreementId}
                        agreementDetails={agreementDetails}
                      />
                    )}
                  />
                )}
              </Switch>
            </Card>
          </div>
        </>
      )}
      {agreementDetailsError && (
        <div className="custom-content__error">
          <Alert message={agreementDetailsError.message} type="error" />
        </div>
      )}
      {agreementDetailsLoading && (
        <div className="agreement-card__loader">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};
