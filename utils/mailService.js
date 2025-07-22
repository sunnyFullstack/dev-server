const nodemailer = require("nodemailer");

const sendEmail = async (to, name, username) => {
  // Set up transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "Outlook", "Yahoo", or use custom SMTP
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.APP_PASS, // your app password (not email password)
    },
  });
  console.log(to, "to");
  // Email options
  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Registration Successful",
    text: "Welcome!",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for registering with us!</p>
      <p>We're excited to have you on board. 🚀</p>
      <p>Here is your username:- ${username}
    `,
  };

  // Send mail
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
