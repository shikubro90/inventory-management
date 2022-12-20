const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types;

const productSchema = mongoose.Schema({
    user : {
        type: ObjectId,
        require : true,
        ref : "User"
    },

})