import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  MON_COMPANY_DETAILS_PROMOTION_LIST,
  PAGE_TYPE
} from "app/presentationLayer/components/with-permission/constants";
import { TelegramAccountsList } from "app/presentationLayer/main/clients/telegram-accounts/telegram-accounts-list";

export const TelegramAccounts = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={match.path}
        exact
        render={(props) => <WithPermission
          annotation={MON_COMPANY_DETAILS_PROMOTION_LIST}
          type={PAGE_TYPE}
        >
          <TelegramAccountsList {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
