import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { useStore } from "effector-react";
import { Menu, Button } from "antd";

import { ClientInfo } from "app/presentationLayer/main/clients/details/client-info";
import ClientCatalog from "app/presentationLayer/main/clients/catalog";
import ClientCheques from "app/presentationLayer/main/clients/cheques";
import WarehouseStock from "app/presentationLayer/main/clients/warehouse/stock";
import WarehouseStockByDay from "app/presentationLayer/main/clients/warehouse/stock-by-day";
import WarehouseIncomes from "app/presentationLayer/main/clients/warehouse/incomes";
import AddWarehouseIncome from "app/presentationLayer/main/clients/warehouse/incomes/add-income";
import DataEntry from "app/presentationLayer/main/clients/dataEntry";
import { Branches } from "app/presentationLayer/main/clients/bracnhes";
import { Kkms } from "app/presentationLayer/main/clients/kkms";
import { Users } from "app/presentationLayer/main/clients/users";
import { Logs } from "app/presentationLayer/main/clients/logs";
import { Promotions } from "app/presentationLayer/main/clients/promotions";
import { Agreements } from "app/presentationLayer/main/clients/agreements";
import { TelegramAccounts } from "app/presentationLayer/main/clients/telegram-accounts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  MON_COMPANY_DETAILS_BRANCHES,
  MON_COMPANY_DETAILS_CATALOG,
  MON_COMPANY_DETAILS_CHEQUES,
  MON_COMPANY_DETAILS_INCOMES,
  MON_COMPANY_DETAILS_INCOMES_ADD,
  MON_COMPANY_DETAILS_KKMS,
  MON_COMPANY_DETAILS_LOGS,
  MON_COMPANY_DETAILS_PROMOTION,
  MON_COMPANY_DETAILS_STOCK,
  MON_COMPANY_DETAILS_STOCK_BY_DAY,
  MON_COMPANY_DETAILS_USERS,
  PAGE_TYPE,
  MON_COMPANY_DETAILS_STAT,
  MON_COMPANY_DETAILS_STAT_CHEQUES,
  MON_COMPANY_DETAILS_STAT_BRANCHES,
  MON_COMPANY_DETAILS_STAT_KKM,
  MON_COMPANY_DETAILS_STAT_REVENUE,
  MON_COMPANY_DETAILS_STAT_PRODUCTS,
  MON_COMPANY_DETAILS_STAT_TOTAL_COST_PRICE,
  MON_COMPANY_DETAILS_STAT_TOTAL_SALES_PRICE,
  MON_COMPANY_DETAILS_DATA_ENTRY,
} from "app/presentationLayer/components/with-permission/constants";
import mainEffector from "app/presentationLayer/effects/main";
import effector from "app/presentationLayer/effects/clients";
import warehouseEffector from "app/presentationLayer/effects/clients/warehouse";
import { getRestStr } from "app/utils/utils";
import "./styles.scss";
import { PriceWrapper } from "app/presentationLayer/components/price-wrapper";
import Payment from "../payment";

const { SubMenu } = Menu;

