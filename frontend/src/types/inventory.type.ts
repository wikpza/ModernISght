export type getInventory = {
    sizeId:string,
    quantity:number,
    size:string
}

export type InventorySessionType = {
    sizeId:string,
    type:string,
    quantity:number,
    productVariantId: string
    userId: string
}

export type InventorySessionList = {
    Date:string
    firstName:string,
    lastName:string,
    email:string,
    role:string,
    type:string,
    size:string,
    quantity:number,

    sizeId:string,
    productVariantId:string,
    userId:string,



}