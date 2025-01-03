import {ICardRepositoryInterface} from "../interface/cardRepository.interface";
import {CardListModel, CardModel, ICard, ICardList} from "../database/schemas/card.schema";
import { Card } from "../models/card.model";
import {UserModel} from "../database/schemas/user";
import {NotFoundError} from "../utils/error";
import mongoose from "mongoose";

export class CardRepository implements ICardRepositoryInterface{

    async create(input: { card: Card; userId: string }): Promise<ICard> {
        const userExist = await UserModel.findById(input.userId);
        if (!userExist) throw new NotFoundError('wrong user id');

        let cardExist = await CardModel.findOne({ userId: input.userId });
        if (!cardExist) {
            cardExist = await CardModel.create({ userId: userExist._id });
        }

        const cardNumberExists = cardExist.cards.some((card:ICardList) => card.number === input.card.cardNumber);
        if (cardExist.cards.length === 8) throw new NotFoundError('you can not have more than 8 cards');
        if (cardNumberExists) throw new NotFoundError('Card with such number has already been added');

        const newCard = new CardListModel({
            number: input.card.cardNumber,
            cvv: input.card.cvv,
            expiryDate: input.card.expiryDate
        });

        cardExist.cards.push(newCard);

        await cardExist.save();

        cardExist.cards = cardExist.cards.map(card => {
            card.cvv = '***';
            card.expiryDate = '**/**';
            return card;
        });

        return cardExist;
    }
    async delete(input: { idCard: string; userId: string }): Promise<ICard>{
        const userExist = await UserModel.findById(input.userId)
        if(!userExist) throw new NotFoundError('not found user')
        const cardExist = await CardModel.findOne({
            userId: input.userId,
            cards: {
                $elemMatch: { _id: input.idCard }
            }
        });
        if(!cardExist) throw new NotFoundError('not found card')
        cardExist.cards = cardExist.cards.filter((card:ICardList)=>!(card._id as mongoose.Types.ObjectId).equals(new mongoose.Types.ObjectId(input.idCard)))
        await cardExist.save()

        cardExist.cards = cardExist.cards.map(card => {
            card.cvv = '***'
            card.expiryDate = "**/**"
            return card
        });

        return cardExist
    }

    async find(input: { numberCard: string; userId: string }): Promise<ICard> {
        const userExist = await UserModel.findById(input.userId)
        if(!userExist) throw new NotFoundError('not found user')
        const card = await CardModel.findOne(
            { userId: input.userId, 'cards._id': input.numberCard },
            { 'cards.$': 1 }
        );
        if(!card) throw new NotFoundError('not found card')

        return card
    }

    async get(userId: string): Promise<ICard> {
        const userExist = await UserModel.findById(userId)
        if(!userExist) throw new NotFoundError('not found user')
        const cardExist = await CardModel.findOne(
            { userId},);
        if(!cardExist) return await CardModel.create({userId:userExist._id})

        cardExist.cards = cardExist.cards.map(cardValue => {
            cardValue.cvv = '***'
            cardValue.expiryDate = "**/**"
            return cardValue
        });
        return cardExist
    }

}