export default (props) => {
  const { location, match, history, backUrl } = props;

  const companyId = match.params.companyId;

  const $clientDetails = useStore(effector.stores.$clientDetails);
  const $currentUser = useStore(mainEffector.stores.$currentUser);
  const $updateClientDetails = useStore(effector.stores.$updateClientDetails);
  const $clientStat = useStore(effector.stores.$clientStat);
  const { data: details } = $clientDetails;
  const { data: clientStat } = $clientStat;

  const $warehouseStat = useStore(warehouseEffector.stores.$warehouseStat);
  const { data: warehouseStat } = $warehouseStat;

  const openedTabFromUrl = getRestStr(location.pathname, match.url).slice(1);
  const [openedTab, setOpenedTab] = useState(openedTabFromUrl || "/");

  const isAdmin = $currentUser?.data?.authorities?.includes(
    "ROLE_SMARTPOS_ADMIN"
  );
  // const onNavigationClick = (e) => {
  //   console.log(e.key);
  //   setOpenedTab(e.key);
  // };
  useEffect(() => {
    const path = window.location.pathname.split("/").slice(-1)[0];

    console.log(path);
    switch (path) {
      case "incomes":
      case "stock":
      case "stock-by-day":
        setOpenedTab("warehouse/stock");
        break;
      default:
        setOpenedTab(path);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    effector.effects.fetchClientDetails(companyId);
    effector.effects.fetchBranchItems({ companyId });
    effector.effects.fetchClientStatEffect({ companyId, es: true });
    warehouseEffector.effects.fetchWarehouseStatEffect({ companyId });

    return () => {
      effector.events.resetClientCard();
      effector.events.resetCategoryItems();
      warehouseEffector.events.resetSearchProducts();
    };
  }, []);

  useEffect(() => {
    if ($updateClientDetails.success) {
      effector.effects.fetchClientDetails(companyId);
    }
  }, [$updateClientDetails.success]);

  const clientNdsPercent =
    details && details.ndsPercent ? details.ndsPercent : null;

  return (
    <div className="CP">
      <div className="custom-content__header">
        <div className="custom-content__header__left">
          <Button
            onClick={() => history.push(backUrl)}
            type="ghost"
            shape="circle"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
          <div className="custom-content__header__left-inner">
            <h1>{details ? details.name : ""}</h1>
          </div>
        </div>
      </div>
      <WithPermission
        className="CP__stats__item"
        annotation={MON_COMPANY_DETAILS_STAT}
        showChecker={false}
      >
        <div className="CP__stats">
          {clientStat && (
            <>
              {isAdmin && (
                <WithPermission
                  className="CP__stats__item"
                  annotation={MON_COMPANY_DETAILS_STAT_CHEQUES}
                  placement={{ left: 5, top: 0, bottom: 0 }}
                >
                  <div>
                    <div>Кол-во чеков</div>
                    <strong>
                      {clientStat.receiptCount.toLocaleString("ru")}
                    </strong>
                  </div>
                </WithPermission>
              )}
              <WithPermission
                className="CP__stats__item"
                annotation={MON_COMPANY_DETAILS_STAT_BRANCHES}
                placement={{ left: 5, top: 0, bottom: 0 }}
              >
                <div>
                  <div>Кол-во филиалов</div>
                  <strong>{clientStat.branchCount.toLocaleString("ru")}</strong>
                </div>
              </WithPermission>
              {isAdmin && (
                <>
                  <WithPermission
                    className="CP__stats__item"
                    annotation={MON_COMPANY_DETAILS_STAT_KKM}
                    placement={{ left: 5, top: 0, bottom: 0 }}
                  >
                    <div>
                      <div>Кол-во ККМ</div>
                      <strong>
                        {clientStat.terminalCount.toLocaleString("ru")}
                      </strong>
                    </div>
                  </WithPermission>
                  <WithPermission
                    className="CP__stats__item"
                    annotation={MON_COMPANY_DETAILS_STAT_REVENUE}
                    placement={{ left: 5, top: 0, bottom: 0 }}
                  >
                    <div>
                      <div>Выручка</div>
                      <PriceWrapper price={clientStat.revenueCount} />
                    </div>
                  </WithPermission>
                </>
              )}
            </>
          )}
          {warehouseStat && (
            <>
              <WithPermission
                className="CP__stats__item"
                annotation={MON_COMPANY_DETAILS_STAT_PRODUCTS}
                placement={{ left: 5, top: 0, bottom: 0 }}
              >
                <div>
                  <div>Кол-во товаров</div>
                  <strong>
                    {warehouseStat.productCount.toLocaleString("ru")}
                  </strong>
                </div>
              </WithPermission>
              <WithPermission
                className="CP__stats__item"
                annotation={MON_COMPANY_DETAILS_STAT_TOTAL_COST_PRICE}
                placement={{ left: 5, top: 0, bottom: 0 }}
              >
                <div>
                  <div>Общ. себестоимость</div>
                  <PriceWrapper price={warehouseStat.totalCostPrice} />
                </div>
              </WithPermission>
              <WithPermission
                className="CP__stats__item"
                annotation={MON_COMPANY_DETAILS_STAT_TOTAL_SALES_PRICE}
                placement={{ left: 5, top: 0, bottom: 0 }}
              >
                <div>
                  <div>Общ. продажная цена</div>
                  <PriceWrapper price={warehouseStat.totalSalesPrice} />
                </div>
              </WithPermission>
            </>
          )}
        </div>
      </WithPermission>
      <div className="CP__content">
        <div className="CP__navigation">
          <Menu
            //onClick={onNavigationClick}
            selectedKeys={[openedTab]}
            mode="horizontal"
            triggerSubMenuAction="click"
          >
            <Menu.Item key="/">
              <div className="CP__navigation__item-inner">
                <Link to={match.url}>Информация</Link>
              </div>
            </Menu.Item>
            <Menu.Item key="branches">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_BRANCHES}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/branches`}>Филиалы</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="catalog">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_CATALOG}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/catalog`}>Каталог</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="cheques">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_CHEQUES}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/cheques`}>Чеки</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <SubMenu
              key="warehouse/stock"
              title={<div className="CP__navigation__item-inner">Склад</div>}
            >
              <Menu.ItemGroup title="Остатки">
                <Menu.Item key="warehouse/stock">
                  <WithPermission
                    annotation={MON_COMPANY_DETAILS_STOCK}
                    placement={{ right: 0, top: 0, bottom: 0 }}
                  >
                    <div className="CP__navigation__item-inner">
                      <Link to={`${match.url}/warehouse/stock`}>
                        Общие остатки
                      </Link>
                    </div>
                  </WithPermission>
                </Menu.Item>
                <Menu.Item key="warehouse:stock-by-day">
                  <WithPermission
                    annotation={MON_COMPANY_DETAILS_STOCK_BY_DAY}
                    placement={{ right: 0, top: 0, bottom: 0 }}
                  >
                    <div className="CP__navigation__item-inner">
                      <Link to={`${match.url}/warehouse/stock-by-day`}>
                        Остатки по дням
                      </Link>
                    </div>
                  </WithPermission>
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Приход товара">
                <Menu.Item key="warehouse:incomes">
                  <WithPermission
                    annotation={MON_COMPANY_DETAILS_INCOMES}
                    placement={{ right: 0, top: 0, bottom: 0 }}
                  >
                    <div className="CP__navigation__item-inner">
                      <Link to={`${match.url}/warehouse/incomes`}>
                        Приход товара
                      </Link>
                    </div>
                  </WithPermission>
                </Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <Menu.Item key="kkms">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_KKMS}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/kkms`}>ККМ</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="users">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_USERS}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/users`}>Сотрудники</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="logs">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_LOGS}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/logs`}>Логи</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="promotions">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_PROMOTION}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/promotions`}>Акции</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="agreements">
              <WithPermission
                annotation={MON_COMPANY_DETAILS_PROMOTION}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/agreements`}>Услуги</Link>
                </div>
              </WithPermission>
            </Menu.Item>
            {process.env.DEV_SERVER && false && (
              <Menu.Item key="dataEntry">
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_DATA_ENTRY}
                  placement={{ right: -12, top: 0, bottom: 0 }}
                >
                  <div className="CP__navigation__item-inner">
                    <Link to={`${match.url}/dataEntry`}>Ввод данных</Link>
                  </div>
                </WithPermission>
              </Menu.Item>
            )}
            <Menu.Item key="telegram-accounts">
              <WithPermission
                isOperator={
                  !!$currentUser?.data?.authorities.find(
                    (roles) => roles === "ROLE_OPERATOR"
                  )
                }
                annotation={MON_COMPANY_DETAILS_DATA_ENTRY}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/telegram-accounts`}>
                    Телеграм аккаунты
                  </Link>
                </div>
              </WithPermission>
            </Menu.Item>
            <Menu.Item key="payment">
              <WithPermission
                isOperator={
                  !!$currentUser?.data?.authorities.find(
                    (roles) => roles === "ROLE_OPERATOR"
                  )
                }
                annotation={MON_COMPANY_DETAILS_DATA_ENTRY}
                placement={{ right: -12, top: 0, bottom: 0 }}
              >
                <div className="CP__navigation__item-inner">
                  <Link to={`${match.url}/payment`}>Пополнить баланс</Link>
                </div>
              </WithPermission>
            </Menu.Item>
          </Menu>
        </div>

        <div>
          <Switch>
            <Route exact path={match.path} component={ClientInfo} />
            <Route
              exact
              path={[`${match.path}/branches`]}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_BRANCHES}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Branches {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/catalog`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_CATALOG}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <ClientCatalog {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/cheques`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_CHEQUES}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <ClientCheques {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/warehouse/stock`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_STOCK}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <WarehouseStock {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/warehouse/stock-by-day`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_STOCK_BY_DAY}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <WarehouseStockByDay {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/warehouse/incomes`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_INCOMES}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <WarehouseIncomes {...props} />
                </WithPermission>
              )}
            />
            <Route
              path={`${match.path}/warehouse/incomes/add`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_INCOMES_ADD}
                  type={PAGE_TYPE}
                >
                  <AddWarehouseIncome {...{ ...props, clientNdsPercent }} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/kkms`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_KKMS}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Kkms {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/users`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_USERS}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Users {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path={`${match.path}/logs`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_LOGS}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Logs {...props} />
                </WithPermission>
              )}
            />
            <Route
              path={`${match.path}/promotions`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_PROMOTION}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Promotions {...props} />
                </WithPermission>
              )}
            />
            <Route
              path={`${match.path}/agreements`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_PROMOTION}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Agreements {...props} tin={details ? details.inn : null} />
                </WithPermission>
              )}
            />
            <Route
              path={`${match.path}/dataEntry`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_DATA_ENTRY}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <DataEntry {...props} />
                </WithPermission>
              )}
            />
            <Route
              path={`${match.path}/telegram-accounts`}
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY_DETAILS_PROMOTION}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <TelegramAccounts {...props} />
                </WithPermission>
              )}
            />
            {details?.inn && (
              <Route
                path={`${match.path}/payment`}
                render={(props) => (
                  <WithPermission
                    annotation={MON_COMPANY_DETAILS_PROMOTION}
                    type={PAGE_TYPE}
                    showChecker={false}
                  >
                    <Payment {...props} clientTin={details.inn} />
                  </WithPermission>
                )}
              />
            )}
          </Switch>
        </div>
      </div>
    </div>
  );
};
