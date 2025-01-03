import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IsString, IsNotEmpty, Matches, IsInt, Min, Max, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'expiryDateValidator', async: false })
export class ExpiryDateValidator implements ValidatorConstraintInterface {
    validate(value: string): boolean {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
            return false;
        }

        const [month, year] = value.split('/').map(Number);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Месяцы в JavaScript начинаются с 0

        if (month < 1 || month > 12) {
            return false;
        }

        const expiryYear = 2000 + year; // Формат YY преобразуем в YYYY
        const maxYear = currentYear + 8;
        if (expiryYear < currentYear || expiryYear > maxYear) {
            return false;
        }

        if (expiryYear === currentYear && month < currentMonth) {
            return false;
        }

        return true;
    }

    defaultMessage(): string {
        return 'Invalid expiry date. Ensure the format is MM/YY, the month is between 01 and 12, and the date is not in the past or out of range.';
    }
}

export class CreateCardRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{16}$/, { message: 'Card number must be exactly 16 digits' })
    cardNumber: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{3}$/, { message: 'Card number must be exactly 16 digits' })
    cvv: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry date must be in the format MM/YY' })
    @Validate(ExpiryDateValidator, {
        message: 'Invalid expiry date. Ensure the format is MM/YY, the month is between 01 and 12, and the date is not in the past or out of range.'
    })
    expiryDate: string;
}
