import {IProductRepository} from "../interfaces/productRepository.interface";
import ProductModel, {IProduct} from "../database/schemas/product.schema";
import {GetProducts, Product, ProductPrice, updateProduct} from "../models/product.model";
import BrandsModel from "../database/schemas/brands.schema";
import {NotFoundError} from "../utils/error";
import CategoryModel from "../database/schemas/category.schema";
import CollectionsModel from "../database/schemas/collections.schema";
import mongoose from "mongoose";
import GenderModel from "../database/schemas/genders.schema";
import SizeTypeModel from "../database/schemas/sizeType.schema";


export class ProductRepository implements IProductRepository {

    async  getOneById(id:string):Promise<IProduct>{
        const productExist = await ProductModel.findById(id)
            .populate('genderId', 'name')   // Подгружаем поле `name` из коллекции Gender
            .populate('collectionId', 'name')  // Подгружаем поле `name` из коллекции Collection
            .populate('categoryId', 'name') // Подгружаем поле `name` из коллекции Category
            .populate("brandId", "name")
        if(!productExist) throw new NotFoundError('not found product')
        return productExist
    }
    async getAdminProducts(): Promise<IProduct[]> {
        return ProductModel.find()
            .populate('genderId', 'name')   // Подгружаем поле `name` из коллекции Gender
            .populate('collectionId', 'name')  // Подгружаем поле `name` из коллекции Collection
            .populate('categoryId', 'name') // Подгружаем поле `name` из коллекции Category
            .populate("brandId", "name")
    }

    async changeActive(input: { id: string; newValue: boolean }): Promise<IProduct> {
        const updatedProduct = await ProductModel.findOneAndUpdate(
            { _id: input.id },
            { active: input.newValue },
            { new: true }
        ).exec();
        if (!updatedProduct) {
            throw new NotFoundError('Product not found');
        }
        return updatedProduct;

    }
    async create(input: Product): Promise<IProduct> {
        const brandExist = await BrandsModel.findById(input.brandId)
        if(!brandExist) throw new NotFoundError('not found brand with such id')

        const categoryExist = await CategoryModel.findById(input.categoryId)
        if(!categoryExist) throw new NotFoundError('not found category with such id')

        const collectionExist = await CollectionsModel.findById(input.collectionId)
        if(!collectionExist) throw new NotFoundError('not found collection with such id')

       const genderExist = await GenderModel.findById(input.genderId).exec()
        if(!genderExist) throw new NotFoundError('not found gender with such id')

        const sizeTypeExist = await SizeTypeModel.findOne({genderId:genderExist._id, categoryId:categoryExist._id})
        if(!sizeTypeExist) throw new NotFoundError(`before create product, add sizes for that ${genderExist.name} and ${categoryExist.name}`)

        const cleanedDictionaryFeature = Object.fromEntries(
            Object.entries(input.features)  // Преобразуем объект в массив пар [key, value]
                .map(([key, value]) => [key, value.trim()])  // Убираем пробелы в начале и в конце
                .filter(([key, value]) => {

                    if (value === "") {
                        throw new NotFoundError('value of product feature can not be empty')
                    }
                    return true;  // Оставляем только те пары, где значение не пустое
                })
        );

        return await ProductModel.create(
            {
                ...input,
                collectionId:collectionExist._id,
                brandId:brandExist._id,
                categoryId:categoryExist._id,
                genderId:genderExist._id,
                features: cleanedDictionaryFeature,
                productVariant:[]
            })
    }
    async delete(id: string): Promise<IProduct> {
        const productExist = await ProductModel.findById(id)
        if(!productExist){
            throw new NotFoundError('Product not found');
        }
        if(productExist.productVariant.length !==0 ) throw new NotFoundError('delete all product variant before deleting product')
        return productExist
    }







