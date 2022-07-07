import { BasePresenter } from "app/coreLayer/presenter";
import { Branch } from "app/businessLogicLayer/models/Branch";
import Repository from "app/businessLogicLayer/repo";

export type BranchesType = {
    branches: Array<Branch>
};
export  default class BranchDetailPresenter extends BasePresenter<BranchesType>
{
    mount() {
        super.mount();
            Repository.branch.fetchBranches({}).then(response => {

                this.updateModel &&
                this.updateModel({
                    branches: response.content
                });
            });

    }
}
