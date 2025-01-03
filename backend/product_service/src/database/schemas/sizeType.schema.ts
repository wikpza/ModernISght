import mongoose, { Document } from "mongoose";
import ProductModel from "./product.schema";



export interface ISize extends Document {
    _id: mongoose.Types.ObjectId
   size:string
    createdAt: Date;
    modifiedAt: Date;
}

const sizeSchema = new mongoose.Schema<ISize>({
    size:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifiedAt: {
        type: Date,
        default: new Date()
    }
})

export interface ISizeType extends Document {
    genderId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    sizes: ISize[];
    createdAt: Date;
    modifiedAt: Date;
}




const sizeTypeSchema = new mongoose.Schema<ISizeType>({

    genderId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Gender",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sizes: {
        type: [sizeSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifiedAt: {
        type: Date,
        default: new Date()
    }
});

// Создание модели SizeType
const SizeTypeModel = mongoose.model<ISizeType>('SizeType', sizeTypeSchema);

sizeTypeSchema.pre('save', async function(next, options){
    options.validateModifiedOnly
    this.modifiedAt = new Date()
    next()
})

sizeTypeSchema.pre('findOneAndDelete', async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());

        const count = await mongoose.model('Product').countDocuments({
            'gender': docToDelete.gender,
            "categoryId":docToDelete.categoryId
        });

        if (count > 0) {
            return next(new Error('Cannot delete size type because it is referenced in product .'));
        }

        next();
    } catch (error) {
        next(error as Error);
    }
});


sizeTypeSchema.pre('save', async function (next) {
    if(!this.isModified('gender') && !this.isModified('categoryId')){
        next()
    }
    const sizeExist = await SizeTypeModel.findOne({genderId:this.genderId, categoryId:this.categoryId})
    if(sizeExist) next(new Error('size type with such gender and category has been already created'))
    const countProduct = await ProductModel.countDocuments({genderId:this.genderId,categoryId:this.categoryId})
    if(countProduct !== 0) next(new Error("unable to update because it is referenced in Products "))
    next();
});


export default SizeTypeModel;
