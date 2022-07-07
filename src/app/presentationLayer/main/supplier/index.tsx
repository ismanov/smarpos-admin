import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  SUP_COMPANY_LIST,
  SUP_COMPANY_DETAILS
} from "app/presentationLayer/components/with-permission/constants";

import { SupplierList } from "app/presentationLayer/main/supplier/supplier-list";
import { SupplierDetails } from "app/presentationLayer/main/supplier/details"

export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <WithPermission annotation={SUP_COMPANY_LIST} type={PAGE_TYPE}>
          <SupplierList {...props} />
        </WithPermission>}
      />
      <Route
        path={`${match.path}/:supplierId`}
        render={(props) => <WithPermission annotation={SUP_COMPANY_DETAILS} type={PAGE_TYPE} placement={{ right: 0, top: 3 }}>
          <SupplierDetails {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
