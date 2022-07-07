import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  STA_CHEQUE_BY_COMPANY_LIST,
  PAGE_TYPE
} from "app/presentationLayer/components/with-permission/constants";
import { ChequesByCompaniesList } from "app/presentationLayer/main/chequesByCompanies/components/list";
import { CompanyStatistics } from "app/presentationLayer/main/chequesByCompanies/components/company-statistics";
import { BranchesStatistics } from "app/presentationLayer/main/chequesByCompanies/components/branches-statistics";


export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <WithPermission annotation={STA_CHEQUE_BY_COMPANY_LIST} type={PAGE_TYPE}>
          <ChequesByCompaniesList {...props} />
        </WithPermission>}
      />
      <Route
        path={`${match.path}/statistics/:companyId`}
        render={(props) => <WithPermission annotation={STA_CHEQUE_BY_COMPANY_LIST} type={PAGE_TYPE} placement={{ right: 0, top: 3 }}>
          <CompanyStatistics {...props} />
        </WithPermission>}
      />
      <Route
        path={`${match.path}/statistics-by-branches/:companyId`}
        render={(props) => <WithPermission annotation={STA_CHEQUE_BY_COMPANY_LIST} type={PAGE_TYPE} placement={{ right: 0, top: 3 }}>
          <BranchesStatistics {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
