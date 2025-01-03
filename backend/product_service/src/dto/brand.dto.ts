import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateBrandRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name:string
}

export class UpdateBrandRequest extends CreateBrandRequest{

}