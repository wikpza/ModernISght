import {User} from "../models";

export interface IAdminRepository{
     getUsers(data: {userEmail?:string,  userRole?:string, page:number, limit:number}):Promise<{data:User[], totalPages:number}>
     changeStatus(data:{userId:string, newRole:string}):Promise<User>
}