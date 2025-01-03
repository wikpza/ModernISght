import {NextFunction, Response, Router} from "express";
import {PaymentRepository} from "../repositories/payment.repository";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole, checkUserRoles} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {ChangeShippingStatusPaymentRequest, ChangeStatusPaymentRequest, CreatePaymentRequest} from "../dto/payment.dto";
import {CreateProductRequest} from "../dto/product.dto";



const router = Router()
const paymentService = new PaymentRepository()
const paymentRepository = new PaymentRepository()

// router.post('/',
//     checkTokenJWT,
//     checkUserRole('admin'),
//     async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
//         try{
//             const {errors, input} = await RequestValidator(
//                 CreatePaymentRequest,
//                 req.body
//             )
//             if(errors) return res.status(400).json(errors)
//
//             const data = await paymentService (
//                 {
//                     userId:req.body.userId,
//                     cardNumber: req.body.cardNumber.toString() || "",
//                     addressId: req.body.addressId || "",
//                     shippingStatus:req.body.shippingStatus,
//                 }
//             )
//             return res.status(200).json(data)
//         }catch(error){
//             const err = error as Error
//             return res.status(500).json(err.message)
//         }
//     })

router.post('/',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                CreatePaymentRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)

            const userId = req.user?._id
            const token = req.token

            if( !userId || !token) return res.status(500).json("not authorized")
            const data = await paymentRepository.createPayment(
                {
                    userId:userId.toString(),
                    token:token,
                    cardId:req.body.cardId,
                    addressId:req.body.addressId || "",
                    status:req.body.status,
                    shippingStatus:req.body.shippingStatus
                }
            )

            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.post('/status',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                ChangeStatusPaymentRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const userId = req.user?._id
            if(!userId) return res.status(500).json("not auth")
            const data = await paymentRepository.changeStatus(
                {
                   paymentId:req.body.paymentId,
                    newStatus:req.body.status,
                    userId:userId.toString()
                }
            )

            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
router.post('/shipping/status',
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {errors, input} = await RequestValidator(
                ChangeShippingStatusPaymentRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            console.log(req.body.shippingStatus)
            const data = await paymentRepository.changeShippingStatus(
                {
                    paymentId:req.body.paymentId,
                    newStatus:req.body.shippingStatus
                }
            )

            return res.status(200).json(data)
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get("/",
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        const userId = req.user?._id
        if( !userId ) return res.status(500).json("not authorized")
        const data = await paymentRepository.getPayments({userId:userId.toString()})
        return res.status(200).json(data)
    })

router.get("/admin",
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{

        const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
        const {shippingStatus, status, searchId} = req.query
        const token = req.token
        if(!token) return res.status(500).json("not auth")
        const data = await paymentRepository.getAdminPayments({page, limit, searchId:searchId?.toString() || "", shippingStatus:shippingStatus?.toString() || "", status:status?.toString() || "", token})
        return res.status(200).json(data)
    })

router.get("/admin/static",
    checkTokenJWT,
    checkUserRoles(["admin", 'employer']),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        const {shippingStatus, status, searchId, fromDate, toDate, categoryId, collectionId, genderId, brandId} = req.query
        const token = req.token
        if(!token ) return res.status(500).json("not auth")
        const data = await paymentRepository.getAdminPaymentsStatic({ toDate:toDate?.toString() || "",
            searchId:searchId?.toString() || "",
            brandId:brandId?.toString() || "",
            categoryId:categoryId?.toString() || "",
            genderId:genderId?.toString() || "",
            collectionId:collectionId?.toString() || "",
            fromDate:fromDate?.toString() || "",
            shippingStatus:shippingStatus?.toString() || "",
            status:status?.toString() || "", token})
        return res.status(200).json(data)
    })

// router.get('/',
//     checkTokenJWT,
//     checkUserRole('admin'),
//     async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
//         try{
//             const {errors, input} = await RequestValidator(
//                 FindPaymentRequest,
//                 req.body
//             )
//             if(errors) return res.status(400).json(errors)
//             const data = await paymentService.getPaymentsAdmin(
//                 {
//                     userId:req.body.userId || [],
//                     status:req.body.status || [],
//                     cardNumber: req.body.cardNumber.toString() || [],
//                     shippingStatus:req.body.shippingStatus || [],
//                     fromDate: req.body.fromDate,
//                     toDate:req.body.toDate,
//                     sku:req.body.sku || [],
//                     offset:req.body.offset || 10,
//                     page:req.body.page || 1
//                 }
//             )
//             return res.status(200).json(data)
//         }catch(error){
//             const err = error as Error
//             return res.status(500).json(err.message)
//         }
//     })
export default router