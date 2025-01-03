import {ISizeType} from "../database/schemas/sizeType.schema";
import {SizeType} from "../models/sizeType.model";

export interface ISizeTypeRepository{
    create(input:SizeType):Promise<ISizeType>
    findOne({gender, categoryName}:{gender:string, categoryName:string}):Promise<ISizeType>
    get():Promise<ISizeType[]>

    deleteOne(id:string):Promise<ISizeType>
    deleteSizeValue({id,sizeId}:{id:string, sizeId:string}):Promise<ISizeType>
    addSizeValue({newValue, id}: { newValue:string, id:string}):Promise<ISizeType>
    updateSizeValue({ sizeId, newValue, id}:{sizeId:string, newValue:string, id:string}):Promise<ISizeType>
}