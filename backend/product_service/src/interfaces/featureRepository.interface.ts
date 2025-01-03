import {IFeatureProduct} from "../database/schemas/features.schema";
import {FeatureProduct} from "../models/feauture.model";

export interface IFeatureRepository{
    find(categoryId:string):Promise<IFeatureProduct[]>
}