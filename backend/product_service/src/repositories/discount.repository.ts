import {IBrandRepository} from "../interfaces/brandRepository.interface";
import {Discount} from "../models/productVariant.model";
import ProductModel, {IDiscountInfo} from "../database/schemas/product.schema";
import {NotFoundError} from "../utils/error";


export class DiscountRepository {

    async setDiscount(input: { discount: Discount; productId: string }) {
        // Преобразование строк в объекты Date
        const beginAt = new Date(input.discount.beginAt);
        const finishAt = new Date(input.discount.finishAt);

        // Проверка, что преобразование прошло успешно
        if (isNaN(beginAt.getTime()) || isNaN(finishAt.getTime())) {
            throw new Error("Invalid date format for beginAt or finishAt");
        }

        // Проверка, что beginAt раньше finishAt
        if (beginAt >= finishAt) {
            throw new Error("Begin date must be earlier than finish date");
        }

        // Проверка, что даты не совпадают по дням
        const daysDifference = Math.floor(
            (finishAt.getTime() - beginAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDifference < 1) {
            throw new Error("Begin date and finish date must not be the same day");
        }

        // Проверка существования продукта
        const productExist = await ProductModel.findOne({
            "productVariant._id": input.productId,
        });
        if (!productExist) throw new NotFoundError("Product not found");

        // Поиск индекса нужного варианта
        const variantIndex = productExist.productVariant.findIndex((v) =>
            v._id.equals(input.productId)
        );

        if (variantIndex === -1) {
            throw new NotFoundError("Product variant not found");
        }

        // Обновление discountInfo
        productExist.productVariant[variantIndex].discountInfo = {
            name: input.discount.name,
            description: input.discount.description,
            percent: input.discount.percent,
            active: input.discount.active,
            beginAt: beginAt, // Используем преобразованное значение
            finishAt: finishAt, // Используем преобразованное значение
        } as IDiscountInfo;

        await productExist.save();
        return productExist;
    }


}