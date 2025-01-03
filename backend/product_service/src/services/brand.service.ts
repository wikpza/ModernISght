import {IBrandRepository} from "../interfaces/brandRepository.interface";
import {IBrand} from "../database/schemas/brands.schema";
import {Brand} from "../models/brand.model";

export class BrandService{
    private _repository : IBrandRepository

    constructor(repository:IBrandRepository) {
        this._repository = repository
    }
    async creatBrand(input:Brand):Promise<IBrand>{
        const data = await this._repository.create(input)
        if(!data._id){
            throw new Error('unable to create brand')
        }
        return data
    }
    async updateBrand(input:{brand:Brand, id:string}):Promise<IBrand>{
        const data = await this._repository.update(input)
        if(!data._id){
            throw new Error('unable to update address')
        }
        return data;
    }

    async getBrand(name:string):Promise<IBrand>{
        return await this._repository.findOne(name)
    }

    async getBrands():Promise<IBrand[]>{
        return await this._repository.find()
    }
    async deleteBrand(id:string):Promise<IBrand[]>{
        return await this._repository.deleteOne(id)
    }


}