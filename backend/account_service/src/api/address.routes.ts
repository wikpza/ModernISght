import express, {json, NextFunction, Request, Response} from "express";
import {AddressService} from "../services/address.service";
import {AddressRepository} from "../repository/address.repository";
import {RequestValidator} from "../utils/requestValidator";
import {CreateAddressRequest, UpdateAddressRequest} from "../dto/addresses.dto";
import {AuthenticatedRequest, checkTokenJWT} from "./middlewares/user.middlewares";


const router = express.Router()

export const addressService = new AddressService(new AddressRepository())

router.post('/',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user) return res.status(400).json({message:"not found user"})

        const {errors, input} = await RequestValidator(
            CreateAddressRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)
        const data = await addressService.createAddress({user:req.user,address:req.body})
        return res.status(201).json({addresses:data.addresses})
    }catch (error){
        const err = error as Error
        return res.status(500).json(err.message)
    }
})

router.patch(
    '/:id',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.id
            if(!req.user) return res.status(400).json({message:"not found user"})

            const {errors, input} = await RequestValidator(
                UpdateAddressRequest,
                req.body
            )

            if(errors) return res.status(400).json(errors)
            const data = await addressService.updateAddress(
                {user:req.user,
                        address: req.body,
                        _id:id})

            return res.status(200).json({addresses:data.addresses})
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }
)

router.patch(
    '/preferred/:id',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const id = req.params.id
            if(!req.user) return res.status(400).json({message:"not found user"})

            const data = await addressService.setPreferred({user:req.user,_id:id})
            return res.status(200).json(data.addresses)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }
)

router.get(
    '/',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return res.status(400).json({message:"not found user"})

            const data = await addressService.getAddresses(req.user)
            return res.status(200).json(data.addresses)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }
)

router.get(
    '/:id',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return res.status(400).json({message:"not found user"})
            const id = req.params.id
            const data = await addressService.getAddress({user:req.user, id})
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }
)


router.delete(
    '/:id',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return  res.status(400).json('invalid token')
            const id = req.params.id

            const data = await addressService.deleteAddress({user:req.user, id});
            return res.status(200).json({addresses:data.addresses});
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router