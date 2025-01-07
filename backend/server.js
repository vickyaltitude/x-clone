const express = require('express');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT;

const authRouter = require('./routes/auth.route');
const connectDB = require('./utils/connectDB');

app.use(express.json())


app.use('/api/auth',authRouter)



app.listen(PORT,()=> {
    
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})