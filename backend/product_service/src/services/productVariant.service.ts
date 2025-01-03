import {IProductVariantRepository} from "../interfaces/productVariantRepository.interface";
import {ProductVariant} from "../models/productVariant.model";
import {IProduct} from "../database/schemas/product.schema";


export class ProductVariantService{
    private _repository:IProductVariantRepository

    constructor(repository:IProductVariantRepository) {
        this._repository = repository
    }

    async addProductVariant(input: { productId: string; productVariant: ProductVariant, files:Express.Multer.File[] }):Promise<any>{
        const data = await this._repository.add(input)
        if(!data._id){
            throw new Error('unable to create brand')
        }
        return data
    }

    async changeAvailable(input:{productId:string, variantId:string, newValue:boolean}):Promise<any>{
        const data = await this._repository.changeAvailable(input)
        if(!data._id){
            throw new Error('unable to update')
        }
        return data;
    }

    async changeActive(input:{productId:string, variantId:string, newValue:boolean}):Promise<any>{
        const data = await this._repository.changeActive(input)
        if(!data._id){
            throw new Error('unable to update')
        }
        return data;
    }

    async deleteProductVariant(input:{productId:string, variantId:string}):Promise<any>{
        const data = await this._repository.delete(input)
        if(!data._id){
            throw new Error('unable to update')
        }
        return data;
    }

    async getProductVariant(input:{productId:string, variantId:string}):Promise<any>{
        const data = await this._repository.get(input)
        if(!data._id){
            throw new Error('unable to get')
        }
        return data;
    }

    async update(input:{productId:string, variantId:string, productVariant:ProductVariant,files:Express.Multer.File[]}):Promise<IProduct>{
        return await this._repository.update(input)
    }

    async deletePictures(input:{productId:string, variantId:string,images:string[]}):Promise<IProduct>{
        return await this._repository.deletePictures(input)
    }
}