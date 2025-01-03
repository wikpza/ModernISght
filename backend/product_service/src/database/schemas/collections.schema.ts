import mongoose, {Document} from "mongoose";
import {ICategory} from "./category.schema";

export interface ICollection extends Document {
    name: string;
    createdAt: Date;
    modifiedAt: Date;
}

const collectionsSchema = new mongoose.Schema<ICollection>({
    name:{
        type:String,
        required:true,
        unique:true
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    modifiedAt: {
        type: Date,
        default:Date.now
    }
})

collectionsSchema.pre<ICollection>('save',function(next, options){
    options.validateModifiedOnly
    this.modifiedAt = new Date()
    next()
})



collectionsSchema.pre('findOneAndDelete', async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());
        const count = await mongoose.model('Product').countDocuments({
            'collectionId': docToDelete._id
        });
        if (count > 0) {
            return next(new Error('Cannot delete collection because it is referenced in product .'));
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});
const CollectionsModel = mongoose.model('Collection', collectionsSchema)
export default CollectionsModel