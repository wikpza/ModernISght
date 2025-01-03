import {ICard} from "../database/schemas/card.schema";
import {Card} from "../models/card.model";

export interface ICardRepositoryInterface{
    create(input:{card:Card,userId:string}):Promise<ICard>
    delete(input:{idCard:string, userId:string}):Promise<ICard>
    find(input:{numberCard:string, userId:string}):Promise<ICard>
    get(userId:string):Promise<ICard>
}