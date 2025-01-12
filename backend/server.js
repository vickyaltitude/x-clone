const express = require('express');
require('dotenv').config();
const cookieparser = require('cookie-parser')
const cloudinary = require('cloudinary');
const cors = require('cors')


const app = express();
const PORT = process.env.PORT;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
})


app.use(cors({
    origin :"http://localhost:3000",
    credentials: true
}))
app.use(cookieparser())

const authRoute = require('./routes/auth.route');
const connectDB = require('./utils/connectDB');
const userRoute = require('./routes/user.route')
const postRoute = require('./routes/post.route');
const notificationRoute = require("./routes/notification.route");

app.use(express.urlencoded({extended:true}))

app.use(express.json({
    limit: '5mb'
}))


app.use('/api/auth',authRoute)

app.use('/api/users',userRoute)

app.use('/api/posts',postRoute)

app.use('/api/notifications',notificationRoute)

app.listen(PORT,()=> {
    
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})