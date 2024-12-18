import dotenv from 'dotenv'
import express from 'express'
const app = express();

dotenv.config();

import dbConnect from './db/config.js'

const PORT = process.env.PORT

const data = [
    {
        "Project Name": "Social Media Application",
        "Project Description": "This is a backend project for a web application.",
        "Project Status": "In Progress",
        "Project Priority": "High",
    }
]

dbConnect();

app.get('/', (req, res) => {
    res.json(data);
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})