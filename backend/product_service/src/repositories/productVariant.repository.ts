import {IProductVariantRepository} from "../interfaces/productVariantRepository.interface";
import {ProductVariant} from "../models/productVariant.model";
import ProductModel, {IProduct, IProductVariant} from "../database/schemas/product.schema";
import {ProductVariantService} from "../services/productVariant.service";
import {NotFoundError} from "../utils/error";
import ColorModel from "../database/schemas/colors.schema";
import mongoose, {mongo} from "mongoose";
import {createArrayWithUUIDs, generateSKU} from "../utils";
import {producerCreateInventory, producerDeletePictures, producerSentPictures} from "../api/broker/producer";
import SizeTypeModel from "../database/schemas/sizeType.schema";
import GenderModel from "../database/schemas/genders.schema";
import {InventoryRepository} from "./inventory.repository";
import InventoryModel from "../database/schemas/inventory.schema";
import InventorySessionModel from "../database/schemas/inventorySession.schema";
import PaymentModel from "../database/schemas/payment.schema";
import {Product} from "../models/product.model";
const inventoryService = new InventoryRepository()
export class ProductVariantRepository implements IProductVariantRepository{
    async add(input: { productId: string; productVariant: ProductVariant,files:Express.Multer.File[] }): Promise<IProduct> {

        const productExist = await ProductModel.findById(input.productId)
        if(!productExist) throw new NotFoundError('not found product')
        const colorExist = await ColorModel.findById(input.productVariant.colorId)
        if(!colorExist) throw new NotFoundError('not found color')
        const productSku = generateSKU()
        const skuProductExist = await ProductModel.findOne({'productVariant.sku': productSku})
        if(skuProductExist) throw new NotFoundError('sku must be unique')


        const newVariant: IProductVariant = {
            ...input.productVariant,
            sku:productSku,
            colorId: colorExist._id as mongoose.Types.ObjectId,
        } as IProductVariant;
        const numImages = input.files.length

        const sizesExist = await SizeTypeModel.findOne({categoryId:productExist.categoryId, genderId:productExist.genderId})

        if(!sizesExist || sizesExist.sizes.length === 0) throw new NotFoundError('not initializes the sizes of product')

        if(numImages!==0){
            try{
                const newImagesKey = createArrayWithUUIDs({id:(productExist._id as mongoose.Types.ObjectId).toString(), n:numImages})
                await producerSentPictures({files:input.files, keys:newImagesKey})
                newVariant.images = newImagesKey
            }catch (error){
                throw new NotFoundError('unable to save pictures')
            }
        }

        productExist.productVariant.push(newVariant)
        await productExist.save()

        const variant = productExist.productVariant.find((variant) =>  variant.sku === newVariant.sku);
        if (!variant) throw new NotFoundError('Product variant not found');

        await inventoryService.setSizes(sizesExist, variant._id)
        return productExist
    }
    async changeActive(input: { productId: string; variantId: string; newValue: boolean }): Promise<IProduct> {
        const product = await ProductModel.findById(input.productId);
        if (!product) throw new NotFoundError('Product not found');

        const variant = product.productVariant.find((variant) => variant._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (!variant) throw new NotFoundError('Product variant not found');

        Object.assign(variant, {active:input.newValue});

        await product.save();

        return {
            ...product.toObject(),
            productVariant: [variant]
        } as IProduct;
    }
    async changeAvailable(input: { productId: string; variantId: string; newValue: boolean }): Promise<IProduct> {
        const product = await ProductModel.findById(input.productId);
        if (!product) throw new NotFoundError('Product not found');

        const variant = product.productVariant.find((variant) => variant._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (!variant) throw new NotFoundError('Product variant not found');

        Object.assign(variant, {available:input.newValue});

        await product.save();

        return {
            ...product.toObject(),
            productVariant: [variant]
        } as IProduct;
    }
    async delete(input: { productId: string; variantId: string }): Promise<IProduct> {
        const product = await ProductModel.findById(input.productId);
        if (!product) throw new NotFoundError('Product not found');

        const variant = product.productVariant.find((variant) =>  variant._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (!variant) throw new NotFoundError('Product variant not found');


        /////////
        const paymentExist = await PaymentModel.find({productVariant:input.productId})
        if(paymentExist) throw new NotFoundError('unable delete, because that product has been bought')


        product.productVariant = product.productVariant.filter((variant) => ! variant._id.equals(new mongoose.Types.ObjectId(input.variantId)))
        InventoryModel.deleteMany({productVariantId:variant._id})
        InventorySessionModel.deleteMany({productVariantId:variant._id})
        await product.save()
        return {
            ...product.toObject(),
            productVariant: [variant]
        } as IProduct;
    }
    async get(input: { productId: string; variantId: string }): Promise<IProduct> {
        const product = await ProductModel.findById(input.productId);
        if (!product) throw new NotFoundError('Product not found');

        const variant = product.productVariant.find((variant) =>  variant._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (!variant) throw new NotFoundError('Product variant not found');

        return {
            ...product.toObject(),
            productVariant: [variant]
        } as IProduct;
    }
    async update(input: { productId: string; variantId: string; productVariant: ProductVariant, files:Express.Multer.File[] }): Promise<IProduct> {
        const productExist = await ProductModel.findById(input.productId);
        if (!productExist) throw new NotFoundError('Product not found');

        const variant = productExist.productVariant.find((variant) =>  variant._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (!variant) throw new NotFoundError('Product variant not found');

        const colorExist = await ColorModel.findById(input.productVariant.colorId)
        if(!colorExist) throw new NotFoundError('color not found')

        const numImages = input.files.length

        if((variant.images.length + numImages) > 8){
            throw new NotFoundError('product variant can not have more than 8 pictures')
        }

        let images = variant.images

        if(numImages!==0){
            try{
                const newImagesKey = createArrayWithUUIDs({id:(productExist._id as mongoose.Types.ObjectId).toString(), n:numImages})
                await producerSentPictures({files:input.files, keys:newImagesKey})
                images = images.concat(newImagesKey)
            }catch (error){
                throw new NotFoundError('unable to save pictures')
            }
        }


        Object.assign(variant,
            {
                colorId:colorExist._id,
                active:input.productVariant.active,
                available:input.productVariant.available,
                price:input.productVariant.price,
                images:images
            });

        await productExist.save();

        return{
                ...productExist.toObject(),
                productVariant: [variant]
            } as IProduct
    }

    async deletePictures(input: { productId: string; variantId: string; images: string[] }): Promise<IProduct> {
        const productExist = await ProductModel.findById(input.productId);
        if (!productExist) throw new NotFoundError('Product not found');

        const variant = productExist.productVariant.find((variant) =>  variant._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (!variant) throw new NotFoundError('Product variant not found');

        const checkValues = input.images.every((image)=>variant.images.includes(image))
        if(!checkValues) throw new NotFoundError('not found image with such name')

        const missingValue = variant.images.filter((image)=> !input.images.includes(image))

        console.log(input.images)
        console.log(missingValue)

        if(missingValue.length !==0){
            try{
                await producerDeletePictures(missingValue)
                variant.images = input.images;
                await productExist.save();
            }catch(error){
                throw new NotFoundError('unable to delete images')
            }
        }
        variant.images = input.images;
        await productExist.save();

        return{
            ...productExist.toObject(),
            productVariant: [variant]
        } as IProduct

    }

    async getProductByVariantId(productId: string, productVariantId: string)  {

        const product = await ProductModel.findOne({
            _id: productId,
            "productVariant._id": productVariantId // фильтруем по конкретному variantId
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
            throw new Error('Product not found');
        }

        // Возвращаем продукт с одним вариантом
        return product

    };


}