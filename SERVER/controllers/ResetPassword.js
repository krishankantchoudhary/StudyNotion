const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const crypto=require("crypto");
const bcrypt=require("bcrypt");

//resetpasswordtoken
exports.resetPasswordToken=async(req,res)=>{
    try{
    //get email from request body
    const{email}=req.body;
    //check user for this email, email validation
    const user= await User.findOne({email:email});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User with this email not found"
        })
    }
    //token generate
    const token = crypto.randomBytes(20).toString("hex");

    //update user by adding tokn and expiry time
    const updatedDetails=await User.findOneAndUpdate(
                                            {email:email},
                                            {
                                                token:token,
                                                resetPasswordExpires:Date.now()+5*60*1000,
                                            },
                                            {new:true},
                                        )
     console.log("DETAILS", updatedDetails); 
     console.log("ye real token hai:",token)                                  
    //create url
    const url=`http://localhost:3000/update-password/${token}`
    //send mail containing the url
    await mailSender(email,
        "Password Reset Link",
        `Password Reset Link: ${url}`
    )
    //retrun response 
    return res.status(200).json({
        success:true,
        message:"Email send Successfully, please check email and change password"
    })                                   
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending  password reset mail "
        })
    }
}



//resetpassword

exports.resetPassword=async(req,res)=>{
    try{
        //data fetch
        const{password,confirmPassword,token}=req.body
        console.log("password",password)
        console.log("confP",confirmPassword)
        console.log("token",token)
        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        }
        //get userdetails from db using token
        console.log("ye hai user",User)
        const userDetails= await User.findOne({token:token});
        console.log("ye hai userdeatils",userDetails)
        //if no entry invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid"
            })
        }
        //token time check
        console.log("Expiry:", userDetails.resetPasswordExpires);
console.log("Now:", Date.now());
        if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
        //hash password
        const hashedPassword=await bcrypt.hash(password,10)

        //password update 
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset Successfully"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending  password reset mail"
        })
    }
}