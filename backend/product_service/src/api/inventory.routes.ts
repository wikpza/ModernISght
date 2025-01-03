import express, {NextFunction, Request, Response} from "express";
import {InventoryRepository} from "../repositories/inventory.repository";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole, checkUserRoles} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {ChangeNumberProduct} from "../dto/inventory.dto";


const router = express.Router()
const inventoryService = new InventoryRepository()


router.get(
    '/:id',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:Request, res:Response, next:NextFunction)=> {
        try {
            const id = req.params.id
            const data = await inventoryService.get(id)
            return res.status(200).json(data)
        } catch (error) {
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }
)

router.get(
    '/:id/count',
    async(req:Request, res:Response, next:NextFunction)=> {
        try {
            const id = req.params.id
            const data = await inventoryService.getUser(id)
            return res.status(200).json(data)
        } catch (error) {
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }
)

router.patch('/change',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                ChangeNumberProduct,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const data = await inventoryService.changeNumberInventory(
                {
                    productId:req.body.productId,
                    quantity:req.body.quantity,
                    sizeId:req.body.sizeId,
                    userId:req.user?._id?.toString() || "",
                    type:req.body.type
                })
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/session/:productId',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
            const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
            const productId = req.params.productId
            const token = req.token
            if(!token) return res.status(500).json("not authorized")

            const data = await inventoryService.getHistoryInventory(
                {
                    productId:productId,
                    token:token,
                    limit:limit,
                    page:page
                }
            )
            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router
//
// router.get(
//     '/admin',
//     checkTokenJWT,
//     checkUserRole('admin'),
//     async(req:Request, res:Response, next:NextFunction)=>{
//         try{
//
//             const {errors, input} = await RequestValidator(
//                 AddInventoryRequest,
//                 req.body)
//
//             if(errors) return res.status(400).json(errors)
//
//             const data = await inventoryService.getSizesAdmin(req.body)
//             return res.status(200).json(data)
//         }catch(error){
//             const err = error as Error
//             return res.status(500).json(err.message)
//         }
//     })
//
//
//

// router.patch('/buy/:sku',
//     checkTokenJWT,
//     checkUserRole('admin'),
//     async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
//         try{
//             const {errors, input} = await RequestValidator(
//                 ReduceInventoryRequest,
//                 req.body
//             )
//             if(errors) return res.status(400).json(errors)
//             const sku = req.params.sku
//             const data = await inventoryService.reduceQuantity({sku:sku,quantity:req.body.quantity, sizeId:req.body.sizeId})
//             return res.status(200).json(data.sizes)
//         }catch(error){
//             const err = error as Error
//             return res.status(500).json(err.message)
//         }
// })
//
// router.patch('/refund/:sku',
//     checkTokenJWT,
//     // allowOnlyLocalhost,
//     async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
//         try{
//             const {errors, input} = await RequestValidator(
//                 RefundInventoryRequest,
//                 req.body
//             )
//             if(errors) return res.status(400).json(errors)
//             const sku = req.params.sku
//             const data = await inventoryService.refundProduct({sku:sku,quantity:req.body.quantity, sizeId:req.body.sizeId})
//             return res.status(200).json(data.sizes)
//         }catch(error){
//             const err = error as Error
//             return res.status(500).json(err.message)
//         }
//     })
//
//
// export default router