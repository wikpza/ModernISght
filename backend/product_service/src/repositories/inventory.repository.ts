import InventoryModel, {Inventory} from "../database/schemas/inventory.schema";
import {NotFoundError} from "../utils/error";
import ProductModel from "../database/schemas/product.schema";
import SizeTypeModel, {ISize, ISizeType} from "../database/schemas/sizeType.schema";
import mongoose from "mongoose";
import {isValidInventorySession, sortedSizesInventory} from "../utils";
import InventorySessionModel from "../database/schemas/inventorySession.schema";
import {fetchUser} from "../api/httpRequest/payment.request";


export type InventoryList = {
    sizeId:string,
    size:string,
    quantity:number
}

export type InventorySessionList = {
    sizeId:string,
    type:string,
    quantity:number,
    productVariantId:string,
    userId:string,
    size:string,

    email:string,
    firstName:string,
    lastName:string,
    role:string,
    Date:Date
}
export class InventoryRepository {

    async getHistoryInventory(input: { productId: string, token: string, limit: number, page: number }) {
        // 1. Проверяем, существует ли продукт
        const productExist = await ProductModel.findOne(
            {
                'productVariant._id': input.productId,  // Ищем по id внутри массива productVariant
            }
        );

        if (!productExist) throw new NotFoundError("not found product");

        // 2. Получаем общее количество записей для данного productId
        const totalInventoryCount = await InventorySessionModel.countDocuments({ productVariantId: input.productId });

        // 3. Вычисляем количество страниц
        const totalPages = Math.ceil(totalInventoryCount / input.limit);

        // 4. Получаем инвентарь для указанного productId с применением пагинации
        const inventorySession = await InventorySessionModel.find({ productVariantId: input.productId })
            .skip((input.page - 1) * input.limit)
            .limit(input.limit);

        if (!inventorySession || inventorySession.length === 0) return { sessionList: [], pages: totalPages };

        // 5. Получаем список размеров для продукта
        const sizeTypeList = await SizeTypeModel.findOne({ genderId: productExist.genderId, categoryId: productExist.categoryId });

        if (!sizeTypeList) throw new NotFoundError('not found size list');

        // 6. Используем Promise.all для асинхронной обработки внутри map
        const result = await Promise.all(inventorySession.map(async (item) => {
            // Находим размер по sizeId
            const size = sizeTypeList.sizes.find(size => size._id.toString() === item.sizeId.toString());

            if (!size) {
                throw new NotFoundError('unable to get inventory data');
            }

            // 7. Получаем данные пользователя через fetchUser
            const userData = await fetchUser(item.userId, input.token);

            if (!userData.status) throw new NotFoundError('can not find user data');

            // Возвращаем информацию о товаре, пользователе и размере
            return {
                email: userData.user.email,
                lastName: userData.user.lastName,
                firstName: userData.user.firstName,
                role: userData.user.role,
                sizeId: item.sizeId.toString(),
                size: size.size,
                quantity: item.quantity,
                Date:item.createdAt,
                type:item.type
            } as InventorySessionList;
        }));

        // 8. Возвращаем результат с количеством страниц
        return {
            sessionList: result,
            pages: totalPages,  // Возвращаем общее количество страниц
        };
    }



    async changeNumberInventory(input: { productId: string; sizeId: string; quantity: number, type:string, userId:string }): Promise<Inventory> {

        const inventoryExist = await InventoryModel.findOne({productVariantId:input.productId, sizeId:input.sizeId})
        if(!inventoryExist) throw new NotFoundError('unable to find product')

        if(!isValidInventorySession(input.type)){
            throw new NotFoundError('unable to determine type of procedure')
        }

        if(input.type === "adding"){
            inventoryExist.quantity = inventoryExist.quantity + input.quantity
        }else if(input.type === "returning"){
            inventoryExist.quantity = inventoryExist.quantity + input.quantity
        }else if(input.type === "buying"){
            if(input.quantity > inventoryExist.quantity) throw new NotFoundError('not enough product to sell')
            inventoryExist.quantity = inventoryExist.quantity - input.quantity
        }else if(input.type === "write-off"){
            if(input.quantity > inventoryExist.quantity) throw new NotFoundError('not enough product to write off')
            inventoryExist.quantity = inventoryExist.quantity - input.quantity
        }


        await inventoryExist.save()

        const inventorySessionExist = await InventorySessionModel.create({
            productVariantId:inventoryExist.productVariantId,
            type:input.type,
            quantity:input.quantity,
            sizeId:inventoryExist.sizeId,
            userId:input.userId,

        })
        await inventorySessionExist.save()

        return inventorySessionExist
    }

    async get(productId: string): Promise<InventoryList[]> {
        // Проверка наличия продукта
        const productExist = await ProductModel.findOne(
            {
                'productVariant._id': productId // Ищем по id внутри массива productVariant
            },

        ).exec();

        if (!productExist) throw new NotFoundError("not found product");

        const inventory = await InventoryModel.find({ productVariantId: productId }).exec();
        if(!inventory || inventory.length === 0) throw new NotFoundError('not found inventory story')

        const sizeTypeList = await SizeTypeModel.findOne({genderId:productExist.genderId, categoryId:productExist.categoryId})
        if(!sizeTypeList) throw new NotFoundError('not found size list')

        const result = inventory.map(item => {
            // Ищем размер по sizeId
            const size = sizeTypeList.sizes.find(size => size._id.toString() === item.sizeId.toString());

            // Если не нашли размер, можно либо вернуть null, либо ошибку
            if (!size) {
                throw new NotFoundError('unable to get inventory data')

            }

            // Возвращаем результат с именем размера
            return {
                sizeId:item.sizeId.toString(),
                size:size.size,
                quantity: item.quantity
            } as InventoryList;
        });

        return sortedSizesInventory(result)

    }

