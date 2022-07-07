import React from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  PAGE_TYPE,
  MON_BRANCH_LIST,
  // MON_BRANCH_DETAILS
} from "app/presentationLayer/components/with-permission/constants";
import { BranchesList } from "app/presentationLayer/main/branches/branches-list";
// import BranchDetail from "app/presentationLayer/main/branches/detail";


export default (props) => {
  const { match } = props;

  return (
    <Switch>
      {/*<Route*/}
      {/*  path={`${match.path}/details/:branchId`}*/}
      {/*  render={(props) => <WithPermission annotation={MON_BRANCH_DETAILS} type={PAGE_TYPE}>*/}
      {/*    <BranchDetail {...props} />*/}
      {/*  </WithPermission>}*/}
      {/*/>*/}
      <Route
        path={match.path}
        render={(props) => <WithPermission annotation={MON_BRANCH_LIST} type={PAGE_TYPE}>
          <BranchesList {...props} />
        </WithPermission>}
      />
    </Switch>
  );
};
