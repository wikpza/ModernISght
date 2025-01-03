import {IAddressesRepository} from "../interface/addressRepository.interface";
import {Address, CreateAddress, User, UserAddresses} from "../models";

export class AddressService{
    private _repository: IAddressesRepository

    constructor(repository: IAddressesRepository) {
        this._repository = repository
    }

    async createAddress(input: {user:User,address:CreateAddress}):Promise<UserAddresses>{
        const data = await this._repository.create(input)
        if(!data._id){
            throw new Error('unable to create address')
        }
        return data
    }
    async updateAddress(input:{user:User, address:CreateAddress, _id:string}):Promise<UserAddresses>{
        const data = await this._repository.update(input)
        if(!data._id){
            throw new Error('unable to update address')
        }
        return data;
    }
    async getAddresses(input:User):Promise<UserAddresses>{
        return await this._repository.getAddresses(input)
    }
    async getAddress(data:{user:User,id:string}){
        if(!data.id){
            throw new Error('unable to update address')
        }
        return await this._repository.getOne(data);
    }
    async deleteAddress(data:{user:User, id:string}){
        if(!data.id){
            throw new Error('unable to update address')
        }
        return  await this._repository.delete(data)
    }

    async setPreferred(input:{user:User, _id:string}):Promise<UserAddresses>{
        return  await this._repository.setPreferred(input)
    }
}