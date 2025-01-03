import express, {NextFunction, Response, Request} from "express";
import {FeatureService} from "../services/feature.service";
import {FeatureRepository} from "../repositories/feature.repository";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";


const router = express.Router()

const featureService = new FeatureService(new FeatureRepository())

router.get('/:categoryId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.name
            const data = await featureService.getFeatures(id)
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


export default router