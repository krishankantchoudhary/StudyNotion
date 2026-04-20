const mongoose=require("mongoose")
const mailSender=require("../utils/mailSender")
const otpTemplate=require("../mail/templates/emailVerificationTemplate")

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})

//a function to send email
async function sendVerificationEmail(email,otp){
    // Create a transporter to send emails

	// Define the email options

	// Send the email
    try{
        const mailResponse=await mailSender(email,"verification email from StudyNotion", otpTemplate(otp))
        console.log(mailResponse);
       // console.log(otpTemplate(otp));
    }catch(error){
        console.log("error while sending mail",error);
        throw error;
    }
}

//Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save",async function(){
    console.log("New document saved to database");

    // Only send an email when a new document is created
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
})

module.exports=mongoose.model("OTP",OTPSchema)