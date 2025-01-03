import {ICollectionRepository} from "../interfaces/collectionRepository.interface";
import {Collection} from "../models/collection.model";
import {ICollection} from "../database/schemas/collections.schema";

export class CollectionService {
    private _repository: ICollectionRepository

    constructor(repository: ICollectionRepository) {
        this._repository = repository
    }

    async creatCollection(input: Collection): Promise<ICollection> {
        const data = await this._repository.create(input)
        if (!data._id) {
            throw new Error('unable to create collection')
        }
        return data
    }

    async updateCollection(input: { collection: Collection, id: string }): Promise<ICollection> {
        const data = await this._repository.update(input)
        if (!data._id) {
            throw new Error('unable to update address')
        }
        return data;
    }

    async getCollection(name: string): Promise<ICollection> {
        return await this._repository.findOne(name)
    }

    async getCollections(): Promise<ICollection[]> {
        return await this._repository.find()
    }

    async deleteCollection(id: string): Promise<ICollection[]> {
        return await this._repository.deleteOne(id)
    }


}