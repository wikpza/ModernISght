import {Color} from "../models/color.model";
import {IColor} from "../database/schemas/colors.schema";

export interface IColorRepository {
    create(input:Color):Promise<IColor>
    update({color, id}: { color:Color, id:string}):Promise<IColor>
    find():Promise<IColor[]>
    findOne(name:string):Promise<IColor>
    deleteOne(id:string):Promise<IColor[]>
}