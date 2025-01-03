import mongoose,{Document, Schema} from "mongoose";
import ProductModel from "./product.schema";

export interface  IBrand extends Document {
    name:string,
    createdAt: Date;
    modifiedAt: Date;
}

const brandsSchema = new mongoose.Schema<IBrand>({
    name:{
        type:String,
        required:true,
        unique:true
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    modifiedAt: {
        type: Date,
        default: () => new Date()
    }
})

brandsSchema.pre<IBrand>('save', function(next, options){
    options.validateModifiedOnly
    this.modifiedAt = new Date()
    next()
})



brandsSchema.pre('findOneAndDelete', async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());
        const count = await mongoose.model('Product').countDocuments({
            'brandId': docToDelete._id
        });
        if (count > 0) {
            return next(new Error('Cannot delete brand because it is referenced in product .'));
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});
const BrandsModel = mongoose.model('Brand', brandsSchema)
export default BrandsModel