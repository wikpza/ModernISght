import mongoose from "mongoose";

export type UserRoleType = 'user' | 'admin' | 'employer'
export class User {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly role: UserRoleType,
        public readonly active?: boolean,


        public readonly _id?: string | mongoose.Types.ObjectId,
        public readonly password?: string,
        public readonly email?: string,

        public readonly createdAt?: Date,
        public readonly modifiedAt?:Date,

        public readonly phoneNumber?:string,
    ) {
    }
}


export type GetInfoUser = {
    email:string,
    lastName:string,
    firstName:string,
    role:string,
}


function isUserRoleType(value: any): value is UserRoleType {
    return value === 'user' || value === 'admin' || value ===  "employer";
}

export const toUserRoleType = (unknownValue: any)=>{
    let role:UserRoleType = 'user'
    if(isUserRoleType(unknownValue)){
        role = unknownValue
    }
    return role
}