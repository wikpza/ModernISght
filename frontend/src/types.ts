import {DiscountInfo} from "./types/product.type.ts";

export type Brand = {
    name:string,
    _id:string,
}
export type Gender = Brand
export type Category = Brand
export type Collection = Brand
export type Color = {
    _id:string,
    name:string,
    hexCode:string
}

export type Address = {
    _id:string,
    firstName:string,
    lastName:string,
    addressLine1:string,
    addressLine2:string,
    city:string,
    state:string,
    zipCode:string,
    phoneNumber:string,
    preferred:boolean
}

export type UpdateAddress = {
    firstName:string,
    lastName:string,
    addressLine1:string,
    addressLine2:string,
    city:string,
    state:string,
    zipCode:string,
    phoneNumber:string,
    preferred:boolean
}







export type ProductVariant = {
    colorId: string,
    sku:string,
    images:string[],
    price:number,
    available:boolean,
    active:boolean,
    _id:string
    discountInfo?: DiscountInfo;
}

export type CreateProductVariant = {
    color:{
        name:string,
        _id:string,
    },
    sku:string,
    images:File[],
    price:number,
    available:boolean,
    active:boolean,
}

export interface BrandError {
    message: string;
    status: number;
    data?: string; // Это может быть любой тип в зависимости от структуры ошибки, которую возвращает сервер
}
