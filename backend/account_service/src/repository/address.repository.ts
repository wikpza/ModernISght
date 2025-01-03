import {IAddressesRepository} from "../interface/addressRepository.interface";
import {Address, CreateAddress, User, UserAddresses} from "../models";
import UserAddressesModel from "../database/schemas/address.schema";
import {NotFoundError} from "../utils/error";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export class AddressRepository implements IAddressesRepository {
    async create({user, address}: {user:User,address:CreateAddress}): Promise<UserAddresses> {
        let userAddressesExist  = await UserAddressesModel.findOne({userId:user._id}).exec()

        if(!userAddressesExist){
            userAddressesExist = await UserAddressesModel.create({
                userId:user._id,
                addresses:[]
            })
        }

        if(userAddressesExist.addresses.length !==0 && address.preferred){
            userAddressesExist.addresses.forEach(address=>{
                if(address.preferred) address.preferred = false
            })
        }

        if(userAddressesExist.addresses.length === 8 ){
            throw new NotFoundError("you can't have more than 8 addresses")
        }

        userAddressesExist.addresses.push(address)
        userAddressesExist.modifiedAt = new Date()

        await userAddressesExist.save()

        return {
            userId:userAddressesExist.userId,
            _id:userAddressesExist._id,
            addresses: userAddressesExist?.addresses,
            createdAt:userAddressesExist?.createdAt,
            modifiedAt:userAddressesExist.modifiedAt
        }
    }
    async update({user, address, _id:id}: {user:User, address:CreateAddress, _id:string}): Promise<UserAddresses> {

        const  userAddressesExist  = await UserAddressesModel.findOne({userId:user._id}).exec()

        if(!userAddressesExist || userAddressesExist?.addresses.length === 0){
            throw new NotFoundError("user don't have any address")
        }

        let isHaveAddress = false

        const addressId =  new mongoose.Types.ObjectId(id);


        userAddressesExist.addresses.forEach(addressItem=>{
            if(address.preferred && addressItem.preferred){
                addressItem.preferred = false
            }
            if(addressId.equals(addressItem._id)){
                addressItem.firstName = address.firstName
                addressItem.lastName = address.lastName
                addressItem.addressLine1 = address.addressLine1
                addressItem.addressLine2 = address.addressLine2
                addressItem.city = address.city
                addressItem.state = address.state
                addressItem.phoneNumber = address.phoneNumber
                addressItem.preferred = address.preferred
                isHaveAddress = true
            }
        })

        if(!isHaveAddress){
            throw new NotFoundError('not found address with such id')
        }
        await userAddressesExist.save()
        return userAddressesExist
    }

    async getAddresses(user:User): Promise<UserAddresses> {
        const  userAddressesExist  = await UserAddressesModel.findOne({userId:user._id}).exec()

        if(!userAddressesExist){
            return  await UserAddressesModel.create({
                userId:user._id,
                addresses:[]
            })
        }

        return userAddressesExist
    }
    
    async getOne({user,id}:{user:User, id:string}): Promise<Address> {
        const userAddresses = await UserAddressesModel.findOne({
            userId:user._id
        }).exec()
        if(!userAddresses) throw new NotFoundError('address not found')
        const address = userAddresses.addresses.id(id)
        if(!address) throw new NotFoundError('address not found')
        return {
            firstName:address.firstName,
            lastName:address.lastName,
            addressLine1:address.addressLine1,
            addressLine2:address.addressLine2,
            city:address.city,
            state:address.state,
            zipCode:address.zipCode,
            phoneNumber:address.phoneNumber,
            preferred:address.preferred,
            createdAt:address.createdAt,
            modifiedAt:address.modifiedAt,
        } as Address
    }
    async setPreferred({user, _id:id}:{user:User, _id:string}):Promise<UserAddresses> {
        const  userAddressesExist  = await UserAddressesModel.findOne({userId:user._id}).exec()

        if(!userAddressesExist || userAddressesExist?.addresses.length === 0){
            throw new NotFoundError("user don't have any address")
        }

        let isHaveAddress = false

        const addressId =  new mongoose.Types.ObjectId(id);

        userAddressesExist.addresses.forEach(addressItem=>{
            if(addressItem.preferred) addressItem.preferred = false

            if(addressId.equals(addressItem._id)){
                addressItem.preferred = true
                isHaveAddress = true
            }
        })

        if(!isHaveAddress){
            throw new NotFoundError('not found address with such id')
        }
        await userAddressesExist.save()

        return userAddressesExist
    }

    async delete({user, id}:{user:User,id:string}):Promise<UserAddresses> {

        const addressId = new mongoose.Types.ObjectId(id);

        const userAddressesExist = await UserAddressesModel.findOne({
            userId: user._id,
            'addresses._id': addressId
        }).exec();


        if(!userAddressesExist) throw new NotFoundError('not found address with such id')

        const userAddresses = await UserAddressesModel.findOneAndUpdate(
            {userId:user._id},
            {
                $pull:{addresses:{_id:id}},
                modifiedAt:new Date()
            },
            {
                new: true,
                runValidators: true
            }
        ).exec()

        if(!userAddresses) throw new NotFoundError('unable to delete')

        return userAddresses
    }
}