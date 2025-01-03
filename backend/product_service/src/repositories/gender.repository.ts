import GenderModel, {IGender} from "../database/schemas/genders.schema";
import {IGenderRepository} from "../interfaces/genderRepository.interface";
import {Gender} from "../models/gender.model";
import {NotFoundError} from "../utils/error";
import BrandsModel from "../database/schemas/brands.schema";

export class GenderRepository implements IGenderRepository{
    async create(input: Gender): Promise<IGender> {
        const genderExist = await GenderModel.findOne({name:input.name}).exec()
        if(genderExist) throw new NotFoundError('gender with such name has already existed')
        return await GenderModel.create({name:input.name})
    }

    async deleteOne(id: string): Promise<IGender[]> {
        try{
            await GenderModel.findByIdAndDelete(id)
        }catch(error){
            throw new NotFoundError('not found gender')
        }
        return await GenderModel.find().select('name').exec();
    }

    async find(): Promise<IGender[]> {
        return  await GenderModel.find().select('name').exec()
    }

    async findOne(name: string): Promise<IGender> {
        const genderExist = await GenderModel.findOne({name}).select('name')
        if(!genderExist){
            throw new NotFoundError('gender not found')
        }
        return genderExist
    }

    async update({gender, id}: { gender: Gender; id: string }): Promise<IGender> {
        const genderExist = await GenderModel.findById(id).select('name')
        if(!genderExist){
            throw new NotFoundError('gender not found')
        }
        genderExist.name = gender.name
        await genderExist.save()
        return genderExist
    }

}