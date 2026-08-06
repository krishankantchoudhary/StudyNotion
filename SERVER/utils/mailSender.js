const nodemailer = require("nodemailer");

console.log("HOST:", process.env.MAIL_HOST);
console.log("USER:", process.env.MAIL_USER);
console.log("PASS:", process.env.MAIL_PASS ? "FOUND" : "MISSING");

const mailSender = async (email, title, body) => {
  try {
    console.log("Creating transporter");

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log("Before sendMail");

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("After sendMail", info);

    return info;
  } catch (error) {
    console.error(error);
    throw error;
}
};

module.exports = mailSender;
