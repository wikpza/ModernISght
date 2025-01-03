import mongoose, {Document, ObjectId} from 'mongoose'
export interface IProductSchema extends Document{
    productVariantId: string,
    sizeId: string,
    quantity:number
}

// const productSchema = new mongoose.Schema<IProductSchema>({
//     productVariantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
//     sizeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Size', required: true },
//     quantity: { type: Number, required: true },
// })

export interface ICartSchema extends Document{
    userId:mongoose.Types.ObjectId,
    productList:IProductSchema[],
    createdAt:Date,
    modifiedAt:Date,
}

const productSchema = new mongoose.Schema<IProductSchema>({
    productVariantId: { type:String , required: true },
    sizeId: { type: String, required: true },
    quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema<ICartSchema>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productList: [productSchema],
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});

// const cartSchema = new mongoose.Schema<ICartSchema>({
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         required:true,
//     },
//     productList:[productSchema],
//     createdAt:{
//         type:Date,
//         default:Date.now
//     },
//     modifiedAt:{
//         type:Date,
//         default:Date.now
//     },
//
// })

cartSchema.pre('save', function (next, options) {
    options.validateModifiedOnly
    this.modifiedAt = new Date();
    next();
});

const CartModel = mongoose.model<ICartSchema>('Cart', cartSchema)
export default CartModel