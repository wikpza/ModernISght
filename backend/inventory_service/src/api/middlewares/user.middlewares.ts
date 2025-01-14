import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

import {toUserRoleType, User} from "../../models/user.model";

dotenv.config();

interface CustomJwtPayload extends JwtPayload {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface  AuthenticatedRequest extends Request {
    user?: User;
    token?:string
}

export const checkTokenJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
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
        req.token = token
        next();
    } catch (error) {
        console.error("Authentication error:", error);
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

export const checkUserRoles = (userRole:string[]) =>{

    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let findUser = false

        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "No token provided" });
        }

        try {
            for (const role of userRole){
                if(req.user.role === role){
                    findUser = true
                }

            }

            if(!findUser){
                return res.status(401).json({message:"You do not have access"})
            }

            next();
        } catch (error) {
            console.error("Authentication error:", error);
            res.status(401).json({ message: "You do not have access" });
        }
    };
}