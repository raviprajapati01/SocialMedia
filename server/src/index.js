import dotenv from 'dotenv'
import express from 'express'
const app = express();

dotenv.config();

const PORT = process.env.PORT || 4000

const data = [
    {
        "Project Name": "Social Media Application",
        "Project Description": "This is a backend project for a web application.",
        "Project Status": "In Progress",
        "Project Priority": "High",
    }
]

app.get('/', (req, res) => {
    res.json(data);
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})