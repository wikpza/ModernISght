import {Category} from "../models/category.model";
import {ICategory} from "../database/schemas/category.schema";

export interface ICategoryRepository{
    create(input:Category):Promise<ICategory>
    update(input:{category:Category, id:string}):Promise<ICategory>
    find():Promise<ICategory[]>
    findOne(name:string):Promise<ICategory>
    deleteOne(id:string):Promise<ICategory[]>
}