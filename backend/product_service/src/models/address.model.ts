import mongoose,{Document} from "mongoose";


interface IAddress extends Document {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    preferred: boolean;
    createdAt: Date;
    modifiedAt: Date;
}

export type GetAddress = {
    firstName: string,
    lastName: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    zipCode: string,
    phoneNumber: string,
    preferred: boolean,
}
export class Address {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly addressLine1: string,
        public readonly addressLine2: string,
        public readonly city: string,
        public readonly state: string,
        public readonly zipCode: string,
        public readonly phoneNumber: string,
        public readonly preferred: boolean,

        public readonly _id?: string,
        public readonly createdAt?: Date,
        public readonly modifiedAt?: Date,
    ) {}
}



export class UserAddresses{
    constructor(
        public readonly userId: string | mongoose.Types.ObjectId,
        public readonly addresses:  IAddress[],

        public readonly _id:mongoose.Types.ObjectId,
        public readonly createdAt: Date,
        public readonly modifiedAt:Date,
    ) {
    }

}


export class CreateAddress {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly addressLine1: string,
        public readonly addressLine2: string,
        public readonly city: string,
        public readonly state: string,
        public readonly zipCode: string,
        public readonly phoneNumber: string,
        public readonly preferred: boolean,
    ) {
    }
}