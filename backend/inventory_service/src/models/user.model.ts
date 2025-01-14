import mongoose, {mongo} from "mongoose";


export type UserRoleType = 'user' | 'admin' | 'employer'
export type UserSessionType = 'verificationEmail' | 'resetPassword'
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

export class ChangePasswordUser{
    constructor(
        public readonly _id: string | mongoose.Types.ObjectId,
        public readonly userId: string | mongoose.Types.ObjectId,
        public readonly email: string,
        public readonly  type: UserSessionType | string,
        public readonly password:string
    ) {
    }
}

export class CreateUser{
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly password: string,
        public readonly email: string,
        public readonly phoneNumber:string,
    ) {
    }
 }

export class CreateUserSession{
    constructor(
        public readonly _id:string  | mongoose.Types.ObjectId,
        public readonly email: string,
        public readonly role?: UserRoleType,
    ) {
    }
}

type UserUpdateFields = 'firstName' | 'lastName' | 'phoneNumber';

export class UpdateUser {
    constructor(
        public readonly _id: string | mongoose.Types.ObjectId,

        public readonly updateValues: UserUpdateFields[],

        public readonly firstName?: string,
        public readonly lastName?: string,
        public readonly phoneNumber?: string,
        public readonly createdAt?: Date,
        public readonly modifiedAt?: Date,
    ) {}
}

export class UserSession{

    constructor(
        public readonly userId:string  | mongoose.Types.ObjectId,
        public readonly token:string,
        public readonly type:UserSessionType,
        public readonly status:boolean,
        public readonly email:string,

        public readonly _id?:string  | mongoose.Types.ObjectId,
        public readonly createdAt?: Date,
        public readonly modifiedAt?:Date,
    ) {
    }
}
export class UserAuthenticationForm{
    public readonly email:string
    public readonly  password:string
}