import {Address, CreateAddress, CreateUser, User, UserAddresses} from "../models";

export interface IAddressesRepository{
    create(data:{user:User,address:CreateAddress}): Promise<UserAddresses>;
    update(data:{user:User, address:CreateAddress, _id:string}): Promise<UserAddresses>;
    setPreferred(data:{user:User, _id:string}):Promise<UserAddresses>,
    getAddresses(data:User):Promise<UserAddresses>,
    getOne(data:{user:User,id:string}):Promise<Address>,

    delete(data:{user:User,id:string}):Promise<UserAddresses>;


}