    async getUser(productId:string):Promise<InventoryList[]>{
        const productExist = await ProductModel.findOne(
            {
                'productVariant._id': productId // Ищем по id внутри массива productVariant
            },

        ).exec();

        if (!productExist) throw new NotFoundError("not found product");

        const inventory = await InventoryModel.find({ productVariantId: productId }).exec();
        if(!inventory || inventory.length === 0) throw new NotFoundError('not found inventory story')

        const sizeTypeList = await SizeTypeModel.findOne({genderId:productExist.genderId, categoryId:productExist.categoryId})
        if(!sizeTypeList) throw new NotFoundError('not found size list')

        const result = inventory.map(item => {
            // Ищем размер по sizeId
            const size = sizeTypeList.sizes.find(size => size._id.toString() === item.sizeId.toString());

            // Если не нашли размер, можно либо вернуть null, либо ошибку
            if (!size) {
                throw new NotFoundError('unable to get inventory data')

            }

            // Возвращаем результат с именем размера
            return {
                sizeId:item.sizeId.toString(),
                size:size.size,
                quantity: item.quantity > 10 ? 10 :item.quantity
            } as InventoryList;
        });

        return sortedSizesInventory(result)
    }

    async setSizes(sizes:ISizeType, productId:mongoose.Types.ObjectId){
        for (const size of sizes.sizes) {
            await InventoryModel.create(
                {
                    productVariantId:productId,
                    sizeId:size._id,
                    quantity:0
                }
            )

        }
    }

    async addSizes(sizeValue:ISize, productId:string){
        await InventoryModel.create(
            {
                productVariantId:productId,
                sizeId:sizeValue._id,
                quantity:0
            }
        )
    }
}
//     async getAdmin(products: { sku: string, sizeId: string }[]): Promise<Inventory[]> {
//         const result: Inventory[] = [];
//
//         for (const product of products) {
//             const { sku, sizeId } = product;
//
//             const inventory = await InventoryModel.findOne({ sku });
//
//             if (!inventory) {
//                 throw new Error(`Product with sku ${sku} not found`);
//             }
//
//             // Проверяем, есть ли размер с указанным sizeId в поле sizes
//             const sizeQuantity = inventory.sizes.get(sizeId);
//
//             if (sizeQuantity === undefined) {
//                 throw new Error(`SizeId ${sizeId} not found for sku ${sku}`);
//             }
//
//             // Добавляем товар в результат
//             result.push(inventory);
//         }
//
//         return result;
//     }
//
//

//
//     async reduce(input: { sku: string; sizeId: string; quantity: number }): Promise<Inventory> {
//         const inventoryExist = await InventoryModel.findOne({sku:input.sku,})
//         if(!inventoryExist) throw new NotFoundError('unable to find product with such sku')
//         if( !(input.sizeId  in inventoryExist.sizes) ) throw new NotFoundError('sizeId')
//         let quantity = inventoryExist.sizes.get(input.sizeId)
//         if(!quantity) throw new NotFoundError('quantity of product is zero')
//         if( (quantity - input.quantity)<0 ) throw new NotFoundError("There is a shortage of the item in stock")
//         inventoryExist.sizes.set(input.sizeId, quantity - input.quantity )
//         await inventoryExist.save()
//         const inventorySessionExist = await InventorySessionModel.create({
//             sku:input.sku,
//             quantity:input.quantity,
//             type:"buying"
//         })
//         await inventorySessionExist.save()
//         return Promise.resolve(inventoryExist);
//     }
//
//     async create(input: { sku: string; sizes: string[] }): Promise<Inventory> {
//         const inventoryExist = await InventoryModel.findOne({sku:input.sku,})
//         if(inventoryExist) throw new NotFoundError('sku must be unique')
//         const newInventory = await InventoryModel.create({sku:input.sku})
//         input.sizes.forEach(sizeName=>{
//             newInventory.sizes.set(sizeName, 0)
//         })
//         await newInventory.save()
//         return newInventory
//     }
//
//     async delete(sku: string): Promise<Inventory> {
//         const inventoryExist = await InventoryModel.findOne({sku})
//         if(!inventoryExist) throw new NotFoundError('unable to find product with such sku')
//         await InventoryModel.deleteOne({sku:sku})
//         const inventorySessionNumber = await InventorySessionModel.countDocuments({sku,type:'buying'})
//         if(inventorySessionNumber) throw new NotFoundError('unable to delete')
//         await InventoryModel.deleteOne({sku})
//         return inventoryExist
//     }
//
//     async refund(input: { sku: string; sizeId: string; quantity: number }): Promise<Inventory> {
//         const inventoryExist = await InventoryModel.findOne({sku:input.sku,})
//         if(!inventoryExist) throw new NotFoundError('unable to find product with such sku')
//         if( !(input.sizeId  in inventoryExist.sizes) ) throw new NotFoundError('sizeId')
//         let quantity = inventoryExist.sizes.get(input.sizeId)
//         if(!quantity) throw new NotFoundError('quantity of product is zero')
//         inventoryExist.sizes.set(input.sizeId, quantity + input.quantity )
//         await inventoryExist.save()
//         const inventorySessionExist = await InventorySessionModel.create({
//             sku:input.sku,
//             quantity:input.quantity,
//             type:"returning"
//         })
//         await inventorySessionExist.save()
//         return Promise.resolve(inventoryExist);
//     }
//
//
//
//
// }