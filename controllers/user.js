const asyncHandler = require("express-async-handler");
const User = require("../modles/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("../modles/token");
const crypto = require("crypto");
const { use } = require("../routes/user");

// =============================================
// =============================================
// =============================================

//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// =============================================
// =============================================
// =============================================

// Register user
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //Validateion
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //check if use alrady exsist
  const userExsist = await User.findOne({ email });
  if (userExsist) {
    res.status(400);
    throw new Error("Email already exsist");
  }

  // create user
  const user = await User.create({ name, email, password });

  // generate token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  }
});

// =============================================
// =============================================
// =============================================

// login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check the fill

  if (!email || !password) {
    res.status(400);
    throw new Error("Pelase add email and password");
  }

  // check if user exsisist
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not exsits");
  }

  // user exsist check if password is correct
  const passwordIsCorrect = bcrypt.compare(password, user.password);

  // generate token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 1000 * 86400),
    sameSite: "none",
    // secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Email and password incorrect");
  }
});

// =============================================
// =============================================
// =============================================

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    // secure : true
  });
  res.status(200).json({ message: "Successfully Log Out!" });
});

// =============================================
// =============================================
// =============================================

exports.getuser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
      });
    } else {
      throw new Error("User Not found");
    }
  } catch (err) {
    throw new Error(err);
  }
};

// =============================================
// =============================================
// =============================================

// Get login status

exports.getLoginStatus = asyncHandler(async (req, res, next) => {
  const Token = req.cookies.token;
  if (!Token) {
    return res.json(false);
  }
  const verified = await jwt.verify(Token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// =============================================
// =============================================
// =============================================

// Update user

exports.updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { name, email, photo, phone, bio } = user;
      user.email = email;
      user.name = req.body.name || name;
      user.phone = req.body.phone || phone;
      user.bio = req.body.bio || bio;
      user.photo = req.body.photo || photo;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        photo: updatedUser.photo,
        bio: updatedUser.bio,
      });
    } else {
      res.status(404);
      throw new Error("User Not Found");
    }
  } catch (err) {
    console.log(err);
  }
});

// =============================================
// =============================================
// =============================================

// Update user

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User Not found");
  }

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  const correctPassword = await bcrypt.compare(oldPassword, user.password);

  if (user && correctPassword) {
    user.password = newPassword;
    await user.save();
    res.status(200).send("Password change successfully")
  }else{
    res.status(400);
    throw new Error("Old Password is not correct")
  }
});

exports.forgetPassword = asyncHandler(async (req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({email})
  if(!user){
    res.status(404)
    throw new Error("User does not exist")
  }
  // Delete token if exists in BD
  let token = await Token.findOne({userId:user._id})
  if(token){
    await token.deleteOne();
  }

  // create reset token 
  let resetToken = crypto.randomBytes(32).toString("hex")+user.id;
  console.log("==============>",resetToken);

  // has token
   const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  console.log("----------->", hashToken);

  res.send("Forgot pass updated");

  await new Token({
    userId : user._id,
    token : hashToken,
    createdAt: Date.now(),
    expiresAt : Date.now() + 30 * (60*1000)
  }).save();


})
