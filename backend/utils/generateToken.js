const jwt = require('jsonwebtoken');

const generateToken = (userId,res) =>{
    
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    res.cookie('jwt',token,{
     maxAge: 15*24*60*1000,
     httpOnly: true, //xss attacks
     sameSite: "strict", //csrf attacks
     secure: process.env.NODE_ENV !== "development"

    })
}

module.exports = generateToken