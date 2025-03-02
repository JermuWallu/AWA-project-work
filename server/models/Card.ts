import mongoose, {Document, Schema } from 'mongoose'

interface ICard extends Document {
    column: String;
    order: String;
    title: string;
    text: string;
}

export const CardSchema = new Schema<ICard>({
    column: { type: String, required: true },
    order: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true }
});

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard}