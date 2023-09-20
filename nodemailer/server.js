const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

app.get("/send-email", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "raheebahmad1905@gmail.com", // Your Gmail email address
      pass: "rakahmad1905", // Your Gmail password or an app-specific password
    },
  });

  // Define the email content
  const mailOptions = {
    from: "rakheebahmad1905@gmail.com",
    to: "rakheeb1905@gmail.com", // Replace with the recipient's email address
    subject: "Hello from Node.js",
    text: "This is a test email sent from Node.js using nodemailer.",
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
  res.send("Email sent successfully");
});

app.listen(4000, () => {
  console.log("server listening");
});
