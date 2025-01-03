import express, {NextFunction, Response, Request} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";

import {CreateBrandRequest, UpdateBrandRequest} from "../dto/brand.dto";
import {BrandService} from "../services/brand.service";
import {BrandRepository} from "../repositories/brand.repository";

const router = express.Router()

const brandService = new BrandService(new BrandRepository())

router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                CreateBrandRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await brandService.creatBrand(req.body)
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
                UpdateBrandRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await brandService.updateBrand({brand:req.body, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.get('/',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data = await brandService.getBrands()
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/:name',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const name = req.params.name
            const data = await brandService.getBrand(name)
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
            const data = await brandService.deleteBrand(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router