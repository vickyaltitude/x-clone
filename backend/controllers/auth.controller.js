const bcrypt = require('bcrypt')

const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

module.exports.signup = async (req,res) =>{

    try{

      const {fullName,username,email,password} = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        res.status(400).json({error: 'Invalid email format'})
      }

      const userEmail = await User.findOne({email});
      const userName = await User.findOne({username});
      if(userEmail || userName){
        res.status(400).json({error:'User already exist'})
      }
      if(password.length < 6){
        res.status(400).json({error: 'Password length should be more than or equal to 6'})
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password,salt)
     
      const newUser = new User({

        fullName,
        username,
        email,
        password: passwordHashed

      })

      if(newUser){
        generateToken(newUser._id,res)
        await newUser.save()
        res.status(201).json({message:'User created successfully',newUser})

      }else{
        res.status(500).json({error:'error while creating new user internally'})
      }

    }catch(err){
        console.log('Error in signup controller',err)
        res.status(500).json({error: 'Internal server error'})
    }
  
}

module.exports.login = async (req,res) =>{

     try{
           const {username,password} = req.body;
           const user = await User.findOne({username});
           const passwordValidation = await bcrypt.compare(password,user?.password || '')
          
           if(!user || !passwordValidation){
              res.status(400).json({error:"Invalid username or password"})
           }

           generateToken(user._id,res)
           res.status(200).json({message:"Login success",user})

     }catch(err){
        console.log('Error in login controller',err)
        res.status(500).json({error: 'Internal server error'})
     }
  
}

module.exports.logout = async (req,res) =>{
   
     try{

        res.cookie('jwt','',{maxAge: 0});
        res.status(200).json({message:"User logout success"})

     }catch(err){
        console.log('Error in logout controller',err)
        res.status(500).json({error: 'Internal server error'})
     }
}


module.exports.getMe = async (req,res) =>{

    try{
    
        let user = await User.findOne({_id: req.user._id}).select("-password");
        if(!user){
            res.status(404).json({error: 'User not found'})
        }

        res.status(200).json({message:"User fetch success",user})

    }catch(err){
        console.log('Error in getme controller',err)
        res.status(500).json({error: 'Internal server error'})
    }
}
