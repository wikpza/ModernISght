import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для CardList
export interface ICardList extends Document {
    number: string;
    cvv: string;
    expiryDate: string;
    createdAt: Date;
    modifiedAt: Date;
}

// Интерфейс для Card
export interface ICard extends Document {
    userId: mongoose.Types.ObjectId;
    cards: ICardList[];
    createdAt: Date;
    modifiedAt: Date;
}

// Схема для CardList
export const cardListSchema = new Schema<ICardList>({
    number: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => /^\d{16}$/.test(value),
            message: 'The field must be a string of exactly 16 digits.'
        }
    },
    cvv: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => /^\d{3}$/.test(value),
            message: 'The field must be a string of exactly 3 digits.'
        }
    },
    expiryDate: {
        type: String,
        required: true,
        validate: {
            validator: function(value: string) {
                const formatRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (!formatRegex.test(value)) {
                    return false;
                }
                const [month, year] = value.split('/').map(Number);
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;
                if (month < 1 || month > 12) {
                    return false;
                }
                const expiryYear = 2000 + year;
                const maxYear = currentYear + 8;
                if (expiryYear < currentYear || expiryYear > maxYear) {
                    return false;
                }
                if (expiryYear === currentYear && month < currentMonth) {
                    return false;
                }
                return true;
            },
            message: 'Invalid expiry date. Ensure the format is MM/YY, the month is between 01 and 12, and the date is not in the past or out of range.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

// Создайте модель для CardList
const CardListModel = mongoose.model<ICardList>('CardList', cardListSchema);

// Схема для Card
const cardSchema = new Schema<ICard>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cards: {
        type: [cardListSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

// Модель для Card
const CardModel = mongoose.model<ICard>('Card', cardSchema);

export { CardModel, CardListModel };
