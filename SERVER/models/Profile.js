const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
    },
    contactNumber:{
        type:Number,
        trim:true
    },
    dateofbirth:{
        type:Date,
    },
    about:{
        type:String,
        trim:true,
    }
},
     {
        timestamps:true,
    },
   )

module.exports=mongoose.model("Profile",profileSchema)