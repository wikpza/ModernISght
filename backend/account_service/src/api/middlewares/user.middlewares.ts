import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import {User} from "../../models";
import {toUserRoleType, toUserSessionType} from "../../utils";
import {TokenUserSession} from "../../models/token.model";
import mongoose from "mongoose";

dotenv.config();

interface CustomJwtPayload extends JwtPayload {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface CustomSessionJWTPayload extends JwtPayload {
    _id: string;
    userId:string;
    email: string;
    type: string;
}
export interface  AuthenticatedRequest extends Request {
    user?: User;
}

export interface  UserSessionRequest extends Request {
    tokenSession?: TokenUserSession
}

export const verifySessionTokenJWT =(req: UserSessionRequest, res: Response, next: NextFunction)=>{
    if (req.method === 'OPTIONS') {
        return next(); // Прекращаем выполнение функции, если метод OPTIONS
    }
    const token = req.params.token
    if(!token){
        res.status(400).json({"message": "invalid token"})
    }

    if (!process.env.SECRET_KEY_SESSION) {
        throw new Error("SECRET_KEY_SESSION is not defined");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_SESSION as string) as CustomSessionJWTPayload;
    req.tokenSession = {
        _id:decoded._id,
        userId:decoded.userId,
        email:decoded.email,
        type:toUserSessionType(decoded.type)
    } as TokenUserSession
    next()
}
export const checkTokenJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next(); // Прекращаем выполнение функции, если метод OPTIONS
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as CustomJwtPayload;
        req.user = {_id:decoded._id,
        firstName:decoded.firstName,
            lastName:decoded.lastName,
            email:decoded.email,
            role:toUserRoleType(decoded.role)} as User;
        next();
    } catch (error) {
        console.error("Authentication error:", error); // Логируем ошибку
        res.status(401).json({ message: "Not authorized" });
    }
};

export const checkUserRole = (userRole:string) =>{
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "No token provided" });
        }

        try {
            if(req.user.role !== userRole){
                return res.status(401).json({message:"You do not have access"})
            }
            next();
        } catch (error) {
            console.error("Authentication error:", error);
            res.status(401).json({ message: "You do not have access" });
        }
    };
}

export function processId(id: string | mongoose.Types.ObjectId | undefined) {
    if (typeof id === 'string') {
        return id as string
    } else {
        throw new Error('wrong type of id')
    }
}

