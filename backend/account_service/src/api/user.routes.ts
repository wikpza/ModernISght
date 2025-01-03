import express, {NextFunction, Response, Request} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {
    authenticationUserRequest, ChangeUserPasswordRequest,
    CreateUserRequest,
    ResetUserPasswordRequest,
    UpdateUserRequest
} from "../dto/user.dto";
import {UserService} from "../services/user.service";
import {UserRepository} from "../repository/user.repository";

import {TokenUser, TokenUserSession} from "../models/token.model";
import {
    AuthenticatedRequest,
    checkTokenJWT,
    UserSessionRequest,
    verifySessionTokenJWT
} from "./middlewares/user.middlewares";
import {generateJwt} from "../utils";
import {logger} from "../utils/logger";
import {ChangePasswordUser, UpdateUser, User} from "../models";
import {NotFoundError} from "../utils/error";


const router = express.Router()
export const userService = new UserService(new UserRepository())

router.post('/registration', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {errors, input} = await RequestValidator(
            CreateUserRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)
        const userSession = await userService.createUser(req.body)
        return res.status(201).json(
            {
                _id:userSession._id,
                email:userSession.email,
                createdAt:userSession.createdAt,
                type:userSession.type,
        })
    }catch(error){
        const err = error as Error
        return res.status(500).json(err.message)
    }

})

router.post('/login', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {errors, input} = await RequestValidator(
            authenticationUserRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)
        const user = await userService.authentication({email:req.body.email, password:req.body.password})
        const token = generateJwt(
            {
                _id:user._id,
                lastName:user.lastName,
                firstName:user.firstName,
                email:user.email,
                role:user.role
            } as TokenUser)
        return res.status(201).json({token})
    }catch (error){
        const err = error as Error
        return res.status(500).json(err.message)
    }

})

router.get(
    '/verify/:token',
    verifySessionTokenJWT,
    async (req: UserSessionRequest, res: Response, next: NextFunction) => {
        try {
            const data = req.tokenSession;
            if (!data) {
                throw new NotFoundError('not found data');
            }

            const user = await userService.verifyEmail(data);

            const successPageHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verified</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .container {
                            text-align: center;
                            background: #fff;
                            padding: 20px 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #4CAF50;
                        }
                        p {
                            color: #555;
                        }
                        a {
                            color: #4CAF50;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Email Successfully Verified!</h1>
                        <p>Thank you, <strong>${user.firstName}</strong>, your email has been successfully verified.</p>
                        <p>You can now access your account and enjoy our services.</p>
                        <a href="https://your-website.com/login">Go to Login Page</a>
                    </div>
                </body>
                </html>
            `;

            return res.status(200).send(successPageHTML);
        } catch (error) {
            const err = error as Error;

            const errorPageHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Failed</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .container {
                            text-align: center;
                            background: #fff;
                            padding: 20px 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #f44336;
                        }
                        p {
                            color: #555;
                        }
                        a {
                            color: #f44336;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Verification Failed</h1>
                        <p>We couldn't verify your email. Please try again or contact support if the problem persists.</p>
                        <a href="https://your-website.com/support">Contact Support</a>
                    </div>
                </body>
                </html>
            `;

            return res.status(500).send(errorPageHTML);
        }
    }
);

router.patch('/',
    checkTokenJWT,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if(!req.user){
                return res.status(400).json({message:"not found user"})
            }

            const { errors, input } = await RequestValidator(
                UpdateUserRequest,
                req.body
            );


            if (errors) return res.status(400).json(errors);

            for (const key of req.body.updateValues) {
                if (!(key in req.body)) {
                    return res.status(400).json({ message: `don't have ${key} value` });
                }
            }

            const user: User = await userService.updateUser(
                {_id:req.user._id,
                    lastName:req.body.lastName,
                    firstName:req.body.firstName,
                    phoneNumber:req.body.phoneNumber,
                    updateValues:req.body.updateValues
                } as UpdateUser
            );
            const token =  generateJwt(
                {
                    _id:user._id,
                    lastName:user.lastName,
                    firstName:user.firstName,
                    email:user.email,
                    role:user.role
                } as TokenUser)
            return res.status(200).json(token);

        } catch (error) {
            const err = error as Error;
            logger.error(error);
            return res.status(500).json({ message: err.message });
        }
    }
);

router.post('/reset',
    async(req:Request, res:Response, next:NextFunction)=>{
        try {
            const { errors, input } = await RequestValidator(
                ResetUserPasswordRequest,
                req.body
            );

            if (errors) return res.status(400).json(errors);
            const userSession = await userService.resetPassword(req.body.email)
            return res.status(200).json({
                    _id: userSession._id,
                    email: userSession.email,
                    createdAt: userSession.createdAt,
                    type: userSession.type,
                }
            );
        } catch (error) {
            const err = error as Error;
            logger.error(error);
            return res.status(500).json({ message: err.message });
        }
})

router.post(
    '/reset/:token',
    verifySessionTokenJWT,
    async(req:UserSessionRequest, res:Response, next:NextFunction)=>{
    try {
        const { errors, input } = await RequestValidator(
            ChangeUserPasswordRequest,
            req.body
        );
        if (errors) return res.status(400).json(errors);
        const message = await userService.changePassword({...req.tokenSession, password:req.body.password} as ChangePasswordUser)

        return res.status(200).json(message);
    } catch (error) {
        const err = error as Error;
        logger.error(error);
        return res.status(500).json({ message: err.message });
    }
})



router.get('/',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user?._id) return res.status(400).json('invalid token')
        const data = await userService.getUserData(req.user._id)
        return res.status(200).json(data)
    }catch(error){
        const err = error as Error
        logger.error(error);
        res.status(500).json({message:err.message})
    }
})


export default router