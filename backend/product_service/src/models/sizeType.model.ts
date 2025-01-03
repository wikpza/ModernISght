import mongoose from "mongoose";

export class SizeType{
    constructor(
        public readonly categoryId:string,
        public readonly genderId:string,
        public readonly values:string[],

    ) {
    }
}