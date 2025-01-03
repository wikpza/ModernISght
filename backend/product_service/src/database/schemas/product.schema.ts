import mongoose, { Document } from "mongoose";



export interface IDiscountInfo extends Document {
    name: string;
    description: string;
    percent: number;
    active: boolean;
    beginAt: Date;
    finishAt: Date;
}

const discountInfoSchema = new mongoose.Schema<IDiscountInfo>({

    name: {
        type: String,
    },
    description: {
        type: String,
    },
    percent: {
        type: Number,
        min: [0, 'Percent must be at least 0'],
        max: [100, 'Percent cannot be more than 100']
    },
    active: {
        type: Boolean,
        default: false,
    },
    beginAt: {
        type: Date,
        default: Date.now,
    },
    finishAt: {
        type: Date,
        validate: {
            validator: function (value: Date) {
                return value.getTime() >= this.beginAt.getTime();
            },
            message: 'finishAt must be after beginAt'
        }
    }
});


export interface IProductVariant extends Document {
    _id: mongoose.Types.ObjectId
    colorId: mongoose.Types.ObjectId;
    sku: string;
    discountInfo: IDiscountInfo;
    images: string[];
    price: number;
    available: boolean;
    active:boolean,
    createdAt: Date;
    modifiedAt: Date;
}

const productVariantSchema = new mongoose.Schema<IProductVariant>({
    colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique:false
    },
    discountInfo: discountInfoSchema,
    images: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be at least 0']
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        default: ()=>Date.now()
    },
    modifiedAt: {
        type: Date,
        default: ()=>Date.now()
    }
});

export interface IProduct extends Document {
    collectionId: mongoose.Types.ObjectId;
    productVariant: IProductVariant[];
    name: string;
    active: boolean;
    genderId: mongoose.Types.ObjectId;
    features:Record<string, any>
    brandId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    createdAt: Date;
    modifiedAt: Date;
    rating:number
}

const productSchema = new mongoose.Schema<IProduct>({
    rating:{
        type:Number,
        default:0
    },
    features: {
        type: Object,  // Можем хранить объект с характеристиками
        default:{}
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: true
    },
    productVariant: [productVariantSchema],
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    genderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Gender",
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.pre('save', function (next, options) {
   options.validateModifiedOnly
    this.modifiedAt = new Date();
    next();
});



const ProductModel = mongoose.model<IProduct>('Product', productSchema);
export default ProductModel;
