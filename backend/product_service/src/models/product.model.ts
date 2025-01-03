

export class Product{
    constructor(
        public readonly collectionId:string,
        public readonly name:string,
        public readonly active:boolean,
        public readonly genderId:string,
        public readonly brandId:string,
        public readonly categoryId:string,
        public readonly features: Record<string, any>
    ) {
    }
}

export class updateProduct{
    constructor(
        public readonly collectionId:string,
        public readonly name:string,
        public readonly active:boolean,
        public readonly brandId:string,
        public readonly features: Record<string, any>
    ) {
    }
}

export class ProductPrice{
    constructor(
        sku:string,
        price:number
    ) {
    }
}


export type GetProducts = {
    colors: string[],
    brands: string[],
    collections: string[],
    gender: string[],
    category: string[],
    priceMore: number,
    priceLess: number,
    sortBy: string,
    sortType: string,
    page:number,
    limit:number
}