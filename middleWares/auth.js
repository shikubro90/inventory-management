const asyncHandler = require("express-async-handler")
const User = require("../modles/user")
const jwt = require("jsonwebtoken");

const protect = async (req,res,next)=>{
    try{
        //if has no token
        const token = req.cookies.token;
        if(!token){
            res.status(401);
            throw new Error("Not authorize please login")
        }
        // verify token
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        
        // get user id from token
        const user = await User.findById(verifyToken.id).select("-password");

        if(!user){
            res.status(401);
            throw new Error("No user found")
        }
        req.user = user
        next()

    }catch(err){
        res.status(401);
        throw new Error("Not authorized user, please login")
    }
}

module.exports = protect