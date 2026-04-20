const jwt=require("jsonwebtoken")
// const User=require("../models/User")
require("dotenv").config();

//auth
exports.auth=async(req,res,next)=>{
    

    try{

         // 🔥 YAHAN LAGAO (sabse upar)
    console.log("HEADERS:", req.headers)
    console.log("COOKIES:", req.cookies)
    console.log("BODY:",    req.body)

        const token=req.cookies?.token || req.body?.token || 
        req.header("Authorization")?.replace("Bearer ","");

         console.log("TOKEN:", token)
        //if token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }
        //verify the token
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log("Decoded :",decode);
            req.user=decode;
        }catch(error){
            console.log("JWT ERROR:", error.message)
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }catch(error){
        console.log("AUTH MIDDLEWARE ERROR:", error.message)
        return res.status(401).json({
            success:false,
            message:"something went wrong while vaildation the token"
        })
    }
}

//isstudent
exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student only"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot verified, please try again"
        })
    }
}

//isinstructor
exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for instructor only",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot verified, please try again"
        })
    }
}

//isadmin
exports.isAdmin=async(req,res,next)=>{
    try{
        console.log("accountType is:",req.user.accountType)
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routes for Admin only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot verified, please try again"
        })
    }
}