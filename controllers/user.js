const asyncHandler = require("express-async-handler");
const User = require("../modles/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("../modles/token");
const crypto = require("crypto");

//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
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
    expires: new DataTransfer(Date.now() + 7 * 1000 * 86400),
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
