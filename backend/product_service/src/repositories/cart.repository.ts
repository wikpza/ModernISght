import {NotFoundError} from "../utils/error";
import mongoose from "mongoose";
import CartModel, {IProductSchema} from "../database/schemas/cart.schema";
import ProductModel from "../database/schemas/product.schema";
import SizeTypeModel, {ISize} from "../database/schemas/sizeType.schema";
import InventoryModel from "../database/schemas/inventory.schema";
export class CartRepository  {

    async delete(input: { userId: string, productId:string, sizeId:string }){
        const cartExist = await  CartModel.findOne({userId:input.userId})
        if(!cartExist) throw  new NotFoundError('user not found')

        cartExist.productList = cartExist.productList.filter((product)=>product.productVariantId !==input.productId  && product.sizeId !== input.sizeId)
        await cartExist.save()

        return cartExist
    }

    async get(input: { userId: string }) {
        const cart = await CartModel.findOne({ userId:input.userId })

        if (!cart) {
            return  await CartModel.create({userId:input.userId, productList:[]})

        }

        const productList = []

        for (let productItem of cart.productList){

            const product = await ProductModel.findOne({
                "productVariant._id": productItem.productVariantId // фильтруем по конкретному variantId
            })
                .populate('brandId', 'name')  // Заполняем поле brandId с полем 'name'
                .populate('collectionId', 'name')  // Заполняем поле collectionId с полем 'name'
                .populate('categoryId', 'name')  // Заполняем поле categoryId с полем 'name'
                .populate('genderId', 'name')  // Заполняем поле genderId с полем 'name'
                .populate({
                    path: 'productVariant.colorId',  // Заполняем поле colorId в productVariant
                    select: 'name hexCode'  // Указываем, какие поля из коллекции Color нам нужны
                });

            if (!product) {
               continue
            }

            const variant = product.productVariant.find((v) => v._id.equals(productItem.productVariantId));
            if (!variant) {
               continue
            }

            const sizeExist = await SizeTypeModel.findOne({
                categoryId:product.categoryId._id,
                genderId:product.genderId._id,
                "sizes._id":productItem.sizeId
            })

            if (!sizeExist) {
                throw new Error('size not found');
            }

            const sizeValue = sizeExist.sizes.find((v) => v._id.equals(productItem.sizeId));
            if (!sizeValue) {
                throw new Error('size not found');
            }



            const inventoryExist =await  InventoryModel.findOne({
                productVariantId:variant._id,
                sizeId:sizeValue._id
            })

            let inventoryQuantity =  inventoryExist? inventoryExist.quantity:0
            productList.push(
                {
                    quantity:productItem.quantity,
                    product:{
                        _id:product._id,
                        rating:product.rating,
                        features:product.features,
                        collection:product.collectionId,
                        name:product.name,
                        active:product.active,
                        gender:product.genderId,
                        brand:product.brandId,
                        categoryId:product.categoryId,
                        productVariant:variant
                    },
                    size:{
                        _id:sizeValue._id,
                        name:sizeValue.size
                    },
                    inventoryQuantity:inventoryQuantity

                }
            )
        }


        return {
            userId: input.userId,
            productList:productList
        }
    }


    async  pushToCart({
                                  userId,
                                  productVariantId,
                                  quantity,
                                  sizeId
                              }: {
        userId: string;
        productVariantId: string;
        quantity: number;
        sizeId: string;
    }) {


        // Проверяем, существует ли продукт с таким variantId
        const productExist = await ProductModel.findOne({
            "productVariant._id": productVariantId // фильтруем по конкретному variantId
        })

        if (!productExist) {
            throw new Error('Product variant not found');
        }

        const variant = productExist.productVariant.find((v) => v._id.equals(productVariantId));
        if (!variant) {
            throw new Error('Variant not found');
        }

        const sizeExist = await SizeTypeModel.findOne({
            categoryId: productExist.categoryId,
            genderId: productExist.genderId
        });

        if (!sizeExist) {
            throw new Error('Size type not found');
        }

        const sizeItem = sizeExist.sizes.find((size) => size._id.equals(sizeId));
        if (!sizeItem) {
            throw new Error('Size not found');
        }

        let cart = await CartModel.findOne({ userId: userId });

        if (cart) {
            // Корзина найдена, проверяем, существует ли уже товар с таким productVariantId
            const existingProduct = cart.productList.find(
                (item) => item.productVariantId.toString() === productVariantId
            );

            if (existingProduct) {
                // Если товар уже есть в корзине, увеличиваем его количество
                existingProduct.quantity = quantity;

                // Проверяем, чтобы количество не превышало лимит
                if (existingProduct.quantity > 10) {
                    throw new Error('Quantity cannot be more than 10');
                }

                // Сохраняем изменения в корзине
                await cart.save();
            } else {
                // Если товара нет в корзине, добавляем новый элемент
                cart.productList.push({
                    productVariantId: productVariantId, // Используем правильный ObjectId
                    sizeId: sizeId, // Используем правильный ObjectId
                    quantity: quantity,
                } as IProductSchema);

                // Сохраняем изменения в корзине
                await cart.save();
            }
        } else {
            // Если корзина не найдена, создаем новую
            cart = new CartModel({
                userId: userId,
                productList: [
                    {
                        productVariantId: productVariantId, // Используем правильный ObjectId
                        sizeId: sizeId, // Используем правильный ObjectId
                        quantity: quantity,
                    },
                ],
                createdAt: new Date(),
                modifiedAt: new Date(),
            });

            // Сохраняем новую корзину
            await cart.save();
        }

        return cart; // Возвращаем обновленную корзину
    }



// async cleanCart(input: { userId: string }): Promise<void> {
    //     let cartExist = await  CartModel.findOne({userId:input.userId})
    //     if(!cartExist) throw new Error('not found cart')
    //     cartExist.productList = []
    //     await cartExist.save()
    // }

    // async checkProduct(input: { sku: string; }):Promise<boolean> {
    //     const cartExist = await CartModel. findOne (
    //         {productList:{$elemMatch:{sku:input.sku}}})
    //     return cartExist !== null
    // }
}