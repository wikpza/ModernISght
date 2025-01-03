import {ProductVariantService} from "../services/productVariant.service";
import {ProductVariantRepository} from "../repositories/productVariant.repository";
import express, {NextFunction, Response} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {
    CreateProductVariantRequest,
    DeletePicturesRequest,
    UpdateStatusProductVariantRequest
} from "../dto/productVariant.dto";
import {uploadHandlers} from "./middlewares/pictures.middlewares";

import {validateAddProductVariantRequest, validateUpdateProductVariantRequest} from "./middlewares/validation.request";


const productVariant = new ProductVariantService(new ProductVariantRepository())
const productRepository = new  ProductVariantRepository()
const router = express.Router()


router.post('/:productId/variant/add',
    uploadHandlers,
    checkTokenJWT,
    checkUserRole('admin'),
    validateAddProductVariantRequest,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        const productId:string = req.params.productId
        const files = req.files as Express.Multer.File[]
        const data =  await productVariant.addProductVariant({productId, productVariant:req.body, files})
        return res.status(200).json(data)
    }catch(error){
        const err = error as Error
        return res.status(500).json(err.message)
    }
    })

router.patch('/:productId/variant/active/:variantId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId
            const {errors, input} = await RequestValidator(
                UpdateStatusProductVariantRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data =  await productVariant.changeActive({productId, variantId, newValue:req.body.newValue})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.patch('/:productId/variant/available/:variantId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId
            const {errors, input} = await RequestValidator(
                UpdateStatusProductVariantRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data =  await productVariant.changeAvailable({productId, variantId, newValue:req.body.newValue})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.delete('/:productId/variant/picture/:variantId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId

            const {errors, input} = await RequestValidator(
                DeletePicturesRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data =  await productVariant.deletePictures({productId, variantId, images:req.body.images})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.delete('/:productId/variant/:variantId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId

            const data =  await productVariant.deleteProductVariant({productId, variantId})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
router.get('/:productId/variant/:variantId',
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId

            const data =  await productVariant.getProductVariant({productId, variantId})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/:productId/variant/id/:variantId',
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId

            const data =  await productRepository.getProductByVariantId(productId, variantId)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.patch('/:productId/variant/:variantId',
    uploadHandlers,
    checkTokenJWT,
    checkUserRole('admin'),
    validateUpdateProductVariantRequest,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const productId = req.params.productId
            const variantId = req.params.variantId
            const files = req.files as Express.Multer.File[]
            const product =  await productVariant.update({productId, variantId, productVariant:req.body, files})
            return res.status(200).json(product)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })




export default router