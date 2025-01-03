import {IsNotEmpty, IsString, MaxLength} from "class-validator";

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// Регулярное выражение для проверки формата HEX цвета
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export function IsHexColor(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isHexColor',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'string' && hexColorRegex.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `The value of ${args.property} must be a valid HEX color code.`;
                },
            },
        });
    };
}

export class CreateColorRequest{
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name:string

    @IsString()
    @IsNotEmpty()
    @IsHexColor({ message: 'Invalid HEX color format.' })
    hexCode: string;
}

export class UpdateColorRequest extends CreateColorRequest{

}