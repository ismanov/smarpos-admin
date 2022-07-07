import {BasePresenter} from "app/coreLayer/presenter";
import Repository from "app/businessLogicLayer/repo";
import {PagingFilter} from "app/businessLogicLayer/models/PagingFilter";
import {ExciseState} from "app/presentationLayer/main/excise/list";

// let size = 20;

export class ExcisePresenter extends BasePresenter<ExciseState> {
    state = {
        size: 22,
        search: ''
    };

    mount() {
        super.mount();
        this.fetchExcises({page: 0, size: this.state.size, search: this.state.search});
    }

    fetchExcises(filter: PagingFilter & { search?: string }) {
        this.state = {...this.state, ...filter};
        this.updateModel &&
        this.updateModel({isLoading: true}, () => {
            Repository.excise
                .fetchAllExcises(filter)
                .then(response => {
                    this.updateModel &&
                    this.updateModel({
                        isLoading: false,
                        list: response.content,
                        page: response.number,
                        totalPages: response.totalPages,
                        size: response.size
                    });
                })
                .catch(error => {
                    if (error.response) {
                        this.error(error.toString());
                    }
                });
        });
    }

    openAddEditPage(id?: number) {
        this.router &&
        this.router.redirect(
            `/main/management/excise/addEdit${
                id !== undefined ? `?exciseId=${id}` : ""
                }`
        );
    }
}
