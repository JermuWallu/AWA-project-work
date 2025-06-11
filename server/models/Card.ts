import mongoose, {Document, Schema } from 'mongoose'

interface ICard extends Document {
    columnID: string;
    title: string;
    text: string;
    order: String;
}

export const CardSchema = new Schema<ICard>({
    columnID: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String },
    order: { type: String, required: true }
});

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard}