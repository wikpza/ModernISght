import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from "class-validator";

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidArrayValues(allowedValues: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidArrayValues',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!Array.isArray(value)) return false;
                    return value.every(item => allowedValues.includes(item));
                },
                defaultMessage(args: ValidationArguments) {
                    return `Array can only contain the values: ${allowedValues.join(', ')}.`;
                },
            },
        });
    };
}


export function IsUniqueArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUniqueArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any[], args: ValidationArguments) {
                    if (!Array.isArray(value)) {
                        return false;
                    }
                    const uniqueValues = new Set(value);
                    return uniqueValues.size === value.length;
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Array must contain unique values.';
                },
            },
        });
    };
}


export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'firstName must not be greater than 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'lastName must not be greater than 50 characters' })
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'password must be greater than 8 characters' })
    password?: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+996\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: 'phoneNumber must match the format +996(NNN)NN-NN-NN',
    })
    phoneNumber: string;

}

export class authenticationUserRequest{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'password must be greater than 8 characters' })
    password?: string;
}


export class UpdateUserRequest {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MaxLength(50, { message: 'firstName must not be greater than 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MaxLength(50, { message: 'lastName must not be greater than 50 characters' })
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Matches(/^\+996\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: 'phoneNumber must match the format +996(NNN)NN-NN-NN',
    })
    phoneNumber: string;


    @IsArray()
    @ArrayMinSize(0, { message: 'Array can be empty or have 1 to 3 elements.' })
    @ArrayMaxSize(3, { message: 'Array can have a maximum of 3 elements.' })
    @IsValidArrayValues(['lastName', 'firstName', 'phoneNumber'], { message: 'Array can only contain the values: lastName, firstName, phoneNumber.' })
    @IsUniqueArray({ message: 'Array must contain unique values.' })
    updateValues: string[];
}

export class ResetUserPasswordRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ChangeUserPasswordRequest {
    @IsString()
    @MinLength(8, { message: 'password must be greater than 8 characters' })
    password?: string;
}