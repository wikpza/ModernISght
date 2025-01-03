import express, {NextFunction, Response, Request} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CollectionService} from "../services/collection.service";
import {CollectionRepository} from "../repositories/collection.repository";
import {CreateCollectionRequest, UpdateCollectionRequest} from "../dto/collection.dto";

const router = express.Router()

const collectionService = new CollectionService(new CollectionRepository())

router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                CreateCollectionRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await collectionService.creatCollection(req.body)
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
                UpdateCollectionRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await collectionService.updateCollection({collection:req.body, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.get('/',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data = await collectionService.getCollections()
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
            const data = await collectionService.getCollection(name)
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
            const data = await collectionService.deleteCollection(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router