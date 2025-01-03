import express, {NextFunction, Response, Request} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole, checkUserRoles} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";

import { UpdateBrandRequest} from "../dto/brand.dto";
import {ProductService} from "../services/product.service";
import {ProductRepository} from "../repositories/product.repository";
import {
    ChangeActiveRequest,
    CreateProductRequest,
    GetProductPriceRequest, GetProductsRequest,
    UpdateProductRequest
} from "../dto/product.dto";
import GenderModel from "../database/schemas/genders.schema";
import CategoryModel from "../database/schemas/category.schema";
import ProductModel from "../database/schemas/product.schema";

const router = express.Router()

const productService = new ProductService(new ProductRepository())
const productRepository = new ProductRepository()

router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                CreateProductRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await productService.createProduct(req.body)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.patch('/:id',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.id
            const {errors, input} = await RequestValidator(
                UpdateProductRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await productService.updateProduct({product:req.body, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Получаем параметры из строки запроса
        const { colors, brands, collections, gender, categories, priceMore, priceLess, sortBy, sortType, page, limit } = req.query;

        // Преобразуем массивы (если они были переданы как строки JSON)
        const parsedColors: string[] = colors ? JSON.parse(colors as string) : [];
        const parsedBrands: string[] = brands ? JSON.parse(brands as string) : [];
        const parsedCollections: string[] = collections ? JSON.parse(collections as string) : [];
        const parsedGender: string[] = gender ? JSON.parse(gender as string) : [];
        const parsedCategories: string[] = categories ? JSON.parse(categories as string) : [];

        // Преобразуем другие параметры (если они есть)
        const parsedPriceMore = priceMore ? parseFloat(priceMore as string) : 0;
        const parsedPriceLess = priceLess ? parseFloat(priceLess as string) : 1000;

        // Получаем параметры пагинации
        const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
        const parsedLimit = limit ? parseInt(limit as string, 10) : 10;  // Лимит (по умолчанию 10)

        // Сформируем объект для передачи в репозиторий
        const filterParams = {
            colors: parsedColors,
            brands: parsedBrands,
            collections: parsedCollections,
            gender: parsedGender,
            category: parsedCategories,
            priceMore: parsedPriceMore,
            priceLess: parsedPriceLess,
            sortBy: sortBy as string,
            sortType: sortType as string,
            page: parsedPage,
            limit: parsedLimit
        };

        // Получаем данные из репозитория
        const data = await productRepository.getMany(filterParams);

        return res.status(200).json(data);
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: err.message });
    }
});


router.get('/random', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Получаем параметры из строки запроса
        const { gender, category } = req.query;

        // Проверяем, если параметры присутствуют, то получаем их как строки
        const parsedGender: string = gender ? gender as string : '';  // Ожидаем строку
        const parsedCategory: string = category ? category as string : '';  // Ожидаем строку

        // Получаем _id для gender и category по их name
        const genderId = parsedGender ? await GenderModel.findOne({ name: parsedGender }).select('_id') : null;
        const categoryId = parsedCategory ? await CategoryModel.findOne({ name: parsedCategory }).select('_id') : null;

        // Формируем параметры для фильтрации
        const filterParams: any = {};


        if (genderId) {
            filterParams.genderId = genderId._id;  // Добавляем фильтрацию по genderId
        }

        if (categoryId) {
            filterParams.categoryId = categoryId._id;  // Добавляем фильтрацию по categoryId
        }

        // Выполняем агрегацию для случайной выборки 10 записей
        const data = await ProductModel.aggregate([
            { $match: filterParams },  // Фильтруем по genderId и categoryId
            { $sample: { size: 10 } },  // Выбираем случайные 10 записей
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandId',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $addFields: {
                    brand: { $arrayElemAt: ["$brand", 0] }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ["$category", 0] }
                }
            },
            {
                $lookup: {
                    from: 'collections',
                    localField: 'collectionId',
                    foreignField: '_id',
                    as: 'collection'
                }
            },
            {
                $lookup: {
                    from: 'collections',
                    localField: 'collectionId',
                    foreignField: '_id',
                    as: 'collection'
                }
            },
            {
                $lookup: {
                    from: 'genders',
                    localField: 'genderId',
                    foreignField: '_id',
                    as: 'gender'
                }
            },
            {
                $addFields: {
                    gender: { $arrayElemAt: ["$gender", 0] }
                }
            },
            {
                $lookup: {
                    from: 'colors',
                    localField: 'colorIds',
                    foreignField: '_id',
                    as: 'colors'
                }
            },
            // Преобразуем массивы в одиночные объекты, так как мы ожидаем только один объект
            {
                $project: {
                    "brandId": 0,
                    "categoryId": 0,
                    "collectionId": 0,
                    "genderId": 0,
                    "productVariant.colorId": 0,
                }
            }
        ]);

        return res.status(200).json(data);
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: err.message });
    }
});


router.get('/price/sku',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{

            const {errors, input} = await RequestValidator(
                GetProductPriceRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)

            const data = await productService.getProductPrice(req.body.products)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.get('/admin',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data = await productService.getAdminProducts()
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.delete('/:id',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.id
            const data = await productService.deleteProduct(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.patch('/:productId/preferred/:variantId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId
            const data = await productService.setPreferred({productId, variantId})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.patch('/active/:id',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                ChangeActiveRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const id = req.params.id
            const data = await productService.changeActive({id, newValue:req.body.newValue})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/:productId',
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.productId

            const data =  await productService.getOneById(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router