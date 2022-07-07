import instance from "app/businessLogicLayer/config/api";
import { Vat } from "app//businessLogicLayer/models/Vat";

interface VatRepo {
  fetchVats(): Promise<Array<Vat>>;
  createVat(vat: Vat): Promise<Vat>;
  updateVat(vat: Vat): Promise<Vat>;
  deleteVat(id: number): Promise<Vat>;
}

export default class VatRepoImpl implements VatRepo {
  fetchVats(): Promise<Array<Vat>> {
    return instance.httpGet<Array<Vat>>("/api/admin/vat");
  }
  createVat(vat: Vat): Promise<Vat> {
    return instance.httpPost<Vat>("/api/admin/vat", vat);
  }
  updateVat(vat: Vat): Promise<Vat> {
    return instance.httpPut<Vat>("/api/admin/vat", vat);
  }
  deleteVat(id: number): Promise<Vat> {
    return instance.httpDelete(`/api/admin/vat/${id}`);
  }
}
