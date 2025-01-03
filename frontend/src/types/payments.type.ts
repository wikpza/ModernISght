import {GetCartProduct, GetCartSize} from "./Cart.type.ts";
import {Item} from "../components/pages/admin/Brand/element/ItemList.tsx";
import {Color} from "../types.ts";


export  type GetPaymentAddress = {
    _id: string
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    phoneNumber: string
}

export type GetPaymentItem = {
    _id:string,
    product:GetCartProduct
    size:GetCartSize
    totalPrice:number
    quantity:number
}

export type GetPaymentProductList = {
    _id:string,
    purchases:GetPaymentItem[],
    cardNumber:string,
    productPrice:number,
    shippingPrice:number,
    totalPrice:number,
    status:string,
    shippingStatus:string,
    address:GetPaymentAddress
    key:string
}


export type GetPayments = {
    userId:string,
    payments:GetPaymentProductList[]
}

export type GetAdminPayments = {
    data:AdminPayment[],
    totalPage:number
}

export type AdminPayment = {
    _id:string,
    userId:string,
    cardNumber:string,
    productPrice:number,
    shippingPrice:number,
    totalPrice:number,
    shippingStatus:string
    status:string,
    key:string,

    lastName:string,
    firstName:string,
    email:string,
    role:string,
}

export type PaymentStatic = {
    name:string,
    productId:string,
    images:string[],
    productVariant:string,
    category:Item,
    gender:Item,
    collection:Item,
    color:Color,
    status:string,
    shippingStatus:string,
    totalQuantity:number,
    totalPrice:number
}

export type GraphType = {
    _id:string,
    name:string,
    count:number,
}
export type GetPaymentStatic = {
    data:PaymentStatic[],
    totalPrice:number
    genders:GraphType[],
    brands:GraphType[],
    collections:GraphType[],
    categories:GraphType[],
}