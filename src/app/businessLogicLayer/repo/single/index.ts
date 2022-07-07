import instance from "app/businessLogicLayer/config/api";
import {Category} from "app/businessLogicLayer/models/Category";

interface SingleRepo {
    fetchSingleCatalog(): Promise<Array<Category>>
}

export default class SingleRepoImpl implements SingleRepo {
    fetchSingleCatalog(): Promise<Array<Category>> {
        return instance.httpGet<Array<Category>>('/api/admin/categories');
    }
}


