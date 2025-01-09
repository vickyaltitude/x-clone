const express = require('express');
require('dotenv').config();
const cookieparser = require('cookie-parser')
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
})


const app = express();
const PORT = process.env.PORT;

const authRoute = require('./routes/auth.route');
const connectDB = require('./utils/connectDB');
const userRoute = require('./routes/user.route')
const postRoute = require('./routes/post.route');
const notificationRoute = require("./routes/notification.route");

app.use(express.json())
app.use(cookieparser())

app.use('/api/auth',authRoute)

app.use('/api/user',userRoute)

app.use('/api/post',postRoute)

app.use('api/notifications',notificationRoute)

app.listen(PORT,()=> {
    
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})