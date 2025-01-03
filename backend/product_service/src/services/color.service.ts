import {IColorRepository} from "../interfaces/colorRepository.interface";
import {Color} from "../models/color.model";
import {IColor} from "../database/schemas/colors.schema";

export class ColorService{
    private _repository: IColorRepository

    constructor(repository:IColorRepository) {
        this._repository = repository
    }

    async createColor(input:Color):Promise<IColor>{
        const data = await this._repository.create(input)
        if(!data._id){
            throw new Error('unable to create address')
        }
        return data
    }
    async updateColor(input:{color:Color, id:string}):Promise<IColor>{
        const data = await this._repository.update(input)
        if(!data._id){
            throw new Error('unable to update address')
        }
        return data;
    }

    async getColor(name:string):Promise<IColor>{
        return await this._repository.findOne(name)
    }

    async getColors():Promise<IColor[]>{
        return await this._repository.find()
    }
    async deleteColor(id:string):Promise<IColor[]>{
        return await this._repository.deleteOne(id)
    }


}