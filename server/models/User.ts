import mongoose, {Document, Schema } from 'mongoose'
import { IBoard, BoardSchema } from './Board'


interface IUser extends Document {
    email: string
    password: string
    board: IBoard[]
}

const UserSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    board: {type: [BoardSchema]}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export {User, IUser}