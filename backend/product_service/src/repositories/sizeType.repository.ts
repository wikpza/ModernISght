import SizeTypeModel, {ISize, ISizeType} from "../database/schemas/sizeType.schema";
import {ISizeTypeRepository} from "../interfaces/sizeTypeRepository.interface";
import {SizeType} from "../models/sizeType.model";
import {NotFoundError} from "../utils/error";
import CategoryModel from "../database/schemas/category.schema";
import ProductModel from "../database/schemas/product.schema";
import GenderModel from "../database/schemas/genders.schema";
import {sortedSizes} from "../utils";
import {InventoryRepository} from "./inventory.repository";


const inventoryService = new InventoryRepository()
export class SizeTypeRepository implements ISizeTypeRepository{
    async get():Promise<ISizeType[]>{
        let sizes =  await SizeTypeModel.find()
            .populate('genderId', 'name')   // Подгружаем только поле `name` из коллекции `Gender`
            .populate('categoryId', 'name')
            .sort({
                'categoryId.name': 1, // Сортировка по полю `name` коллекции Category (по возрастанию)
                'genderId.name': 1    // Сортировка по полю `name` коллекции Gender (по возрастанию)
            })
            .exec();

        if(!sizes ) sizes = []
        return sizes
    }

    async create(input: SizeType): Promise<ISizeType> {
        const sizeExist = await SizeTypeModel.findOne({genderId:input.genderId, categoryId:input.categoryId}).exec()
        if(sizeExist) throw new NotFoundError('sizeType has already existed')

        const genderExist = await GenderModel.findById(input.genderId)
        if(!genderExist) throw new NotFoundError('not found such gender')
        const categoryExist = await CategoryModel.findById(input.categoryId)
        if(!categoryExist) throw new NotFoundError('not found such category')

        const newSize = await SizeTypeModel.create(
            {categoryId: categoryExist._id,
            genderId: genderExist._id})

        for(const size in input.values){
            newSize.sizes.push({
                size: input.values[size],
                createdAt: new Date(),
                modifiedAt: new Date()
            } as ISize)
        }
        newSize.sizes = sortedSizes(newSize.sizes);
        await newSize.save()
        return newSize
    }

    async findOne({gender, categoryName}: { gender: string; categoryName: string }): Promise<ISizeType> {

        const genderExist = await GenderModel.findById(gender)
        if(!genderExist) throw new NotFoundError('not found such gender')
        const categoryExist = await CategoryModel.findOne({name:categoryName})
        if(!categoryExist) throw new NotFoundError('not found such category')

        const sizeExist = await SizeTypeModel.findOne({gender:gender, categoryId:categoryExist._id}).select('values gender categoryId').exec()
        if(!sizeExist) throw new NotFoundError('not found size type')
        return sizeExist
    }

    async addSizeValue({ newValue, id }: { newValue: string; id: string }): Promise<ISizeType> {
        // Find the SizeType document by ID
        const sizeTypeExist = await SizeTypeModel.findById(id).exec();

        if (!sizeTypeExist) {
            throw new NotFoundError('Size type not found');
        }

        // Check if the new size already exists in the sizes array
        const sizeExists = sizeTypeExist.sizes.some(size => size.size === newValue);

        if (sizeExists) {
            throw new NotFoundError('Size type already contains this value');
        }

        // Create a new ISize document instance instead of just an object
        const newSize:ISize = {
            size: newValue,
            createdAt: new Date(),
            modifiedAt: new Date()
        } as ISize

        // Add the new size to the sizes array
        sizeTypeExist.sizes.push(newSize);

        // Sort the sizes array (ensure sortedSizes can handle ISize[] properly)
        sizeTypeExist.sizes = sortedSizes(sizeTypeExist.sizes);

        // Save the updated document
        await sizeTypeExist.save();
        inventoryService.addSizes(newSize, id)
        return sizeTypeExist;
    }

    async deleteOne(id: string): Promise<ISizeType> {
        const sizeExist = await SizeTypeModel.findById(id).exec()
        if(!sizeExist) throw new NotFoundError('not found size type')
        const count = await ProductModel.countDocuments({categoryId:sizeExist.categoryId, genderId:sizeExist.genderId})
        if(count > 0) throw new NotFoundError('unable delete because it is referenced in Product ')
        await SizeTypeModel.findByIdAndDelete(sizeExist._id)
        return sizeExist
    }

    async updateSizeValue({ sizeId, newValue, id }: { sizeId: string; newValue: string; id: string }): Promise<ISizeType> {
        // Find the SizeType document by ID
        const sizeTypeExist = await SizeTypeModel.findById(id).exec();

        if (!sizeTypeExist) {
            throw new NotFoundError('Size type not found');
        }

        // Find the size object in the sizes array by sizeId
        const size = sizeTypeExist.sizes.find(size => size._id.toString() === sizeId);

        if (!size) {
            throw new NotFoundError('Size value not found');
        }

        // Check if the new value already exists in the sizes array for this size type
        if (sizeTypeExist.sizes.some(existingSize => existingSize.size === newValue)) {
            throw new NotFoundError('Cannot add value, because new value already exists');
        }

        // Update the size value
        size.size = newValue;

        // Sort the sizes array based on the size values (if necessary)
        sizeTypeExist.sizes = sizeTypeExist.sizes.sort((a, b) => a.size.localeCompare(b.size));

        // Update the modifiedAt timestamp
        sizeTypeExist.modifiedAt = new Date();

        // Save the updated document
        await sizeTypeExist.save();

        return sizeTypeExist;
    }

    async  deleteSizeValue({ id, sizeId }: { id: string; sizeId: string; }): Promise<ISizeType> {
        const sizeExist = await SizeTypeModel.findById(id).exec();

        if (!sizeExist) {
            throw new NotFoundError('Size type not found');
        }

        const count = await ProductModel.countDocuments({categoryId:sizeExist.categoryId, genderId:sizeExist.genderId})
        if(count > 0) throw new NotFoundError('unable delete because it is referenced in Product ')

        // TypeScript now knows that sizeExist.sizes is an array of ISize objects
        const sizeIndex = sizeExist.sizes.findIndex((size: ISize) => size._id.toString() === sizeId);

        if (sizeIndex === -1) {
            throw new NotFoundError('Size value not found');
        }

        // Remove the size from the array
        sizeExist.sizes.splice(sizeIndex, 1);

        // Update the `modifiedAt` field
        sizeExist.modifiedAt = new Date();

        // Save the updated document
        await sizeExist.save();

        return sizeExist;
    }
}