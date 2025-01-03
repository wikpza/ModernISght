import mongoose, {Document, mongo, Schema} from 'mongoose';
import ProductModel from "./product.schema";


// Регулярное выражение для проверки HEX-кода цвета
const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

// Интерфейс для документа
export interface IColor extends Document {
    name: string;
    hexCode: string;
    createdAt: Date;
    modifiedAt: Date;
}

// Схема для цвета
const colorsSchema = new Schema<IColor>({
    name: {
        unique: true,
        type: String,
        required: true
    },
    hexCode: {
        type: String,
        required: true,
        validate: {
            validator: function (value: string) {
                return hexColorRegex.test(value);
            },
            message: (props: { value: string }) => `${props.value} should be in hex-format`
        }
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    modifiedAt: {
        type: Date,
        default: () => new Date()
    }
});


colorsSchema.pre<IColor>('save', function (next, options) {
    options.validateModifiedOnly;
        this.modifiedAt = new Date();
        next();

});



colorsSchema.pre('findOneAndDelete', async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());
        const count = await mongoose.model('Product').countDocuments({
            'productVariant.colorId': docToDelete._id
        });
        if (count > 0) {
            return next(new Error('Cannot delete color because it is referenced in product variants.'));
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});


const ColorModel = mongoose.model<IColor>('Color', colorsSchema);

export default ColorModel;
