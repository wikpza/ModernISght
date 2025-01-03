import {
    ArrayMinSize, ArrayUnique,
    IsArray,
    IsBoolean,
    IsIn, IsInt,
    IsNotEmpty, IsNumber, IsObject,
    IsOptional,
    IsString,
    MaxLength,
    Min
} from "class-validator";
import {IsMongoId} from "./sizeType.dto";


class BaseProductRequest{
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'collectionId must be a valid MongoDB ObjectId' })
    collectionId:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'brandId must be a valid MongoDB ObjectId' })
    brandId:string

    @IsBoolean()
    @IsOptional()
    active:boolean

    @IsObject()
    features: Record<string, any>;
}
export class CreateProductRequest extends BaseProductRequest{
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
    categoryId:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'genderId must be a valid MongoDB ObjectId' })
    genderId:string

}

export class UpdateProductRequest extends BaseProductRequest{
}

export class ChangeActiveRequest{
    @IsBoolean()
    newValue:boolean
}


export class GetProductPriceRequest{
    @IsArray() // Проверка, что входной параметр — это массив
    @IsString({ each: true }) // Проверка, что каждый элемент массива — строка
    @ArrayMinSize(1, { message: 'At least one SKU must be provided' }) // Минимум 1 элемент
    products!: string[]; // Тип для массива строк
}


export class GetProductsRequest{
    @IsArray()
    @ArrayUnique({ message: 'colors should not contain duplicate values' })
    @IsString({ each: true, message: 'Each colors must be a string' })
    @IsMongoId({ each: true, message: 'Each colors must be a valid MongoDB ObjectId' })
    colors: string[];

    @IsArray()
    @ArrayUnique({ message: 'brands should not contain duplicate values' })
    @IsString({ each: true, message: 'Each brands must be a string' })
    @IsMongoId({ each: true, message: 'Each brands must be a valid MongoDB ObjectId' })
    brands: string[];

    @IsArray()
    @ArrayUnique({ message: 'collections should not contain duplicate values' })
    @IsString({ each: true, message: 'Each collections must be a string' })
    @IsMongoId({ each: true, message: 'Each collections must be a valid MongoDB ObjectId' })
    collections: string[];

    @IsArray()
    @ArrayUnique({ message: 'genders should not contain duplicate values' })
    @IsString({ each: true, message: 'Each genders must be a string' })
    @IsMongoId({ each: true, message: 'Each genders must be a valid MongoDB ObjectId' })
    genders: string[];

    @IsArray()
    @ArrayUnique({ message: 'categories should not contain duplicate values' })
    @IsString({ each: true, message: 'Each category must be a string' })
    @IsMongoId({ each: true, message: 'Each category must be a valid MongoDB ObjectId' })
    categories: string[];

    @IsIn(['price', 'rating'], { message: 'sortBy must be either "price" or "rating"' })
    sortBy: 'price' | 'rating';  // Значение должно быть либо 'price', либо 'rating'

    @IsIn([-1, 1], { message: 'sortBy must be either "price" or "rating"' })
    sortType: -1 | 1;  // Значение должно быть либо 'price', либо 'rating'

    @IsNumber({}, { message: 'priceLess must be a number' })
    @Min(0, { message: 'priceLess must be a positive number' })
    priceLess: number;  // Значение должно быть числом и положительным

    @IsNumber({}, { message: 'priceMore must be a number' })
    @Min(0, { message: 'priceMore must be a positive number' })
    priceMore: number;  // Значение должно быть числом и положительным



}


