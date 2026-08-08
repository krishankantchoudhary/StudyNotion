const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
       host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("MAIL SENT");

    return info;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = mailSender;