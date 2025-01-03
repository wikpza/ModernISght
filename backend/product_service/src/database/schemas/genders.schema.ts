import mongoose,{Document, Schema} from "mongoose";
import {IBrand} from "./brands.schema";

export interface IGender extends Document{
    name:string,
    createdAt:Date,
    modifiedAt:Date
}

const genderSchema = new mongoose.Schema<IGender>({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:()=>new Date()
    },
    modifiedAt:{
        type:Date,
        default:()=>new Date()
    }
})

genderSchema.pre<IBrand>('save', function(next, options){
    options.validateModifiedOnly
    this.modifiedAt = new Date()
    next()
})

genderSchema.pre('findOneAndDelete', async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());
        const count = await mongoose.model('Product').countDocuments({
            'genderId': docToDelete._id
        });
        if (count > 0) {
            return next(new Error('Cannot delete brand because it is referenced in product .'));
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});

const GenderModel = mongoose.model('Gender', genderSchema)
export default GenderModel