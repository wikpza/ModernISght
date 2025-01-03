import {IGenderRepository} from "../interfaces/genderRepository.interface";
import {IGender} from "../database/schemas/genders.schema";
import {Gender} from "../models/gender.model";


export class GenderService{
    private _repository :IGenderRepository
    constructor(repository:IGenderRepository) {
        this._repository = repository
    }

    async createGender(input:Gender):Promise<IGender>{
        const data = await this._repository.create(input)
        if(!data._id){
            throw new Error('unable to create gender')
        }
        return data
    }

    async updateGender(input:{gender:Gender, id:string}):Promise<IGender>{
        const data = await this._repository.update(input)
        if(!data._id){
            throw new Error('unable to update gender')
        }
        return data;
    }

    async getGender(name:string):Promise<IGender>{
        return await this._repository.findOne(name)
    }

    async getGenders():Promise<IGender[]>{
        return await this._repository.find()
    }
    async deleteGender(id:string):Promise<IGender[]>{
        return await this._repository.deleteOne(id)
    }


}