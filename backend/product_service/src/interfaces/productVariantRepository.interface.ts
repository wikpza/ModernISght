import {ProductVariant} from "../models/productVariant.model";
import {ProductVariantService} from "../services/productVariant.service";
import {IProduct, IProductVariant} from "../database/schemas/product.schema";

export interface IProductVariantRepository{
    add(input:{productId:string, productVariant:ProductVariant, files:Express.Multer.File[]}):Promise<IProduct>
    update(input:{productId:string, variantId:string, productVariant:ProductVariant, files:Express.Multer.File[]}):Promise<IProduct>

    deletePictures(input:{productId:string, variantId:string,images:string[]}):Promise<IProduct>

    changeAvailable(input:{productId:string, variantId:string, newValue:boolean}):Promise<IProduct>
    changeActive(input:{productId:string, variantId:string, newValue:boolean}):Promise<IProduct>
    delete(input:{productId:string, variantId:string}):Promise<IProduct>
    get(input:{productId:string, variantId:string}):Promise<IProduct>
}