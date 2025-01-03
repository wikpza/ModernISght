import {IsNotEmpty, IsNumber, IsString, Length, Max, MaxLength, Min} from "class-validator";

export class CreateCartProductRequest{
    @IsString()
    @IsNotEmpty()
    @Length(9, 9, { message: 'SKU length must not be 9 characters' })
    sku!:string

    @IsNumber()
    @Min(1, {message:"quantity can not be less than 1"})
    @Max(10, {message:"quantity can not be grater than 10"})
    quantity!:number
}