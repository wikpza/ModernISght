export class PurchaseList{
    constructor(
        public readonly sku:string,
        public readonly quantity:number,
        public readonly sizeId:string,
    ) {
    }

}