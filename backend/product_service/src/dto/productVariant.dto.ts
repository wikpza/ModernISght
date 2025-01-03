import {
    IsArray,
    IsBoolean, IsNotEmpty, IsNumber, IsOptional,
    IsString, registerDecorator, ValidationArguments, ValidationOptions,
    ValidatorConstraint, ValidatorConstraintInterface
} from "class-validator";
import {IsMongoId} from "./sizeType.dto";



// Кастомный валидатор для проверки расширения .webp и уникальности значений
@ValidatorConstraint({ name: 'isWebpAndUnique', async: false })
export class IsWebpAndUniqueConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        if (!Array.isArray(value)) {
            return false;
        }

        // Проверка на уникальность
        const uniqueValues = new Set(value);
        if (uniqueValues.size !== value.length) {
            return false;
        }

        // Проверка расширения
        return value.every((item: any) => typeof item === 'string' && item.endsWith('.webp'));
    }

    defaultMessage(args: ValidationArguments): string {
        return 'Each image must be a unique string ending with .webp';
    }
}

export function IsWebpAndUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsWebpAndUniqueConstraint,
        });
    };
}
export class DeletePicturesRequest {
    @IsArray()
    @IsString({ each: true })
    @IsWebpAndUnique({ message: 'Each image must be a unique string ending with .webp' })
    images: string[];
}



export class UpdateStatusProductVariantRequest {
    @IsBoolean()
    newValue:boolean
}

export class CreateProductVariantRequest{
    @IsNumber()
    @IsNotEmpty()
    price:number

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'colorId must be a valid MongoDB ObjectId' })
    colorId:string

    @IsBoolean()
    active:boolean

    @IsBoolean()
    available:boolean
}