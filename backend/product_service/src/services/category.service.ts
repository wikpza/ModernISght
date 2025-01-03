import {ICategoryRepository} from "../interfaces/categoryRepository.interface";
import {Category} from "../models/category.model";
import {ICategory} from "../database/schemas/category.schema";
import {Brand} from "../models/brand.model";
import {IBrand} from "../database/schemas/brands.schema";

export class CategoryService {
    private _repository:ICategoryRepository
    constructor(repository:ICategoryRepository) {
        this._repository = repository
    }
    async creatCategory(input:Category):Promise<ICategory>{
        const data = await this._repository.create(input)
        if(!data._id){
            throw new Error('unable to create category')
        }
        return data
    }
    async updateCategory(input:{category:Category, id:string}):Promise<ICategory>{
        const data = await this._repository.update(input)
        if(!data._id){
            throw new Error('unable to update category')
        }
        return data;
    }

    async getCategory(name:string):Promise<ICategory>{
        return await this._repository.findOne(name)
    }

    async getCategories():Promise<ICategory[]>{
        return await this._repository.find()
    }
    async deleteCategory(id:string):Promise<ICategory[]>{
        return await this._repository.deleteOne(id)
    }

}