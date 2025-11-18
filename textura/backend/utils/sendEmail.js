import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your Google App Password
      },
    });

    const mailOptions = {
      from: `"Textura Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to: ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

export default sendEmail;
