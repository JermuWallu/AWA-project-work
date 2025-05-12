import mongoose, {Document, Schema } from 'mongoose'

interface ICard extends Document {
    title: string;
    text: string;
    order: String;
}

export const CardSchema = new Schema<ICard>({
    title: { type: String, required: true },
    text: { type: String, required: true },
    order: { type: String, required: true }
});

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard}