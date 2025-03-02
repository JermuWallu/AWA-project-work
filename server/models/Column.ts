import mongoose, {Document, Schema } from 'mongoose'

interface ICard extends Document {
    column: number;
    title: string;
    text: string;
}

const CardSchema = new Schema<ICard>({
    column: { type: Number, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true }
});

interface IColumn extends Document {
    owner: number;
    name: String,
    order: Number, // Order of the column in the Column
    cards: ICard[]
}

export const ColumnSchema = new Schema<IColumn>({
    owner: { type: Number, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    cards: { type: [CardSchema], default: [] }
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema)

export {Column, IColumn}