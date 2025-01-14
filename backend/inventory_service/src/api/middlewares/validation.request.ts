import {NextFunction, Response, Request} from "express";
import {AuthenticatedRequest} from "./user.middlewares";
import {body, validationResult} from "express-validator";

const handlerValidationErrors = async(
    req:Request | AuthenticatedRequest,
    res:Response,
    next:NextFunction
)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

export const validateAddProductVariantRequest = [
     body('colorId').isMongoId().withMessage('colorId must be a valid MongoDB ObjectId'),
     body('price').isNumeric().withMessage('price must be number'),
     body('active').isBoolean().withMessage('active must be boolean'),
     body('available').isBoolean().withMessage('available must be boolean'),
    handlerValidationErrors
]

export const validateUpdateProductVariantRequest = [
    body('colorId').isMongoId().withMessage('colorId must be a valid MongoDB ObjectId'),
    body('price').isNumeric(),
    body('active').isBoolean(),
    body('available').isBoolean(),
    handlerValidationErrors
]