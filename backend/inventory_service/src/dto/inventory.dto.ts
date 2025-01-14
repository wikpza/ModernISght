
import {
    IsNumber,
    Min,
    Max,
    IsString,
    IsNotEmpty,
    IsMongoId, IsIn
} from 'class-validator';
import {Type} from "class-transformer";

class GetProductSizeRequest {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'product id must be a valid MongoDB ObjectId' })
    productVariantId!:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'size id must be a valid MongoDB ObjectId' })
    sizeId!:string
}

class GetProductInventoryRequest {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'product id must be a valid MongoDB ObjectId' })
    productVariantId!:string
}


export class ReduceInventoryRequest {
    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    @Max(100, { message: 'Quantity must be at most 100' })
    quantity!: number;


    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'sizeId must be a valid MongoDB ObjectId' })
    sizeId!:string
}

export class ChangeNumberProduct{
    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    @Max(100, { message: 'Quantity must be at most 100' })
    quantity!: number;

    @IsString()
    @IsNotEmpty()
    @IsIn(["adding", 'buying', 'returning', "write-off"], { message: 'Type must be one of the following: "adding", "buying", "returning", "Write-off"' })
    type!:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'sizeId must be a valid MongoDB ObjectId' })
    sizeId!:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'productId must be a valid MongoDB ObjectId' })
    productId!:string
}
