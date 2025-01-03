import {ICategoryRepository} from "../interfaces/categoryRepository.interface";
import {Category} from "../models/category.model";
import CategoryModel, {ICategory} from "../database/schemas/category.schema";
import {NotFoundError} from "../utils/error";

export class CategoryRepository implements  ICategoryRepository{
    async create(input: Category): Promise<ICategory> {
        const categoryExist = await CategoryModel.findOne({name:input.name}).exec()
        if(categoryExist) throw new NotFoundError('category with such name has already existed')
        return await CategoryModel.create({name:input.name})
    }

    async deleteOne(id: string): Promise<ICategory[]> {
        try{
            await CategoryModel.findByIdAndDelete(id)
        }catch(error){
            throw new NotFoundError('not found category')
        }
        return await CategoryModel.find().select('name').exec()
    }

    async find(): Promise<ICategory[]> {
        return await CategoryModel.find().select('name').exec()
    }

    async findOne(name: string): Promise<ICategory> {
        const categoryExist = await CategoryModel.findOne({name}).exec()
        if(!categoryExist) throw new NotFoundError('unable to find category')
        return categoryExist
    }

    async update({category, id}: { category: Category; id: string }): Promise<ICategory> {
        const categoryExist = await CategoryModel.findById(id).exec()
        if(!categoryExist) throw new NotFoundError('unable to find category')
        categoryExist.name = category.name
        await categoryExist.save()
        return categoryExist
    }

}