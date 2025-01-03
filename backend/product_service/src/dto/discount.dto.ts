import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { Type } from "class-transformer";

export class BaseDiscountRequest {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'Name must not be greater than 50 characters' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200, { message: 'Description must not be greater than 200 characters' })
    description: string;

    @IsNumber()
    @Min(1, { message: 'Percent must be at least 1' })
    @Max(99, { message: 'Percent must not be greater than 99' })
    percent: number;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date) // Преобразование строки в Date
    beginAt: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date) // Преобразование строки в Date
    finishAt: Date;
}
