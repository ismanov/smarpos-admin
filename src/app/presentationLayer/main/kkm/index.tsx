import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  MON_KKM_LIST
} from "app/presentationLayer/components/with-permission/constants";
import { KkmList } from "app/presentationLayer/main/kkm/kkm-list";


export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <WithPermission annotation={MON_KKM_LIST} type={PAGE_TYPE}>
          <KkmList {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
