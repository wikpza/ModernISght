import {ICollectionRepository} from "../interfaces/collectionRepository.interface";
import CollectionsModel, {ICollection} from "../database/schemas/collections.schema";
import {Collection} from "../models/collection.model";
import {NotFoundError} from "../utils/error";

export class CollectionRepository implements  ICollectionRepository{
    async create(input: Collection): Promise<ICollection> {
        const collectionExist = await CollectionsModel.findOne({name:input.name}).exec()
        if(collectionExist) throw new NotFoundError('collection with such name has already existed')
        return await CollectionsModel.create({name:input.name})
    }

    async deleteOne(id: string): Promise<ICollection[]> {
        try{
            await CollectionsModel.findByIdAndDelete(id)
        }catch(error){
            throw new NotFoundError('not found collection')
        }
        return await CollectionsModel.find().select('name').exec();
    }

    async find(): Promise<ICollection[]> {
        return  await CollectionsModel.find().select('name').exec()
    }

    async findOne(name: string): Promise<ICollection> {
        const collectionExist = await CollectionsModel.findOne({name}).select('name')
        if(!collectionExist){
            throw new NotFoundError('collection not found')
        }
        return collectionExist
    }

    async update({collection, id}: { collection: Collection; id: string }): Promise<ICollection> {
        const collectionExist = await CollectionsModel.findById(id).select('name')
        if(!collectionExist){
            throw new NotFoundError('collection not found')
        }
        collectionExist.name = collection.name
        await collectionExist.save()
        return collectionExist
    }

}