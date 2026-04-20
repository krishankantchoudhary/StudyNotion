const express=require("express");
const router=express.Router();

//import the required controllers and middleware functions
const{
    login,
    signUp,
    sendOTP,
    changePassword,
}=require("../controllers/Auth")

const{resetPasswordToken, resetPassword,}=require("../controllers/ResetPassword")

const{auth}=require("../middlewares/auth")

//routes for login signup authentication
//       1.Authentication routes
//route for user login
router.post("/login",login)
//route for user signup
router.post("/signup",signUp)
//route for sending otp tot the users email
router.post("/sendotp",sendOTP)
//route for changing the password
router.post("/changepassword",auth,changePassword)

//      2. Reset Password routes
//route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken)
//route for resetting users password after verification
router.post("/reset-password",resetPassword)

module.exports=router