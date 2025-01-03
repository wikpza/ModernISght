import express, {NextFunction, Request, Response} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CategoryService} from "../services/category.service";
import {CategoryRepository} from "../repositories/category.repository";
import {CreateCategoryRequest, UpdateCategoryRequest} from "../dto/category.dto";


const router = express.Router()

const categoryService = new CategoryService(new CategoryRepository())
router.post('/',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                CreateCategoryRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await categoryService.creatCategory(req.body)
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
                UpdateCategoryRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await categoryService.updateCategory({category:req.body, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.get('/',
    async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const data = await categoryService.getCategories()
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
            const data = await categoryService.getCategory(name)
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
            const data = await categoryService.deleteCategory(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router