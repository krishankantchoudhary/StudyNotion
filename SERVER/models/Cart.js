const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
    totalAmount:{
        type:Number,
        default:0
    }
},
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Cart",cartSchema);