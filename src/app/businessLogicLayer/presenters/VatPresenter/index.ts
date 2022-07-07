import { BasePresenter } from "app/coreLayer/presenter";
import { VatState } from "app/presentationLayer/main/vat";
import { Vat } from "app/businessLogicLayer/models/Vat";
import Repository from "app/businessLogicLayer/repo";

export default class VatPresenter extends BasePresenter<VatState> {
  mount() {
    this.updateList();
  }

  updateList() {
    this.updateModel && this.updateModel({ isLoading: true });
    Repository.vat
      .fetchVats()
      .then(list => {
        this.updateModel && this.updateModel({ list, isLoading: false });
      })
      .catch(error => {
        this.error(error.toString());
        this.updateModel && this.updateModel({ isLoading: false });
      });
  }

  createVat(vat: Vat, onCreated?: () => void) {
    this.updateModel && this.updateModel({ isLoading: true });
    Repository.vat
      .createVat(vat)
      .then(_ => {
        this.success("Сохранен успешно!");
        this.updateList();
        onCreated && onCreated();
      })
      .catch(error => {
        this.error(error.toString());
      });
  }

  updateVat(vat: Vat, onUpdated?: () => void) {
    this.updateModel && this.updateModel({ isLoading: true });
    Repository.vat
      .updateVat(vat)
      .then(_ => {
        this.success("Изменен успешно!");
        onUpdated && onUpdated();
        this.updateList();
      })
      .catch(error => {
        this.error(error.toString());
      });
  }

  deleteVat(id: number, onDeleted?: () => void) {
    this.updateModel && this.updateModel({ isLoading: true });
    Repository.vat
      .deleteVat(id)
      .then(_ => {
        onDeleted && onDeleted();
        this.success("Удален успешно!");
        this.updateList();
      })
      .catch(error => {
        this.error(error.toString());
      });
  }
}
