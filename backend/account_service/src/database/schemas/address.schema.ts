import mongoose from "mongoose";
import {userSchema} from "./user";
import {UserAddresses} from "../../models";

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    preferred: {
        type: Boolean,
        default:false,
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

const userAddressesSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique:true
    },
    addresses:{
        type:[addressSchema],
        default:[]
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


const UserAddressesModel = mongoose.model('UserAddresses', userAddressesSchema)
export default UserAddressesModel