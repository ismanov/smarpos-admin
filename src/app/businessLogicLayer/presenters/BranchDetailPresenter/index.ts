import { BasePresenter } from "app/coreLayer/presenter";
import { BranchDetailState } from "app/presentationLayer/main/branches/detail";
import Repository from "app/businessLogicLayer/repo";

export default class BranchDetailPresenter extends BasePresenter<
  BranchDetailState
> {
  mount() {
    super.mount();
    let branchId =
      this.router && this.router.props
        ? this.router.props.match.params["branchId"]
        : undefined;
    if (branchId !== undefined) {
      Repository.branch.fetchBranchById(branchId).then(branch => {
        this.updateModel &&
          this.updateModel({
            branch
          });
      });
    }
  }

  backButtonClicked() {
    this.router && this.router.goBack();
  }
}
