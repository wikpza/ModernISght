import {InventorySessionType} from "../../models/inventorySession.model";
import * as mongoose from "mongoose";
import {model} from "mongoose";


export interface InventorySession {
    sizeId:mongoose.Schema.Types.ObjectId,
    productVariantId:mongoose.Schema.Types.ObjectId,
    type:InventorySessionType,
    quantity:number,
    userId:string,
    createdAt:Date
}

const InventorySessionSchema = new mongoose.Schema<InventorySession>({
    sizeId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type:{
        type:String,
        enum:["adding", 'buying', 'returning', "write-off"],
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:[0, 'Quantity must be a non-negative number']
    },

    productVariantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:()=>Date.now()
    }


})

const InventorySessionModel = model<InventorySession>("InventorySession",InventorySessionSchema)
export default InventorySessionModel