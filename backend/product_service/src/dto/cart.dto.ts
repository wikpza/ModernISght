import {IsNotEmpty, IsNumber, IsString, Max, Min} from "class-validator";
import {IsMongoId} from "./sizeType.dto";


export class DeleteCartRequest {
    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'productId must be a valid MongoDB ObjectId' })
    productId:string

    @IsString()
    @IsNotEmpty()
    @IsMongoId({ message: 'sizeId must be a valid MongoDB ObjectId' })
    sizeId:string
}
export class AddCartRequest extends DeleteCartRequest{

    @IsNumber()
    @Min(0)
    @Max(10)
    quantity:number

}
