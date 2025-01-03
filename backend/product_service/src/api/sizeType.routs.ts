import express, {NextFunction, Response, Request} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {SizeTypeService} from "../services/sizeType.service";
import {SizeTypeRepository} from "../repositories/sizeType.repository";
import {AddSizeTypeRequest, CreateSizeTypeRequest, DeleteTypeRequest, UpdateSizeTypeRequest} from "../dto/sizeType.dto";

const router = express.Router()

const sizeTypeService = new SizeTypeService(new SizeTypeRepository())

router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                CreateSizeTypeRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await sizeTypeService.creatSizeType(req.body)
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
            const {errors, input} = await RequestValidator(
                UpdateSizeTypeRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const id = req.params.id
            const data = await sizeTypeService.updateOneSizeValue({newValue:req.body.newValue, sizeId:req.body.sizeId, id:id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.patch('/add/:id',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.id
            const {errors, input} = await RequestValidator(
                AddSizeTypeRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await sizeTypeService.addSizeType({newValue:req.body.newValue, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.get('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const data = await sizeTypeService.getSizes()
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/:gender/:categoryName',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const gender = req.params.gender
            const categoryName = req.params.categoryName
            const data = await sizeTypeService.getSizeType({gender, categoryName})
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
            const data = await sizeTypeService.deleteSizeType(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.delete('/delete/:id',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                DeleteTypeRequest,
                req.body
            )
            const id = req.params.id
            if(errors) return res.status(400).json(errors)
            const data = await sizeTypeService.deleteSizeValue({id,sizeId:req.body.sizeId})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })



export default router