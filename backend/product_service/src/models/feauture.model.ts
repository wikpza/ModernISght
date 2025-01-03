import mongoose from "mongoose";


export class FeatureProduct{
    constructor(
        public readonly categoryId:mongoose.Types.ObjectId | string,
        public readonly values:string[],

    ) {
    }

}