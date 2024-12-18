import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const MONGO_URL = process.env.MONGO_URL


const dbConnect = ()=>{
    if(!MONGO_URL){
        console.log('No mongo url')
    }
    mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log('DB connected successfully')
    }).catch((error)=>{
        console.log('Error connecting to DB')
    })
}

export default dbConnect