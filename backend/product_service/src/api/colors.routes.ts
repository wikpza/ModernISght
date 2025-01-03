import express, {NextFunction,  Request, Response} from "express";
import {ColorService} from "../services/color.service";
import {ColorRepository} from "../repositories/color.repository";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CreateColorRequest, UpdateColorRequest} from "../dto/color.dto";

const router = express.Router()


export const colorService = new ColorService(new ColorRepository())

router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        const {errors, input} = await RequestValidator(
            CreateColorRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)
        const data = await colorService.createColor(req.body)
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
                UpdateColorRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await colorService.updateColor({color:req.body, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/:id',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.id
            const data = await colorService.getColor(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data = await colorService.getColors()
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
            const data = await colorService.deleteColor(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

export default  router