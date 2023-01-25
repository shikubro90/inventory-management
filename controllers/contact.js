const asyncHandler = require("express-async-handler")
const User = require("../modles/user")

const contact = asyncHandler(async(req,res)=>{

    const {subject, message} = req.body;
    const user = await User.findById(req.user._id)

    if(!user){
        res.status(400);
        throw new Error("User not found, please signup")
    }

    // validation
    




})

module.exports = {contact}
