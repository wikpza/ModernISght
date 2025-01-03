import {IProductRepository} from "../interfaces/productRepository.interface";
import {IProduct} from "../database/schemas/product.schema";
import { Product, ProductPrice, updateProduct} from "../models/product.model";

class GetProducts{
    constructor(
        public  readonly colors: string[],
        public  readonly brands: string[],
        public  readonly collections: string[],
        public  readonly gender: string[],
        public  readonly category: string[],
        public  readonly priceMore: number,
        public  readonly priceLess: number,
        public  readonly sortBy: string,
        public  readonly sortType: string,
    ) {
    }
}

export class ProductService {
    private  _repository: IProductRepository

    constructor(repository:IProductRepository) {
        this._repository = repository
    }


    async changeActive(input: { id: string; newValue: boolean}): Promise<IProduct>{
        const data = await this._repository.changeActive(input)
        if(!data.id){
            throw new Error('unable to update product')
        }
        return data
    }
    async createProduct(input: Product): Promise<IProduct>{
        const data = await this._repository.create(input)
        if(!data.id){
            throw new Error('unable to create product')
        }
        return data
    }
    async deleteProduct(id:string):Promise<IProduct>{
        return await this._repository.delete(id)
    }
    async updateProduct(input: { id: string; product: updateProduct }): Promise<IProduct> {
        const data = await this._repository.update(input)
        if(!data.id){
            throw new Error('unable to update product')
        }
        return data;
    }

    async getAdminProducts():Promise<IProduct[]>{
        return await this._repository.getAdminProducts()
    }
    async setPreferred(input: { variantId: string; productId: string }): Promise<IProduct> {
       return await this._repository.setPreferred(input);
    }

    async getProductPrice(products:string[]):Promise<ProductPrice[]>{
        return await this._repository.getProductPrice(products)
    }

    async  getOneById(id:string):Promise<IProduct>{
        return await this._repository.getOneById(id)
    }
}