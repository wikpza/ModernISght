import express, {NextFunction, Response} from "express";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole, checkUserRoles} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CreateGenderRequest} from "../dto/gender.dto";
import {BaseDiscountRequest} from "../dto/discount.dto";
import {DiscountRepository} from "../repositories/discount.repository";

const router = express.Router()


const discountRepository = new DiscountRepository()
router.post('/',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                BaseDiscountRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await discountRepository.setDiscount(
                {
                    discount:
                        {
                            name:req.body.name,
                            description:req.body.description,
                            percent:req.body.percent,
                            active:req.body.active,
                            beginAt:req.body.beginAt,
                            finishAt:req.body.finishAt
                    },
                    productId:req.body.productId
                }
            )

            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router