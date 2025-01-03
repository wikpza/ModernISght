import {IFeatureRepository} from "../interfaces/featureRepository.interface";
import FeaturesModel, {IFeatureProduct} from "../database/schemas/features.schema";
import {NotFoundError} from "../utils/error";


export class FeatureRepository implements IFeatureRepository{
    async find(categoryId: string): Promise<IFeatureProduct[]> {
        const featureExist = await FeaturesModel.find({categoryId}).select("categoryId values").exec()
        if(!featureExist) throw new NotFoundError('features for that category has not been created')
        return featureExist
    }

}