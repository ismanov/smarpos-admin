import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { Button, Spin } from "antd";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { PrinterSvg } from "../../../../../../../../../assets/svg";
import { printIframe } from "app/utils/print";

export const PublicOffer = (props) => {
  const { tin } = props;

  const $customerPublicOffer = useStore(
    agreementsEffector.stores.$customerPublicOffer
  );
  const {
    data: customerPublicOffer,
    loading: customerPublicOfferLoading,
  } = $customerPublicOffer;

  useEffect(() => {
    agreementsEffector.effects.fetchCustomerPublicOffer(tin);
  }, []);

  const onPrintDocumentClick = (id: string) => {
    printIframe(id);
  };

  return (
    <div className="current-order">
      <div className="current-order__document">
        <div className="current-order__document-btns">
          <Button
            icon={<PrinterSvg />}
            onClick={() => onPrintDocumentClick("divToPrint")}
          />
        </div>
        {customerPublicOffer && (
          <iframe
            id="divToPrint"
            width="100%"
            height="1000px"
            srcDoc={customerPublicOffer.publicOfferContent}
          />
        )}
        {customerPublicOfferLoading && (
          <div className="abs-loader">
            <Spin />
          </div>
        )}
      </div>
    </div>
  );
};
