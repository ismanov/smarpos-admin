import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  MAN_USER_LIST,
} from "app/presentationLayer/components/with-permission/constants";
import { UsersList } from "app/presentationLayer/main/users/users-list";

export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(propsC) => (
          <WithPermission annotation={MAN_USER_LIST} type={PAGE_TYPE}>
            <UsersList {...props} {...propsC} />
          </WithPermission>
        )}
      />
    </Switch>
  );
};
