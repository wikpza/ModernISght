import {IColorRepository} from "../interfaces/colorRepository.interface";
import {Color} from "../models/color.model";
import ColorModel, {IColor} from "../database/schemas/colors.schema";
import {NotFoundError} from "../utils/error";
import ColorsSchema from "../database/schemas/colors.schema";
import colorsSchema from "../database/schemas/colors.schema";

export class ColorRepository implements IColorRepository{
    async create(input: Color): Promise<IColor> {
        const colorExist  =await ColorModel.findOne({name:input.name})
        if(colorExist){
            throw new NotFoundError('color with such name has already existed')
        }
        return  ColorModel.create({name:input.name, hexCode:input.hexCode})
    }

    async deleteOne(id: string): Promise<IColor[]> {
        try{
            await ColorModel.findByIdAndDelete(id)
        }catch(error){
            throw new NotFoundError('not found color')
        }
        return  ColorModel.find().select('name hexCode _id').exec()
    }

    async find(): Promise<IColor[]> {
        const colors = await ColorModel.find().select('name hexCode _id')
        return Promise.resolve(colors);
    }

    async findOne(name: string): Promise<IColor> {
        const colorExist = await ColorModel.findOne({name}).select('name hexCode _id')
        if(!colorExist){
            throw new NotFoundError('color not found')
        }
        return colorExist
    }

    async update({color, id}: { color: Color; id: string }): Promise<IColor> {
       const colorExist = await ColorModel.findById(id).select('name hexCode _id')
        if(!colorExist){
            throw new NotFoundError('color not found')
        }
        colorExist.name = color.name
        colorExist.hexCode = color.hexCode
        await colorExist.save()
        return colorExist
    }



}