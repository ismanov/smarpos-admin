import React from "react";
import { Route, Switch } from "react-router-dom";

import { SupplierDetailsOrdersList } from "./supplier-details-orders-list";
import { SupplierDetailsOrdersPage } from "./supplier-details-orders-page";
import Card from "app/presentationLayer/components/card";

export const SupplierDetailsOrders = (props) => {
  const { match } = props;

  return (
    <Card>
      <div className="CP__cabinet">
        <Switch>
          <Route
            exact
            path={match.path}
            component={SupplierDetailsOrdersList}
          />
          <Route
            path={`${match.path}/:orderId`}
            component={SupplierDetailsOrdersPage}
          />
        </Switch>
      </div>
    </Card>
  )
};