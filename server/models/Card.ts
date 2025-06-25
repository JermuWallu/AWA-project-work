import mongoose, {Document, Schema } from 'mongoose'

interface ICard extends Document {
    columnID: string;
    order: String;
    title: string;
    text: string;
    color: string;
}

export const CardSchema = new Schema<ICard>({
    columnID: { type: String, required: true },
    order: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String },
    color: { type: String, default: "#ffffff" } // Default color set to white
});

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard}