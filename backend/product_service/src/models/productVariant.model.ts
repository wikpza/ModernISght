import mongoose from "mongoose";


export class Discount{
    constructor(
        public readonly name:string,
        public readonly description:string,
        public readonly percent:number,
        public readonly active:boolean,
        public readonly beginAt:Date,
        public readonly finishAt:Date,
    ){}
}

export class ProductVariant{
    constructor(
        public readonly colorId:string,
        public readonly price:number,
        public readonly available:boolean,
        public readonly active:boolean,
    ) {
    }

}