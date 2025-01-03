import mongoose, {Model} from "mongoose";
import {User, UserRoleType} from "../../models";


export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'employer'],
        default:'user'
    },
    active: {
        type: Boolean,
        default:false
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    modifiedAt: {
        type: Date,
        default:Date.now
    },
});

const userSessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    email:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:['verificationEmail', 'resetPassword']
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    modifiedAt: {
        type: Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:false
    }
})

export const UserSessionModel = mongoose.model('UserSession',userSessionSchema )
export const UserModel = mongoose.model("User", userSchema);
