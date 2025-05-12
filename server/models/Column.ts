import mongoose, {Document, ObjectId, Schema } from 'mongoose'
import { ICard, CardSchema } from './Card'

interface IColumn extends Document {
    owner: String;
    name: String,
    order: Number, // Order of the column in the Column
    cards: ICard[] // Array of card IDs
}

export const ColumnSchema = new Schema<IColumn>({
    owner: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    cards: { type: [CardSchema], default: [] }
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema)

export {Column, IColumn}