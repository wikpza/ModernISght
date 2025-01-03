import {Document, Schema, model, Decimal128} from 'mongoose';
import * as mongoose from 'mongoose';
import {generatePaymentCode, generateSKU} from "../../utils";

export interface IAddress extends Document {
    firstName:string,
    lastName: string,
    addressLine1: string,
    addressLine2:string,
    city: string
    state: string,
    zipCode:string,
    phoneNumber: string,
}

const addressSchema = new mongoose.Schema<IAddress>({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    addressLine1: {
        type: String,
        required: false,
    },
    addressLine2: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    zipCode: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
})


export interface IPurchase extends Document {
    _id:mongoose.Types.ObjectId,
    productVariantId: string;
    quantity: number;
    sizeId:string;
    productPrice:number;
    totalPrice:number
}
const purchaseSchema:Schema = new mongoose.Schema<IPurchase>({
    productVariantId:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        Min:1
    },
    sizeId:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
})

export interface IPayment extends Document{
    userId:string,
    purchases: IPurchase[],
    cardNumber:string,
    productPrice:number,
    shippingPrice:number,
    totalPrice:number,
    status: "canceled" | "succeeded" | "returned",
    shippingStatus: "in process" |  "finished" | "self-pickup" | "picked up"
    address:IAddress,
    createdAt:Date,
    key:string
}

const paymentSchema: Schema = new mongoose.Schema<IPayment>({
    key:{
        type:String,
       required:true
    },
    userId: {
        type: String,
        required: true,
    },
    purchases: [purchaseSchema],
    cardNumber:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    shippingPrice:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["canceled", "succeeded", "returned"],
        default:"succeeded"
    },
    shippingStatus:{
        type:String,
        enum:["in process",  "finished", "self-pickup", "picked up"],
        default:"in process"
    },
    address: {
        type: addressSchema,
        required: false,
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },

});

const PaymentModel = model<IPayment>('Payment' , paymentSchema);

export default PaymentModel;
