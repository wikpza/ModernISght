import {IBrandRepository} from "../interfaces/brandRepository.interface";
import {Brand} from "../models/brand.model";
import BrandsModel, {IBrand} from "../database/schemas/brands.schema";

import {NotFoundError} from "../utils/error";
import ColorModel from "../database/schemas/colors.schema";

export class BrandRepository implements IBrandRepository{
   async create(input: Brand): Promise<IBrand> {
        const brandExist = await BrandsModel.findOne({name:input.name}).exec()
       if(brandExist) throw new NotFoundError('brand with such name has already existed')
       return await BrandsModel.create({name:input.name})
    }

    async deleteOne(id: string): Promise<IBrand[]> {
        try{
            await BrandsModel.findByIdAndDelete(id)
        }catch(error){
            throw new NotFoundError('not found brand')
        }
        return await BrandsModel.find().select('name').exec();
    }

    async find(): Promise<IBrand[]> {
        return  await BrandsModel.find().select('name').exec()
    }

    async findOne(name: string): Promise<IBrand> {
        const brandExist = await BrandsModel.findOne({name}).select('name')
        if(!brandExist){
            throw new NotFoundError('brand not found')
        }
        return brandExist
    }

    async update({brand, id}: { brand: Brand; id: string }): Promise<IBrand> {
        const brandExist = await BrandsModel.findById(id).select('name')
        if(!brandExist){
            throw new NotFoundError('brand not found')
        }
        brandExist.name = brand.name
        await brandExist.save()
        return brandExist
    }

}