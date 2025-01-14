import { v4 as uuidv4 } from 'uuid';
import {ISize} from "../database/schemas/sizeType.schema";
import {InventoryList} from "../repositories/inventory.repository";
import PaymentModel from "../database/schemas/payment.schema";
import {IDiscountInfo} from "../database/schemas/productVariant.schema";


export const createArrayWithUUIDs = (input: { id: string, n: number }): string[] => {
    return Array.from({ length: input.n }, () => `${input.id}.${uuidv4()}.webp`);
};


export const  generateSKU = () => {
    return  Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const generatePaymentCode = async ()=>{
    let key = generateSKU()
    let paymentExist = await PaymentModel.findOne({key:key})
    while(paymentExist){
        key = generateSKU()
        paymentExist = await PaymentModel.findOne({key:key})
    }
    return key
}
const isNumber = (str: string): boolean => {
    const num = Number(str);
    return !isNaN(num) && str.trim() !== '' && !isNaN(parseFloat(str));
};

export function isDiscountActive(discount: IDiscountInfo): boolean {
    const currentDate = new Date(); // Локальная дата
    const currentUTCDate = new Date(currentDate.toISOString()); // Преобразуем в UTC

    const beginAt = new Date(discount.beginAt); // Преобразуем строку в Date
    const finishAt = new Date(discount.finishAt); // Преобразуем строку в Date


    return (
        discount.active &&
        currentUTCDate >= beginAt &&
        currentUTCDate <= finishAt
    );
}

export function calculateDiscountedPrice(price: number, discountPercent: number): number {
    // Рассчитываем цену с учетом скидки
    const discountedPrice = price - (price * discountPercent / 100);

    // Округляем до двух знаков после запятой
    return Math.round(discountedPrice * 100) / 100;
}


export const roundToTwoDecimalPlaces = (value: number): number =>{
    return Math.floor(value * 100) / 100;
}
// Assuming ISize interface has a 'size' property that is a string
export const sortedSizes = (sizes: ISize[]): ISize[] => {
    return sizes.sort((a, b) => {
        const sizeA = a.size;
        const sizeB = b.size;

        // Если оба элемента числовые, сортируем как числа
        if (isNumber(sizeA) && isNumber(sizeB)) {
            return Number(sizeA) - Number(sizeB);
        }

        // Если оба элемента строковые, сортируем как строки
        if (!isNumber(sizeA) && !isNumber(sizeB)) {
            return sizeA.localeCompare(sizeB);
        }

        // Если один элемент числовой, а другой строковый
        return isNumber(sizeA) ? -1 : 1;
    });
};
export const sortedSizesInventory = (sizes: InventoryList[]): InventoryList[] => {
    return sizes.sort((a, b) => {
        const sizeA = a.size;
        const sizeB = b.size;

        // Если оба элемента числовые, сортируем как числа
        if (isNumber(sizeA) && isNumber(sizeB)) {
            return Number(sizeA) - Number(sizeB);
        }

        // Если оба элемента строковые, сортируем как строки
        if (!isNumber(sizeA) && !isNumber(sizeB)) {
            return sizeA.localeCompare(sizeB);
        }

        // Если один элемент числовой, а другой строковый
        return isNumber(sizeA) ? -1 : 1;
    });
};

type PaymentStatus = "canceled" | "succeeded" | "returned";

type PaymentShippingStatus = "in process" | "finished"| "self-pickup" | "picked up"
export function isValidPaymentStatus(status: string): status is PaymentStatus {
    const validStatuses: PaymentStatus[] = ["canceled", "succeeded", "returned"];
    return validStatuses.includes(status as PaymentStatus);
}
export function isValidPaymentShippingStatus(status: string): status is PaymentShippingStatus {
    const validStatuses: PaymentShippingStatus[] = ["in process",  "finished", "self-pickup", "picked up"];
    return validStatuses.includes(status as PaymentShippingStatus);
}

type ProductType = "adding" | "buying" | "returning" | "write-off";

// Функция для проверки, совпадает ли значение с допустимыми значениями
export function isValidInventorySession(type: string): type is ProductType {
    const validTypes: ProductType[] = ["adding", "buying", "returning", "write-off"];
    return validTypes.includes(type as ProductType);
}



