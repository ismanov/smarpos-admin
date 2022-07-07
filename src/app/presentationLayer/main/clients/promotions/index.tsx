import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { WithPermission } from "app/presentationLayer/components/with-permission";
import {
  MON_COMPANY_DETAILS_PROMOTION_ADD,
  MON_COMPANY_DETAILS_PROMOTION_DETAILS,
  MON_COMPANY_DETAILS_PROMOTION_LIST,
  PAGE_TYPE,
} from "app/presentationLayer/components/with-permission/constants";
import { PromotionsList } from "app/presentationLayer/main/clients/promotions/promotions-list";
import { AddPromotion } from "app/presentationLayer/main/clients/promotions/add-promotion";
import { UpdatePromotion } from "app/presentationLayer/main/clients/promotions/update-promotion";

export const Promotions = (props) => {
  const { match } = props;
  const agrId = props.location?.state?.agreementId;
  const [agreementId, setAgreementId] = useState();
  useEffect(() => {
    console.log(agrId, ">>>>>>>>agrId");

    !!agrId && setAgreementId(agrId);
  }, [agrId]);

  return (
    <Switch>
      <Route
        path={match.path}
        exact
        render={(props) => (
          <WithPermission
            annotation={MON_COMPANY_DETAILS_PROMOTION_LIST}
            type={PAGE_TYPE}
          >
            <PromotionsList {...props} />
          </WithPermission>
        )}
      />
      <Route
        path={`${match.path}/add`}
        exact
        render={(props) => (
          <WithPermission
            annotation={MON_COMPANY_DETAILS_PROMOTION_ADD}
            type={PAGE_TYPE}
          >
            <AddPromotion {...props} agreementId={agreementId} />
          </WithPermission>
        )}
      />
      <Route
        path={`${match.path}/:promotionId`}
        exact
        render={(props) => (
          <WithPermission
            annotation={MON_COMPANY_DETAILS_PROMOTION_DETAILS}
            type={PAGE_TYPE}
          >
            <UpdatePromotion agreementId={agreementId} {...props} />
          </WithPermission>
        )}
      />
    </Switch>
  );
};
