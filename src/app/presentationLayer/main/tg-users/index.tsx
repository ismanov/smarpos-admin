import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  MON_TG_USERS_LIST
} from "app/presentationLayer/components/with-permission/constants";
import { TgUsersList } from "app/presentationLayer/main/tg-users/tg-users-list";


export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <WithPermission annotation={MON_TG_USERS_LIST} type={PAGE_TYPE}>
          <TgUsersList {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
