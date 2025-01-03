import {IAdminRepository} from "../interface/adminRepository.interface";
import {User} from "../models";

export class AdminService {
    private _repository:IAdminRepository

    constructor(repository:IAdminRepository) {
        this._repository = repository
    }

    async getUsers(data: {userEmail?:string,  userRole?:string, page:number, limit:number}): Promise<{data:User[], totalPages:number}>{
        return await this._repository.getUsers(data)
    }

    async changeStatus(input:{userId:string, newRole:string}): Promise<User>{
        return await this._repository.changeStatus(input)
    }




}