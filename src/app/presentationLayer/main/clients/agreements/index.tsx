import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  MON_COMPANY_DETAILS_PROMOTION_ADD,
  MON_COMPANY_DETAILS_PROMOTION_LIST,
  PAGE_TYPE
} from "app/presentationLayer/components/with-permission/constants";
import { AgreementsList } from "./components/agreements-list";
import { AddAgreement } from "./components/add-agreement";
import { AgreementCard } from "./components/agreement-card";


export const Agreements = (props) => {
  const { tin, match } = props;

  if (!tin) {
    return null;
  }

  const backUrl = match.url;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <WithPermission
          annotation={MON_COMPANY_DETAILS_PROMOTION_LIST}
          type={PAGE_TYPE}
        >
          <AgreementsList {...props} tin={tin} />
        </WithPermission>}
      />
      <Route
        exact
        path={`${match.path}/add`}
        render={(props) => <WithPermission
          annotation={MON_COMPANY_DETAILS_PROMOTION_ADD}
          type={PAGE_TYPE}
        >
          <AddAgreement {...props} tin={tin} backUrl={backUrl} />
        </WithPermission>}
      />
      <Route
        path={`${match.path}/:agreementId`}
        render={(props) => <WithPermission
          annotation={MON_COMPANY_DETAILS_PROMOTION_ADD}
          type={PAGE_TYPE}
        >
          <AgreementCard {...props} tin={tin} backUrl={backUrl} />
        </WithPermission>}
      />
    </Switch>
  );
};
