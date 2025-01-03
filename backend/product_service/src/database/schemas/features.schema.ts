
import mongoose, {Document} from "mongoose";

export interface IFeatureProduct extends Document{
    categoryId:mongoose.Types.ObjectId,
    values:string[],
    createdAt:Date,
    modifiedAt:Date,
}
const featuresSchema = new mongoose.Schema({
    categoryId:{
        type:mongoose.Types.ObjectId,
        unique:true,
        required:true,
        ref:"Category"
    },
    values:{
        type:[String],
        required:true,
        default:[]
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    modifiedAt:{
        type:Date,
        default:new Date()
    }
})
featuresSchema.pre<IFeatureProduct>('save',function(next){
    this.modifiedAt = new Date()
    next()
})
const FeaturesModel = mongoose.model<IFeatureProduct>("Features", featuresSchema)
export default FeaturesModel