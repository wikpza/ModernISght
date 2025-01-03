import mongoose from "mongoose";
import {UserRoleType, UserSessionType} from "./user.model";

export class TokenUserSession{
    constructor(
        public readonly _id: string | mongoose.Types.ObjectId,
        public readonly userId: string | mongoose.Types.ObjectId,
        public readonly email: string,
        public readonly  type: UserSessionType | string,
    ){}
}

export class TokenUser{
    constructor(
        public readonly _id: string | mongoose.Types.ObjectId,
        public readonly lastName: string,
        public readonly firstName: string,
        public readonly email: string,
        public readonly  role: UserRoleType,
    ){}
}