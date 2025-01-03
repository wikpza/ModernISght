import {Gender} from "../models/gender.model";
import {IGender} from "../database/schemas/genders.schema";

export interface IGenderRepository{
    create(input:Gender):Promise<IGender>
    update({gender, id}: { gender:Gender, id:string}):Promise<IGender>
    find():Promise<IGender[]>
    findOne(name:string):Promise<IGender>
    deleteOne(id:string):Promise<IGender[]>
}