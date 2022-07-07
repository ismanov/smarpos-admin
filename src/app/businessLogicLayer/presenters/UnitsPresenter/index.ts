import { BasePresenter } from "app/coreLayer/presenter";
import { UnitsState } from "app/presentationLayer/main/units";
import Repository from "app/businessLogicLayer/repo";
import { Unit } from "app/businessLogicLayer/models/Unit";

export default class UnitPresenter extends BasePresenter<UnitsState> {
  mount() {
    this.updateList();
  }

  updateList() {
    this.updateModel && this.updateModel({ isLoading: true });
    Repository.units
      .fetchUnits({ page: 0, size: 1000000 })
      .then(response => {
        this.updateModel &&
          this.updateModel({
            list: response.content,
            isLoading: false,
            totalItems: response.totalElements
          });
      })
      .catch(error => {
        this.error(error.toString());
        this.updateModel && this.updateModel({ isLoading: false });
      });
  }

  updateUnit(unit: Unit) {
    this.updateModel && this.updateModel({ isLoading: true });
    Repository.units
      .updateUnit(unit)
      .then(_ => {
        this.updateList();
      })
      .catch(error => {
        this.error(error.toString());
        this.updateModel && this.updateModel({ isLoading: false });
      });
  }
}
