import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  MON_EMPLOYEE_LIST
} from "app/presentationLayer/components/with-permission/constants";
import { StaffList } from "app/presentationLayer/main/staff/staff-list";


export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <WithPermission annotation={MON_EMPLOYEE_LIST} type={PAGE_TYPE}>
          <StaffList {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
