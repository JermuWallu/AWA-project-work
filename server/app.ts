import express, {Express} from "express"
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose, {Connection } from 'mongoose'
import cardRouter from './routes/card';
import userRouter from './routes/user';

dotenv.config()

// Basic express server stuff
const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 8001

// Mongoose and mongoDB
const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error :("))

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

// Routes
app.use('/api', cardRouter);
app.use('/user', userRouter);


// Port listening methods
app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`)
})