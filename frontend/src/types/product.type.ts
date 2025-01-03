import {Brand, Category, Collection, Gender, ProductVariant} from "../types.ts";

export type CreateProduct =
    {
        category:{
            name:string,
            _id:string,
        },
        brand:{
            name:string,
            _id:string,
        },
        collection:{
            name:string,
            _id:string,
        },
        gender:{
            name:string,
            _id:string,
        },
        name:string,
        active:boolean
        features: {key:string, value:string}[],
    }

export type UpdateProduct = {
    brand:{
        name:string,
        _id:string,
    },
    collection:{
        name:string,
        _id:string,
    },
    name:string,
    active:boolean
    features: {key:string, value:string}[],
}
export type DiscountInfo = {
    name: string;
    description: string;
    percent: number;
    active: boolean;
    beginAt: Date;
    finishAt: Date;
}

export type Product = {
    _id:string,
    collectionId:Collection,
    rating:number,
    name:string,
    active:boolean,
    genderId:Gender,
    brandId:Brand,
    categoryId:Category,
    features:Record<string, string>
    productVariant:ProductVariant[]

}

type Item = {
    name:string,
    _id:string
}
export type GetProductUser = {
    _id:string,
    collection:Item,
    rating:number,
    name:string,
    active:boolean,
    gender:Item,
    brand:Item,
    category:Item,
    features:Record<string, string>
    productVariant:GetProductVariant[]

}

export type GetProductVariant = {
    colors: {
        name:string,
        _id:string,
        hexCode:string
    },
    sku:string,
    images:string[],
    price:number,
    available:boolean,
    active:boolean,
    _id:string
    discountInfo?: DiscountInfo;
}


export type GetProductVariantElement = {
    colorId: {
        name:string,
        _id:string,
        hexCode:string
    },
    sku:string,
    images:string[],
    price:number,
    available:boolean,
    active:boolean,
    _id:string
    discountInfo?:DiscountInfo
}


export type GetProductElement = {
    _id:string,
    collectionId:Collection,
    rating:number,
    name:string,
    active:boolean,
    genderId:Gender,
    brandId:Brand,
    categoryId:Category,
    features?:Record<string, string>
    productVariant:GetProductVariantElement[]
}