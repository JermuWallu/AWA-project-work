import mongoose, {Document, Schema } from 'mongoose'

interface ICard extends Document {
    title: string;
    text: string;
}

const CardSchema = new Schema<ICard>({
    title: { type: String, required: true },
    text: { type: String, required: true }
});

interface IBoard extends Document {
    title: string;
    notes: ICard[];
}

export const BoardSchema = new Schema<IBoard>({
    title: { type: String, required: true },
    notes: { type: [CardSchema], required: true }
});

const Board: mongoose.Model<IBoard> = mongoose.model<IBoard>("Board", BoardSchema)

export {Board, IBoard}