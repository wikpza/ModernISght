
import express, {NextFunction, Response, Request} from "express";
import {GenderRepository} from "../repositories/gender.repository";
import {GenderService} from "../services/gender.service";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CreateBrandRequest, UpdateBrandRequest} from "../dto/brand.dto";
import {CreateGenderRequest, UpdateGenderRequest} from "../dto/gender.dto";
const router = express.Router()

const genderService = new GenderService(new GenderRepository)

router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        const {errors, input} = await RequestValidator(
            CreateGenderRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)
        const data = await genderService.createGender(req.body)
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
                UpdateGenderRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await genderService.updateGender({gender:req.body, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data = await genderService.getGenders()
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
            const data = await genderService.getGender(name)
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
            const data = await genderService.deleteGender(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router