import express, {NextFunction, Response} from "express";
import {AdminService} from "../services/admin.service";
import {AdminRepository} from "../repository/admin.repository";
import {AuthenticatedRequest, checkTokenJWT, checkUserRole} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {ChangeStatusRequest, GetUsersRequest} from "../dto/admin.dto";
import {UserModel} from "../database/schemas/user";

const router = express.Router()
export const adminService = new AdminService(new AdminRepository())

router.get('/user',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;


        try{
            const queryData = {...req.query, page:page, limit:limit}
            const {errors, input} = await RequestValidator(
                GetUsersRequest,
                queryData
            )
            if(errors) return res.status(400).json(errors)

            const  data = await adminService.getUsers(queryData)
            const userList = data.data.map((value) => ({
                _id:value._id,
                lastName: value.lastName,
                firstName: value.firstName,
                email:value.email,
                role:value.role,
                phoneNumber:value.phoneNumber
            }));
            return res.status(201).json({user:userList, totalPage:data.totalPages})
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/user/role/static',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const adminNumber = await UserModel.countDocuments({role:"admin"})
            const userNumber = await UserModel.countDocuments({role:"user", active:true})
            const unVerifyUser = await UserModel.countDocuments({role:"user", active:false})

            const employerNumber = await UserModel.countDocuments({role:"employer"})

            return res.status(201).json({adminNumber, userNumber, employerNumber, unVerifyUser})
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
router.get('/user/role/count/static',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            let { fromDate, toDate} = req.query
            const filter: Record<string, any> = {};

            fromDate = fromDate?.toString()
            toDate = toDate?.toString()

            if (fromDate && fromDate !== "" && toDate && toDate !== "") {

                const fromDateObj = new Date(fromDate);
                const toDateObj = new Date(toDate);

                if (!isNaN(fromDateObj.getTime()) && !isNaN(toDateObj.getTime())) {
                    filter.createdAt = { $gte: fromDateObj, $lte: toDateObj };
                } else {
                    throw new Error("Invalid date format");
                }
            }

            const data = await UserModel.find(filter)

            // Шаг 1: Типизация для аккумулятора
            interface CountByDate {
                [date: string]: number;
            }

// Шаг 2: Преобразуем дату регистрации (без времени) и подсчитаем пользователей
            const countUsersByDate = data.reduce<CountByDate>((acc, user) => {
                // Извлекаем только дату (без времени)
                const date = new Date(user.createdAt).toISOString().split('T')[0];

                // Если дата уже есть в аккумуляторе, увеличиваем счетчик, иначе создаем новую запись
                if (acc[date]) {
                    acc[date]++;
                } else {
                    acc[date] = 1;
                }

                return acc;
            }, {});

// Шаг 3: Преобразуем объект с подсчетами в массив
            const result = Object.keys(countUsersByDate).map(date => ({
                date,
                count: countUsersByDate[date],
            }));

            return res.status(201).json({data:result})

        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })


router.patch('/user/:userId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {userId} = req.params
            const {errors, input} = await RequestValidator(
                ChangeStatusRequest,
                { ...req.body, userId:userId}
            )
            if(errors) return res.status(400).json(errors)
            const data = await adminService.changeStatus({ ...req.body, userId:userId})
            return res.status(201).json({user:data})
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
router.get('/user/:userId',
    checkTokenJWT,
    checkUserRole('admin'),
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            const {userId} = req.params
            const userExist = await UserModel.findById(userId)
            if(!userExist) return res.status(500).json("not found user")
            return res.status(201).json({user:
                    {
                        email:userExist.email,
                        firstName:userExist.firstName,
                        lastName:userExist.lastName,
                        role:userExist.role,
                    }
            })
        }catch(error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router