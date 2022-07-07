import { BasePresenter } from "app/coreLayer/presenter";
import { ExciseAddEditViewState } from "app/presentationLayer/main/excise/addEdit";
import Repository from "app/businessLogicLayer/repo";
import axios, { CancelTokenSource } from "axios";
import { Product } from "app/businessLogicLayer/models/Product";

export class ExciseAddEditPresenter extends BasePresenter<
  ExciseAddEditViewState
> {
  cancelRequestProduct: CancelTokenSource = axios.CancelToken.source();

  state: {
    rateTypeList?: Array<{ title: string; value: number }>;
    product?: Product;
    productList?: Array<Product>;
    amount?: number;
    rateType?: number;
    isEdit?: boolean;
  } = {};

  mount() {
    super.mount();
    this.state.rateTypeList = [
      {
        title: "сум",
        value: 0
      }
    ];

    this.updateModel &&
      this.updateModel({ rateTypeList: this.state.rateTypeList });
    let exciseId;
    if (this.router && this.router.props && this.router.props.location.search) {
      let splitted = this.router.props.location.search.split("=");
      if (splitted.length > 1) {
        exciseId = splitted[1];
      } else {
        this.router && this.router.goBack();
      }
    }
    if (exciseId) {
      this.state.isEdit = true;
      Repository.excise
        .fetchExciseById(exciseId)
        .then(excise => {
          this.state.product = { id: excise.id, name: excise.name };
          this.state.amount = excise.exciseAmount;
          this.state.rateType = 0;

          this.updateModel &&
            this.updateModel({
              productName: this.state.product ? this.state.product.name : "",
              amount: this.state.amount,
              isEdit: true,
              isValid:
                this.state.product &&
                this.state.amount !== undefined &&
                this.state.rateType !== undefined
            });
        })
        .catch(error => {
          this.error(error.toString());
        });
    }
  }

  searchProduct(searchKey?: string) {
    this.cancelRequestProduct.cancel();
    this.cancelRequestProduct = axios.CancelToken.source();
    Repository.product
      .searchProduct({ searchKey }, this.cancelRequestProduct)
      .then(list => {
        this.state.productList = list;
        this.updateModel &&
          this.updateModel({
            productList: list
          });
      })
      .catch(error => {
        if (error.response) {
          this.error(error.toString());
        }
      });
  }

  setAmount(amount: number) {
    this.state.amount = amount;
    this.updateModel &&
      this.updateModel({
        amount,
        isValid:
          this.state.product &&
          this.state.amount !== undefined &&
          this.state.rateType !== undefined
      });
  }

  setRateType(rateType: number) {
    this.state.rateType = rateType;
    this.updateModel &&
      this.updateModel({
        isValid:
          this.state.product &&
          this.state.amount !== undefined &&
          this.state.rateType !== undefined
      });
  }

  selectProduct(productId: number) {
    this.state.product = this.state.productList
      ? this.state.productList.find(pr => pr.id === productId)
      : undefined;
    this.updateModel &&
      this.updateModel({
        productName: this.state.product ? this.state.product.name : "",
        isValid:
          this.state.product &&
          this.state.amount !== undefined &&
          this.state.rateType !== undefined
      });
  }

  backButtonClicked() {
    this.router && this.router.goBack();
  }

  createExcise() {
    if (!this.state.isEdit) {
      Repository.excise
        .createExcise({
          id: this.state.product ? this.state.product.id : undefined,
          exciseAmount: this.state.amount,
          name: this.state.product ? this.state.product.name : ""
        })
        .then(response => {
          this.success("Успешно сохранен!");
          setTimeout(() => {
            this.router && this.router.goBack();
          }, 2000);
        })
        .catch(error => {
          this.error(error.toString());
        });
    } else {
      Repository.excise
        .updateExcise({
          id: this.state.product ? this.state.product.id : -1,
          exciseAmount: this.state.amount,
          name: this.state.product ? this.state.product.name : ""
        })
        .then(response => {
          this.success("Успешно сохранен!");
          setTimeout(() => {
            this.router && this.router.goBack();
          }, 1000);
        })
        .catch(error => {
          this.error(error.toString());
        });
    }
  }
}
