import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Layout, Button, Spin } from "antd";
import { Navigation } from "app/presentationLayer/components/navigation";
import { Route, Switch } from "react-router-dom";
import Dashboard from "app/presentationLayer/main/dashboard";
import NotFound from "app/presentationLayer/error/notFound";
import Sales from "./sales";
import Clients from "app/presentationLayer/main/clients";
import Branches from "app/presentationLayer/main/branches";
import { Cheques } from "app/presentationLayer/main/cheques";
import { Redirect } from "react-router-dom";
import Users from "app/presentationLayer/main/users";
import Excise from "app/presentationLayer/main/excise/list";
import ExciseAddEdit from "app/presentationLayer/main/excise/addEdit";
import Vat from "app/presentationLayer/main/vat";
import KKM from "app/presentationLayer/main/kkm";
import Suppliers from "app/presentationLayer/main/supplier";
import Units from "app/presentationLayer/main/units";
import { PermissionEndpoints } from "app/presentationLayer/main/permissions/endpoints";
import Single from "app/presentationLayer/main/single";
import ChequesByBranch from "app/presentationLayer/main/chequesByBranch";
import ChequesByCompanies from "app/presentationLayer/main/chequesByCompanies";

import Logs from "app/presentationLayer/main/logs";
import Staff from "app/presentationLayer/main/staff";
import TgUsers from "app/presentationLayer/main/tg-users";
import effector from "app/presentationLayer/effects/main";

import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  MAIN_MENU,
  STA_CHEQUE_LIST,
  STA_CHEQUE_BY_BRANCH_LIST,
  STA_CHEQUE_BY_COMPANY,
  MON_BRANCH,
  MON_EMPLOYEE,
  MON_KKM_LIST,
  MON_LOG_LIST,
  MON_TG_USERS,
  MON_PRODUCT_LIST,
  SUP_COMPANY_LIST,
  MAN_EXCISE_LIST,
  MAN_EXCISE_ADD,
  MAN_EXCISE_EDIT,
  MAN_VAT_LIST,
  MAN_SINGLE_CAT,
  MAN_USER,
  MON_COMPANY,
  MAN_UNIT_LIST,
} from "app/presentationLayer/components/with-permission/constants";
import { PermissionsModePopup } from "app/presentationLayer/components/with-permission/permission-mode";
import Products from "app/presentationLayer/main/products";
import "./styles.scss";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDropdown } from "app/presentationLayer/components/user-dropdown";
import { LogoSvg } from "../../../assets/svg";
import AllAgreements from "./allAgreements";

const { Header, Content, Sider } = Layout;

const { NODE_ENV } = process.env;

