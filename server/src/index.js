import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
dotenv.config();
import dbConnect from './db/config.js'
import data from '../data.js';

const PORT = process.env.PORT || 8000;

// middelware configuration
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

dbConnect();


// Routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use('/api/v1/user', userRouter);





app.get('/', (req, res) => {
    res.json(data);
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})