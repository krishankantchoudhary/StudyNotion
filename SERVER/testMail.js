require("dotenv").config();

const nodemailer = require("nodemailer");

async function test() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log("Verifying SMTP...");

    await transporter.verify();

    console.log("✅ SMTP Verified");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "SMTP Test",
      text: "Hello from StudyNotiontest",
    });

    console.log("✅ Mail Sent");
    console.log(info);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

test();