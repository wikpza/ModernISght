import {Collection} from "../models/collection.model";
import {ICollection} from "../database/schemas/collections.schema";

export interface ICollectionRepository {
    create(input:Collection):Promise<ICollection>
    update({collection, id}: { collection:Collection, id:string}):Promise<ICollection>
    find():Promise<ICollection[]>
    findOne(name:string):Promise<ICollection>
    deleteOne(id:string):Promise<ICollection[]>
}