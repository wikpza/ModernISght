import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateCollectionRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name:string
}

export class UpdateCollectionRequest extends CreateCollectionRequest{

}