import { SingleCatalogState } from "app/presentationLayer/main/single";
import {BasePresenter} from "app/coreLayer/presenter";
import Repository from 'app/businessLogicLayer/repo';
import FileDownload from "js-file-download";

export class SingleCatalogPresenter extends BasePresenter<SingleCatalogState>{

    mount() {
        super.mount();
        this.updateList()
    }

    updateList() {
        this.updateModel && this.updateModel({ isLoading: true });
        Repository
            .single
            .fetchSingleCatalog()
            .then(catalog => {
                console.log('catalog', catalog);
                this.updateModel && this.updateModel({
                    categories: catalog,
                    isLoading: false
                })
            })
            .catch(error => {
                this.updateModel && this.updateModel({ isLoading: true });
            })
    }

    selectCatalog(categoryId: number) {
        this.updateModel && this.updateModel({
            isProductsLoading: true
        });
        Repository
            .product
            .fetchProductsForCategoryId({categoryId: categoryId})
            .then(products => {
                this.updateModel && this.updateModel({
                    isProductsLoading: false,
                    products: products
                })
            })
            .catch(error => {
                this.error(error.toString());
                this.updateModel && this.updateModel({
                    isProductsLoading: false
                })
            })

    }

    downloadTemplate(id?: number) {
        Repository
            .product
            .downloadTemplate({categoryId: id})
            .then(blob => {
                FileDownload(blob, "Шаблон.xlsx");
            })
    }

    uploadTemplate(file?: File, selectedCategoryId?: number, categoryId?: number) {
        Repository
            .product
            .uploadTemplate(file!, {categoryId: selectedCategoryId})            
            .then((response) => {
                if (response.status === 204) {
                    this.success("Успешно загружен! Процесс может занять несколко секунд");
                    this.updateList();                    
                } else if (response.status === 200) {
                    this.error("Импортировать список продуктов не удалось! Так как файл содержить некорректный формат данных!");                    
                    FileDownload(response.data, 'product_list_import_error.xlsx');
                }
                if (categoryId !== undefined) {
                    this.selectCatalog(categoryId || 0);
                }
            })
            .catch(error => {
                this.error(error.toString())
            })
    }
}
