import {
    IsOptional,
    IsNumber,
    Min,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    IsString, IsNotEmpty, IsIn
} from 'class-validator';
import mongoose from 'mongoose';


@ValidatorConstraint({ name: 'IsObjectId', async: false })
export class IsObjectId implements ValidatorConstraintInterface {
    validate(id: any, args: ValidationArguments) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    defaultMessage(args: ValidationArguments) {
        return 'ID must be a valid MongoDB ObjectId';
    }
}


export class GetUsersRequest{
    @IsOptional()
    @IsNumber()
    @Min(1)
    page:number


    @IsOptional()
    @IsNumber()
    @Min(1)
    limit:number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userEmail:string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsIn(['user', 'admin', 'employer'], {
        message: 'Role must be either user, admin, or employer',
    })
    userRole:string

}

export class ChangeStatusRequest{


    @IsString()
    @IsNotEmpty()
    @IsIn(['user', 'admin', 'employer'], {
        message: 'Role must be either user, admin, or employer',
    })
    newRole:string
}