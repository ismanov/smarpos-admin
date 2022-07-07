import instance from "app/businessLogicLayer/config/api";


export default class PaymentRepo {

  createTransaction(data:any): Promise<any> {
    return instance.httpPost<any>("/api/apay/create-transaction ", data);
  }
  confirmTransaction(data:any): Promise<any> {
    return instance.httpPost<any>("/api/apay/confirm-transaction", data);
  }

}
