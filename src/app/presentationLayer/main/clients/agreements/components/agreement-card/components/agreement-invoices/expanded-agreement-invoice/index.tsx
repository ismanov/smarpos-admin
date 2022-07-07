import React, { useEffect } from "react";
import { useStore } from "effector-react";
import agreementsEffector from "app/presentationLayer/effects/clients/agreements";
import { Button } from "antd";
import { PrinterSvg } from "assets/svg";
import { printIframe } from "app/utils/print";
import "./styles.scss";


export const ExpandedAgreementInvoice = (props) => {
  const { invoiceId } = props;
  const $generatedInvoicesMap = useStore(agreementsEffector.stores.$generatedInvoicesMap);

  useEffect(() => {
    agreementsEffector.effects.fetchGeneratedInvoice(invoiceId);
  }, []);


  const currentGeneratedInvoice = $generatedInvoicesMap[invoiceId];

  if (!currentGeneratedInvoice) {
    return null;
  }

  const generatedInvoiceLoading = currentGeneratedInvoice.loading;
  const generatedInvoiceData = currentGeneratedInvoice.data;

  return (
    <div className="expanded-agreement-invoice">
      <div className="current-order__document-btns">
        <Button icon={<PrinterSvg />} onClick={() => printIframe('divToPrint')} />
      </div>
      <iframe id="divToPrint" width="100%" height="1000px" srcDoc={generatedInvoiceData} />
      {generatedInvoiceLoading && <div className="abs-loader" />}
    </div>
  );
};
