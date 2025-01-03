import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {CreateBrandRequest} from "./brand.dto";

export class CreateGenderRequest{
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, {message:"name must not be greater than 50 characters"})
    name:string
}

export class UpdateGenderRequest extends CreateBrandRequest{

}