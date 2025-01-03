import {Item} from "../components/pages/admin/Brand/element/ItemList.tsx";
import {DiscountInfo} from "./product.type.ts";

export type GetCartSize =  {
    _id:string,
    name:string
}

export type GetCartProductVariant = {
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
    discountInfo?: DiscountInfo;
}


export type GetCartProduct = {
    _id:string,
    collection:Item,
    rating:number,
    name:string,
    active:boolean,
    gender:Item,
    brand:Item,
    categoryId:Item,
    features:Record<string, string>
    productVariant:GetCartProductVariant
}

export type GetCartProductList = {
    quantity:number,
    product:GetCartProduct,
    size:GetCartSize,
    inventoryQuantity:number
}
export type GetCart = {
    userId:string,
    productList:GetCartProductList[]
}