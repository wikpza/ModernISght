import express, {NextFunction, Response} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CreateBrandRequest} from "../dto/brand.dto";
import {CartRepository} from "../repositories/cart.repository";
import {UpdateProductRequest} from "../dto/product.dto";
import {AddCartRequest, DeleteCartRequest} from "../dto/cart.dto";

const router = express.Router()
const cartRepository = new CartRepository()
router.get('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const userId = req.user?._id
            if(!userId) return res.status(500).json('not authorized')
            const data = await cartRepository.get({userId:userId.toString()})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.post('/',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const userId = req.user?._id
            if(!userId) return res.status(500).json('not authorized')

            const {errors, input} = await RequestValidator(
                AddCartRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)

            const data = await cartRepository.pushToCart(
                {
                    userId:userId.toString(),
                    productVariantId:req.body.productId,
                    quantity:req.body.quantity,
                    sizeId:req.body.sizeId
                })
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.delete('/:productId/:sizeId',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const userId = req.user?._id
            if(!userId) return res.status(500).json('not authorized')

            const {productId, sizeId} = req.params

            const data = await cartRepository.delete(
                {
                    userId:userId.toString(),
                    productId:productId,
                    sizeId:sizeId
                })
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


export default router