import {Product, ProductPrice, updateProduct} from "../models/product.model";
import {IProduct} from "../database/schemas/product.schema";

export interface IProductRepository{
    create(input:Product):Promise<IProduct>
    update(input:{id:string, product:updateProduct}):Promise<IProduct>
    delete(id:string):Promise<IProduct>
    setPreferred(input:{productId:string, variantId:string}):Promise<IProduct>
    changeActive(input:{id:string, newValue:boolean}):Promise<IProduct>
    getAdminProducts():Promise<IProduct[]>

    getMany(input:{
        colors:string[],
        brands:string[],
        collections:string[],
        gender:string[],
        category:string[],
        sizes:string[]
        priceMore:number,
        priceLess:number,
        productFeatureValues:string[],
        sortBy:string,
        sortType:string,
        page:number,
        limit:number
    }):Promise<IProduct[]>

    getOneById(id:string):Promise<IProduct>

    getProductPrice(products:string[]):Promise<ProductPrice[]>
}