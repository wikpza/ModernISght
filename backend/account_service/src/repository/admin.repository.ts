import {IAdminRepository} from "../interface/adminRepository.interface";
import {User} from "../models";
import {UserModel} from "../database/schemas/user";
import {NotFoundError} from "../utils/error";
import {toUserRoleType} from "../utils";

export class AdminRepository implements IAdminRepository {
    async changeStatus(data: { userId: string; newRole: string }): Promise<User> {
        const userExist = await UserModel.findById(data.userId)
        if (!userExist) throw new NotFoundError("not found user")
        if (!userExist.active) throw new NotFoundError('not found user')
        if (userExist.role === data.newRole) throw new NotFoundError('user has yet that role')
        userExist.role = toUserRoleType(data.newRole)
        await userExist.save()
        return userExist
    }


    async getUsers(data: { userEmail?: string; userRole?: string; page: number; limit: number }): Promise<{data:User[], totalPages:number}> {
        let {userEmail, userRole, page, limit} = data;
        const filter: any = {active: true};
        if (userEmail) {
            filter.email = {$regex: userEmail, $options: 'i'};
        }
        if (userRole) filter.role = userRole;
        const totalCount = await UserModel.countDocuments(filter);

        const totalPages = Math.ceil(totalCount / limit);

        const skip = (page - 1) * limit;

        const users = await UserModel.find(filter)
            .skip(skip)
            .limit(limit)
            .exec();

        return {data:users, totalPages:totalPages}
    }

}
