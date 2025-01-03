import {ICardRepositoryInterface} from "../interface/cardRepository.interface";
import {ICard} from "../database/schemas/card.schema";
import {Card} from "../models/card.model";

export class CardService{
    private _repository:ICardRepositoryInterface

    constructor(repository:ICardRepositoryInterface) {
        this._repository = repository
    }

    async addCard(input: {card:Card, userId:string}): Promise<ICard> {
        return this._repository.create(input)
    }

    async deleteCard(input: { idCard: string , userId:string}): Promise<ICard> {
        return this._repository.delete(input)
    }

    async getCardData(input: { numberCard: string, userId:string }): Promise<ICard> {
        return this._repository.find(input)
    }

    async getCards(userId:string ): Promise<ICard> {
        return this._repository.get(userId)
    }
}
