import express from 'express';
import mongoose from 'mongoose';
import cardRouter from './routes/card';
import userRouter from './routes/user';

const app = express();
const port = 1234;

mongoose.connect('mongodb://localhost:1234/api');

app.use(express.json());
app.use('/api', cardRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});