import {IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class CreateAddressRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'firstName must not be greater than 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'lastName must not be greater than 50 characters' })
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'addressLine1 must not be greater than 50 characters' })
    addressLine1: string;

    @IsString()
    @IsOptional()  // Make addressLine2 optional
    @MaxLength(50, { message: 'addressLine2 must not be greater than 50 characters' })
    addressLine2?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: 'city must not be greater than 20 characters' })
    city: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: 'state must not be greater than 20 characters' })
    state: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: 'zipCode must not be greater than 20 characters' })
    zipCode: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+996\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: 'phoneNumber must match the format +996(NNN)NN-NN-NN',
    })
    phoneNumber: string;

    @IsBoolean()
    @IsOptional()  // Make preferred optional
    preferred?: boolean;
}

export class UpdateAddressRequest  extends  CreateAddressRequest{
}