    async getMany(input: {
        colors: string[],  // Список цветов
        brands: string[],  // Список брендов
        collections: string[],  // Список коллекций
        gender: string[],  // Список полов
        category: string[],  // Список категорий
        priceMore: number,  // Минимальная цена
        priceLess: number,  // Максимальная цена
        sortBy: string,  // Поле для сортировки
        sortType: string,  // Направление сортировки (asc, desc)
        page: number,  // Текущая страница
        limit: number  // Количество элементов на странице
    }): Promise<IProduct[]> {

        // Стартуем с базового запроса
        const query: any = {};

        // Фильтрация по цветам, брендам, коллекциям, полу, категориям
        if (input.colors && input.colors.length > 0) {
            query["productVariant.colorId"] = { $in: input.colors };
        }

        if (input.brands && input.brands.length > 0) {
            query["brandId"] = { $in: input.brands.map(brand => new mongoose.Types.ObjectId(brand)) };
        }
        if (input.collections && input.collections.length > 0) {
            query["collectionId"] = { $in: input.collections.map(collection => new mongoose.Types.ObjectId(collection)) };
        }
        if (input.gender && input.gender.length > 0) {
            query["genderId"] = { $in: input.gender.map(gender => new mongoose.Types.ObjectId(gender)) };
        }
        if (input.category && input.category.length > 0) {
            query["categoryId"] = { $in: input.category.map(category => new mongoose.Types.ObjectId(category)) };
        }
        if (input.priceMore !== undefined) {
            query["productVariant.price"] = { $gte: input.priceMore };
        }
        if (input.priceLess !== undefined) {
            query["productVariant.price"] = { $lte: input.priceLess };
        }

        // Сортировка
        const sortOptions: any = {};
        if (input.sortBy && input.sortType) {
            const sortDirection = input.sortType === "asc" ? 1 : -1;

            // Если сортировка по цене и рейтингу
            if (input.sortBy === "price") {
                sortOptions["price"] = sortDirection;
            }
            // Если сортировка по рейтингу
            if (input.sortBy === "rating") {
                sortOptions["rating"] = sortDirection;
            }
        }

        // Пагинация
        const skip = (input.page - 1) * input.limit;

        // Массив агрегации
        const aggregatePipeline = [
            // 1. Применяем фильтры
            { $match: query },

            // 2. Добавляем поле colorIds, которое будет содержать все уникальные colorId
            {
                $addFields: {
                    colorIds: { $map: {
                            input: "$productVariant",
                            as: "variant",
                            in: "$$variant.colorId"
                        }}
                }
            },

            // 3. Убираем дубликаты из colorIds
            {
                $addFields: {
                    colorIds: { $setUnion: ["$colorIds", "$colorIds"] }
                }
            },

            // 4. Добавляем поле price для сортировки (используем цену первого варианта)
            {
                $addFields: {
                    price: { $arrayElemAt: ["$productVariant.price", 0] }
                }
            },

            // 5. Применяем сортировку
            {
                $sort: sortOptions
            },

            // 6. Пагинация
            {
                $skip: skip
            },

            {
                $limit: input.limit
            },

            // 7. Выполняем lookup для бренда
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandId',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            // Извлекаем первый элемент из массива brand
            {
                $addFields: {
                    brand: { $arrayElemAt: ["$brand", 0] }
                }
            },

            // 8. Выполняем lookup для категории
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            // Извлекаем первый элемент из массива category
            {
                $addFields: {
                    category: { $arrayElemAt: ["$category", 0] }
                }
            },

            // 9. Выполняем lookup для пола (gender)
            {
                $lookup: {
                    from: 'genders',
                    localField: 'genderId',
                    foreignField: '_id',
                    as: 'gender'
                }
            },
            // Извлекаем первый элемент из массива gender
            {
                $addFields: {
                    gender: { $arrayElemAt: ["$gender", 0] }
                }
            },

            // 10. Выполняем lookup для коллекции
            {
                $lookup: {
                    from: 'collections',
                    localField: 'collectionId',
                    foreignField: '_id',
                    as: 'collection'
                }
            },

            // 11. Выполняем lookup для цветов
            {
                $lookup: {
                    from: 'colors',
                    localField: 'colorIds',
                    foreignField: '_id',
                    as: 'colors'
                }
            },

            // 12. Проекция (если нужно скрыть лишние поля)
            {
                $project: {
                    "brandId": 0,
                    "categoryId": 0,
                    "collectionId": 0,
                    "genderId": 0,
                    "productVariant.colorId": 0,
                }
            }
        ];

        // Выполнение агрегации
        const products = await ProductModel.aggregate(aggregatePipeline);

        return products;
    }


    async setPreferred(input: { productId: string; variantId: string }): Promise<IProduct> {
        const product = await ProductModel.findById(input.productId).exec();
        if (!product) {
            throw new NotFoundError('Product not found');
        }
        const index = product.productVariant.findIndex(value => value._id.equals(new mongoose.Types.ObjectId(input.variantId)));
        if (index === -1) {
            throw new NotFoundError('variant of product not found');
        }
        const [valueToMove] = product.productVariant.splice(index, 1);
        product.productVariant.unshift(valueToMove);
        return await product.save();
    }
    async update(input: { id: string; product: updateProduct }): Promise<IProduct> {

        const productExist = await ProductModel.findById(input.id)
        if(!productExist) throw new NotFoundError('not fount product')

        if(!productExist.brandId.equals(input.product.brandId)){
            const brandExist = await BrandsModel.findById(input.product.brandId)
            if(!brandExist) throw new NotFoundError('not found brand with such id')
            productExist.brandId = brandExist._id  as mongoose.Types.ObjectId
        }


        if(!productExist.collectionId.equals(input.product.collectionId)){
            const collectionExist = await CollectionsModel.findById(input.product.collectionId)
            if(!collectionExist) throw new NotFoundError('not found collection with such id')
            productExist.collectionId = collectionExist._id  as  mongoose.Types.ObjectId
        }


        if(productExist.name !== input.product.name ) productExist.name = input.product.name
        productExist.features = input.product.features
        await productExist.save()
        return productExist
    }

    async getProductPrice(products: string[]): Promise<ProductPrice[]> {
        const productsList: ProductPrice[] = [];

        for (const productSku of products) {  // Используем for...of для перебора элементов массива
            // Ищем продукт по sku среди всех вариантов товара
            const productExist = await ProductModel.findOne({ "productVariant.sku": productSku }).exec();
            if(!productExist ) throw new NotFoundError('not found product with such sku')

            const productVariant = productExist.productVariant.find(variant => variant.sku === productSku);
            if(!productVariant ) throw new NotFoundError('not found product with such sku')

            let price:number = productVariant.price
            if(productVariant.discountInfo.active){

                price = Math.floor(price - productVariant.discountInfo.percent * 100 / price)
            }

            productsList.push({
                sku: productSku,
                price: price})

        }

        return productsList;
    }


}