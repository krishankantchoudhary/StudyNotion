const nodemailer=require("nodemailer")

const mailSender=async(email,title,body)=>{
    try{
        console.log("Creating transporter");
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        console.log("Before sendMail");

        let info=await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        
        console.log("After sendMail", info);

        return info;

    }catch(error){
        console.log(error.message)
    }
}

module.exports = mailSender;