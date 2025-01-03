import "reflect-metadata";

import mongoose from "mongoose";

import {
    ArrayUnique,
    IsArray,
     IsDate, IsIn, IsInt,
    IsNotEmpty, IsNumber, IsOptional,
    IsString, Length, Matches, Max,
    Min,
    registerDecorator, ValidateNested,
    ValidationArguments,
    ValidationOptions
} from "class-validator";
import {Type} from "class-transformer";
export function IsMongoId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMongoId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any, _: ValidationArguments) {

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


class PurchaseList {
    @IsString()
    @IsNotEmpty({ message: 'SKU cannot be empty' })
    sku: string;

    @IsInt({ message: 'Quantity must be an integer' })  // Проверка, что число целое
    @Min(1, { message: 'Quantity must be at least 1' })  // Минимум 1
    @Max(10, { message: 'Quantity must not be greater than 10' })  // Максимум 10
    quantity: number;

    @IsString()
    @IsNotEmpty({ message: 'SizeId cannot be empty' })
    @IsMongoId({ message: 'SizeId must be a valid MongoDB ObjectId' })
    sizeId: string;

    constructor(sku: string, quantity: number, sizeId: string) {
        this.sku = sku;
        this.quantity = quantity;
        this.sizeId = sizeId;
    }
}

export class FindPaymentRequest{
    @IsOptional()  // Это поле необязательное
    @IsArray()  // Проверяем, что это массив
    @IsMongoId({ each: true, message: 'Each userId must be a valid MongoDB ObjectId' })  // Проверяем каждый элемент массива
    userId?: string[];  // userId - это массив строк, каждая из которых должна быть действительным MongoDB ObjectId

    @IsOptional() // cardNumber необязательное поле
    @IsString()
    @Matches(/^\d+$/, { message: 'cardNumber must contain only digits' })  // Проверка, чтобы были только цифры
    @Length(16, 16, { message: 'cardNumber must be exactly 16 digits long' }) // Проверка на длину 16
    cardNumber?: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique({ message: 'Status array cannot have duplicate values' })  // Проверка на уникальность элементов массива
    @IsString({ each: true })  // Проверка, что каждый элемент в массиве - строка
    @IsIn(["canceled", "succeeded", "returned"], { each: true, message: 'Each status must be one of "canceled", "succeeded", or "returned"' })
    status?: string[];  // Статус может быть массивом строк

    @IsOptional()
    @IsArray()
    @ArrayUnique({ message: 'Status array cannot have duplicate values' })  // Проверка на уникальность элементов массива
    @IsString({ each: true })  // Проверка, что каждый элемент в массиве - строка
    @IsIn(["in process",  "finished", "self-pickup", "picked up"], { each: true, message: 'Each status must be one of "canceled", "succeeded", or "returned"' })
    shippingStatus?: string[];  // Статус может быть массивом строк

    @IsDate()
    @IsOptional()  // Дата не обязательна (если нужно)
    fromDate?: Date;

    @IsDate()
    @IsOptional()
    toDate?: Date;

    @IsOptional()
    @IsArray()
    @ArrayUnique({ message: 'Status array cannot have duplicate values' })  // Проверка на уникальность элементов массива
    @IsString({ each: true })  // Проверка, что каждый элемент в массиве - строка
    sku?: string[];  // Статус может быть массивом строк

    @IsOptional()
    @IsNumber()  // Проверка, что это число
    @IsInt({ message: 'offset must be an integer' })  // Проверка, что число целое
    @Min(0, { message: 'offset cannot be less than 0' })  // Минимальное значение для offset
    offset: number;


    @IsOptional()
    @IsNumber()  // Проверка, что это число
    @IsInt({ message: 'page must be an integer' })  // Проверка, что число целое
    @Min(1, { message: 'page must be greater than or equal to 1' })  // Минимальное значение для page
    page: number;
}
export class CreatePaymentRequest{

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'cardId must be a valid MongoDB ObjectId' })
    cardId:string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'addressId must be a valid MongoDB ObjectId' })
    addressId:string

    @IsNotEmpty()
    @IsString()  // Проверка, что это строка
    @IsIn(["canceled", "succeeded", "returned"], {
        message: 'Status must be one of "canceled", "succeeded", or "returned"'
    })  // Проверка, что строка является одним из допустимых значений
    status: string;  // Статус может быть только одной из этих строк


    @IsNotEmpty()
    @IsString()  // Проверка, что это строка
    @IsIn(["in process",  "finished", "self-pickup", "picked up"], {
        message: 'Status must be one of "in process",  "finished", "self-pickup", "picked up""'
    })  // Проверка, что строка является одним из допустимых значений
    shippingStatus: string;  // Статус может быть только одной из этих строк

}

export class ChangeStatusPaymentRequest {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'productId must be a valid MongoDB ObjectId' })
    paymentId:string

    @IsNotEmpty()
    @IsString()  // Проверка, что это строка
    @IsIn(["canceled", "succeeded", "returned"], {
        message: 'Status must be one of "canceled", "succeeded", or "returned"'
    })  // Проверка, что строка является одним из допустимых значений
    status: string;  // Статус может быть только одной из этих строк
}

export class ChangeShippingStatusPaymentRequest {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'productId must be a valid MongoDB ObjectId' })
    paymentId:string

    @IsNotEmpty()
    @IsString()  // Проверка, что это строка
    @IsIn(["in process",  "finished", "self-pickup", "picked up"], {
        message: 'Status must be one of "in process",  "finished", "self-pickup", "picked up""'
    })  // Проверка, что строка является одним из допустимых значений
    shippingStatus: string;  // Статус может быть только одной из этих строк
}