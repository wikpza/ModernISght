import {Brand} from "../models/brand.model";
import {IBrand} from "../database/schemas/brands.schema";

export interface IBrandRepository {
    create(input:Brand):Promise<IBrand>
    update({brand, id}: { brand:Brand, id:string}):Promise<IBrand>
    find():Promise<IBrand[]>
    findOne(name:string):Promise<IBrand>
    deleteOne(id:string):Promise<IBrand[]>
}