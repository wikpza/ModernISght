import {IFeatureRepository} from "../interfaces/featureRepository.interface";
import {IFeatureProduct} from "../database/schemas/features.schema";
import {FeatureRepository} from "../repositories/feature.repository";

export class FeatureService{
   private _repository:FeatureRepository
    constructor(repository:IFeatureRepository) {
        this._repository = repository
    }

    async getFeatures(categoryId:string):Promise<IFeatureProduct[]>{
        return await this._repository.find(categoryId)
    }


}