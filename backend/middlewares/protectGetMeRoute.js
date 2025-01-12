const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


const protectGetMeRoute = async (req,res,next) =>{
     
  
   
    try{
       const token = req.cookies.jwt;

       if(!token){
          return res.status(400).json({error:"Authentication token not found"})
       }

       const decode = jwt.verify(token,process.env.JWT_SECRET);
     
       if(!decode){
        return res.status(400).json({error:"Authentication token is invalid"})
       }

       const user = await User.findOne({_id: decode.userId}).select("-password");

       if(!user){
        return res.status(400).json({error:"User not found"})
       }

       req.user = user;
       next();
    }catch(err){
        console.log('Error in protectgetmeroute middleware function',err)
        res.status(500).json({error:"Internal server error"})
    }

}

module.exports = protectGetMeRoute