const mongoose = require('mongoose');

async function connectDB(){

   try{

    await mongoose.connect(`mongodb+srv://vignvick3005:${process.env.DB_PASSWORD}@clustersharpener.ru5nn.mongodb.net/x-clone?retryWrites=true&w=majority&appName=ClusterSharpener`)
    console.log('Connected to mongoDB')

   }catch(err){
      console.log(`Error while connecting to database ${err}`)
      process.exit(1)
   }
}

module.exports = connectDB;