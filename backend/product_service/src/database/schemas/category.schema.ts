import mongoose, {Document} from "mongoose";
import FeaturesModel from "./features.schema";
import SizeTypeModel from "./sizeType.schema";
export interface ICategory extends Document {
    name: string;
    createdAt: Date;
    modifiedAt: Date;
}
const categorySchema = new mongoose.Schema<ICategory>({
    name:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default: () => new Date()
    },
    modifiedAt:{
        type:Date,
        default: () => new Date()
    }
})

categorySchema.pre<ICategory>('save',function(next, options){
    options.validateModifiedOnly
    this.modifiedAt = new Date()
    next()
})


categorySchema.pre('findOneAndDelete', async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());

        const count = await mongoose.model('Product').countDocuments({
            'categoryId': docToDelete._id
        });

        if (count > 0) {
            return next(new Error('Cannot delete category because it is referenced in product .'));
        }

        const categorySize = await SizeTypeModel.findOne({
            'categoryId': docToDelete._id
        });

        if (categorySize && categorySize.sizes.length !== 0) {
            return next(new Error('Cannot delete category because it is referenced in sizeType .'));
        }

        if(categorySize){
            await SizeTypeModel.deleteOne({categoryId:docToDelete._id})
        }

        await FeaturesModel.deleteMany({categoryId:docToDelete._id})
        next();
    } catch (error) {
        next(error as Error);
    }
});



const CategoryModel = mongoose.model<ICategory>('Category', categorySchema)

export default CategoryModel