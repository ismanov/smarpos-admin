import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  MON_COMPANY_LIST,
  MON_COMPANY_DETAILS,
  PAGE_TYPE,
} from "app/presentationLayer/components/with-permission/constants";
import { ClientsList } from "app/presentationLayer/main/clients/list";
import ClientDetails from "app/presentationLayer/main/clients/details";
import Confirm from "./checkUser/ConfirmModal";

export default (props) => {
  const { match } = props;

  const backUrl = match.url;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => (
          <WithPermission annotation={MON_COMPANY_LIST} type={PAGE_TYPE}>
            <ClientsList {...props} />
          </WithPermission>
        )}
      />
      <Route
        exact
        path={match.path + "/confirmation"}
        render={() => <Confirm />}
      />
      <Route
        path={`${match.path}/details/:companyId`}
        render={(props) => {
          return (
            <WithPermission
              annotation={MON_COMPANY_DETAILS}
              type={PAGE_TYPE}
              placement={{ right: 0, top: 3 }}
            >
              <ClientDetails {...props} backUrl={backUrl} />
            </WithPermission>
          );
        }}
      />
    </Switch>
  );
};
