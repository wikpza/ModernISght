import {IsArray, IsNotEmpty, IsString, MaxLength} from "class-validator";

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import mongoose from 'mongoose';

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

export function IsMongoId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMongoId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // Проверка, что значение является допустимым ObjectId
                    return mongoose.Types.ObjectId.isValid(value);
                },
                defaultMessage(args: ValidationArguments) {
                    // Сообщение об ошибке при невалидном ObjectId
                    return `${args.property} must be a valid MongoDB ObjectId`;
                },
            },
        });
    };
}


export class CreateSizeTypeRequest{
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'genderId must be a valid MongoDB ObjectId' })
    genderId:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
    categoryId:string

    @IsArray()
    @IsUniqueArray()
    values:string[]
}

export class AddSizeTypeRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    newValue:string
}
export class DeleteTypeRequest {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'sizeId must be a valid MongoDB ObjectId' })
    sizeId:string
}

export class UpdateSizeTypeRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'new Value must not be greater than 50 characters' })
    newValue:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'sizeId must be a valid MongoDB ObjectId' })
    sizeId:string
}