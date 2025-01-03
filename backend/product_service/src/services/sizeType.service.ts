import {ISizeTypeRepository} from "../interfaces/sizeTypeRepository.interface";

import {SizeType} from "../models/sizeType.model";
import {ISizeType} from "../database/schemas/sizeType.schema";

export class SizeTypeService{
    private _repository:ISizeTypeRepository

    constructor(repository:ISizeTypeRepository) {
        this._repository = repository
    }

    async updateOneSizeValue(data: { sizeId: string; newValue: string; id: string }):Promise<ISizeType>{
        return this._repository.updateSizeValue(data)
    }
    async deleteSizeValue  (data:{id:string, sizeId:string}):Promise<ISizeType>{
        return this._repository.deleteSizeValue(data)
    }

    async getSizes():Promise<ISizeType[]> {
        return  this._repository.get()
    }
    async creatSizeType(input:SizeType):Promise<ISizeType>{
        const data = await this._repository.create(input)
        if(!data._id){
            throw new Error('unable to create size type')
        }
        return data
    }
    async addSizeType(input:{newValue:string, id:string}):Promise<ISizeType>{
        const data = await this._repository.addSizeValue(input)
        if(!data._id){
            throw new Error('unable to update size type')
        }
        return data;
    }

    async deleteSizeType(id:string):Promise<ISizeType>{
        const data = await this._repository.deleteOne(id)
        if(!data._id){
            throw new Error('unable to update size type')
        }
        return data;
    }



    async getSizeType(input:{gender:string, categoryName:string}):Promise<ISizeType>{
        return await this._repository.findOne(input)
    }


}