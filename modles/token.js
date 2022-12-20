const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const tokenSchema = mongoose.Schema({
  userId: {
    type: ObjectId,
    require: true,
    ref: 'User',
  },
  token: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  expiresAt: {
    type: Date,
    require: true,
  },
})

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token