export default () => {
  const $currentUser = useStore(effector.stores.$currentUser);

  const { data: currentUser } = $currentUser;

  const [siderCollapse, setSiderCollapse] = useState(
    localStorage.getItem("siderCollapsed") === "1"
  );

  useEffect(() => {
    effector.effects.getCurrentUserEffect({});
  }, []);

  const onSiderCollapse = () => {
    const value = !siderCollapse;
    setSiderCollapse(value);

    localStorage.setItem("siderCollapsed", value ? "1" : "0");
  };

  if (!currentUser) {
    return (
      <div className="abs-loader">
        <Spin size="large" />
      </div>
    );
  }

  console.log("NODE_ENV", NODE_ENV);

  return (
    <Layout className="site-layout">
      <Header className="site-layout__header">
        <PermissionsModePopup />
        <div className="site-layout__header__left">
          <div className="site-layout__header__burger">
            <Button
              type="text"
              icon={<FontAwesomeIcon className="svg" icon={faBars} />}
              onClick={onSiderCollapse}
            />
          </div>
          <div className="site-layout__logo">
            <LogoSvg />
          </div>
        </div>
        <div className="site-layout__header__right">
          <UserDropdown />
        </div>
      </Header>
      <Layout className="site-layout__middle">
        <Sider
          className="site-layout__left u-fancy-scrollbar"
          theme="light"
          breakpoint="lg"
          trigger={null}
          collapsible
          collapsed={siderCollapse}
          width={260}
        >
          <Navigation collapsed={siderCollapse} />
        </Sider>
        <Content className="site-layout__content u-fancy-scrollbar">
          <Switch>
            <Route
              exact
              path="/main"
              render={() => {
                return <Redirect to="/main/dashboard" />;
              }}
            />
            <Route
              path="/main/dashboard"
              render={(props) => (
                <WithPermission annotation={MAIN_MENU} type={PAGE_TYPE}>
                  <Dashboard {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/analytics/cheques"
              render={(props) => (
                <WithPermission annotation={STA_CHEQUE_LIST} type={PAGE_TYPE}>
                  <Cheques {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/analytics/chequesByBranch"
              render={(props) => (
                <WithPermission
                  annotation={STA_CHEQUE_BY_BRANCH_LIST}
                  type={PAGE_TYPE}
                >
                  <ChequesByBranch {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/analytics/cheques-by-companies"
              render={(props) => (
                <WithPermission
                  annotation={STA_CHEQUE_BY_COMPANY}
                  type={PAGE_TYPE}
                >
                  <ChequesByCompanies {...props} />
                </WithPermission>
              )}
            />
            <Route path="/main/analytics/sales" component={Sales} />
            <Route
              path="/main/monitoring/companies"
              render={(props) => (
                <WithPermission
                  annotation={MON_COMPANY}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Clients {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/monitoring/branches"
              render={(props) => (
                <WithPermission
                  annotation={MON_BRANCH}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Branches {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path="/main/monitoring/staff"
              render={(props) => (
                <WithPermission
                  annotation={MON_EMPLOYEE}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Staff {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/monitoring/kkm"
              render={(props) => (
                <WithPermission annotation={MON_KKM_LIST} type={PAGE_TYPE}>
                  <KKM {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/monitoring/logs"
              render={(props) => (
                <WithPermission annotation={MON_LOG_LIST} type={PAGE_TYPE}>
                  <Logs {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path="/main/monitoring/agreements"
              render={(props) => (
                <WithPermission annotation={MON_COMPANY} type={PAGE_TYPE}>
                  <AllAgreements />
                </WithPermission>
              )}
            />
            <Route
              exact
              path="/main/monitoring/telegram-users"
              render={(props) => (
                <WithPermission
                  annotation={MON_TG_USERS}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <TgUsers {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/monitoring/products"
              render={(props) => (
                <WithPermission annotation={MON_PRODUCT_LIST} type={PAGE_TYPE}>
                  <Products {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/suppliers/companies"
              render={(props) => (
                <WithPermission annotation={SUP_COMPANY_LIST} type={PAGE_TYPE}>
                  <Suppliers {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path="/main/management/users"
              render={(props) => (
                <WithPermission
                  annotation={MAN_USER}
                  type={PAGE_TYPE}
                  showChecker={false}
                >
                  <Users {...props} />
                </WithPermission>
              )}
            />
            <Route
              exact
              path="/main/management/excise"
              render={(props) => (
                <WithPermission annotation={MAN_EXCISE_LIST} type={PAGE_TYPE}>
                  <Excise {...props} />
                </WithPermission>
              )}
            />
            {currentUser &&
              (currentUser.superAdmin ||
                currentUser.permissions[MAN_EXCISE_ADD] ||
                currentUser.permissions[MAN_EXCISE_EDIT]) && (
                <Route
                  path="/main/management/excise/addEdit"
                  component={ExciseAddEdit}
                />
              )}
            <Route
              path="/main/management/vat"
              render={(props) => (
                <WithPermission annotation={MAN_VAT_LIST} type={PAGE_TYPE}>
                  <Vat {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/units"
              render={(props) => (
                <WithPermission annotation={MAN_UNIT_LIST} type={PAGE_TYPE}>
                  <Units {...props} />
                </WithPermission>
              )}
            />
            <Route
              path="/main/single"
              render={(props) => (
                <WithPermission annotation={MAN_SINGLE_CAT} type={PAGE_TYPE}>
                  <Single {...props} />
                </WithPermission>
              )}
            />
            {/* <Route
              path="/main/single"
              render={(props) => (
                <WithPermission annotation={MAN_SINGLE_CAT} type={PAGE_TYPE}>
                  <Single {...props} />
                </WithPermission>
              )}
            /> */}
            <Route
              path="/main/permissions/endpoints"
              component={PermissionEndpoints}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};
