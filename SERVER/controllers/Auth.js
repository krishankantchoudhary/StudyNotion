const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const Profile=require("../models/Profile");
require("dotenv").config();
const {passwordUpdated}=require("../mail/templates/passwordUpdate")


//sendotp for email verification
exports.sendOTP=async(req,res)=>{
    try{
        //fetch emial from req body
        const{email}=req.body;

        //check user already exists or not
        const checkUser=await User.findOne({email});
        if(checkUser){
            return res.status(401).json({
                success:false,
                message:"User already registred",
            })
        }

        //generste otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("otp is",otp)

        //check otp is unique or not
        const result=await OTP.findOne({otp:otp});
        console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
           // result=await OTP.findOne({otp:otp})
        }

        // const otpPayload={email,otp}
        //crate entry for OTP
        const otpBody=await OTP.create({email,otp});
        console.log("ye hai otp body:",otpBody);

        return res.status(200).json({
            success:true,
            message:"OTP saved in db successfully",
            otp,
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"internal server isssue"
        })

    }
}


//signup

exports.signUp=async(req,res)=>{
    try{
        //fetch karo req body se
        const{
            firstName,
            lastName,
            email,
            contactNumber,
            password,
            confirmPassword,
            accountType,
            otp}=req.body;
        //validate kar lo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fileds are required",
            })
        }
        //2 password ko match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password confirmPassword not match, please try again"
            })
        }
        //check user exists or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registred"
            })
        }

        //find most recent otp
        const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("recentotp:",recentOTP);
        console.log("otp:",otp)
        //validate otp
        if(recentOTP.length===0){
            return res.status(400).json({
                success:false,
                message:"otp not found"
            })
        }else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10)
        //create the additional profile for user
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })
        //retrun res
        return res.status(200).json({
            success:true,
            message:"User is successfully registred",
            user
        })
    }catch(error){
        console.log("error occured while in signup",error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registred successfully, pleae try again"
        })
    }
}

//login
exports.login=async(req,res)=>{
    try{
        //get data
        const{
            email,
            password
        }=req.body
        //validation
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again",
            });
        }
        //user check
        const user=await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            })
        }
        //generte JWT after matchinng password
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"24h"
            });
        user.token=token;
        user.password=undefined;

        //set cookie for token and return success reponse
        const options={
            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully"
            })

        }else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })

        }
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Logged failure, please try again"
        })
    }
}



// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};