import { Document, Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Inventory extends Document {
    productVariantId: mongoose.Schema.Types.ObjectId;
    sizeId:mongoose.Schema.Types.ObjectId;
    quantity:number
}

const inventorySchema: Schema = new mongoose.Schema<Inventory>({
    productVariantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
   sizeId:{
       type: mongoose.Schema.Types.ObjectId,
       required: true
   },
    quantity:{
        type:Number,
        required:true,
        default:0

    }
});

const InventoryModel = model<Inventory>('Inventory', inventorySchema);

export default InventoryModel;
