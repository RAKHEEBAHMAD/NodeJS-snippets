// const otpmodel = require("../models/otp");
const fs = require('fs');
const temp_otp = require('../server')
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const path = require('path');
const ejs = require('ejs')
const filePath = path.join(__dirname,'../public/email.ejs');


const generateAndSendOTP = async (user,temp_otp) => {
  const {email} = user;
  const min = 1000;
  const max = 9999;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  const emailTemplate = await ejs.renderFile(filePath,{otp:otp});
  try {
    // const otpRecord = await otpmodel.create({
    //   name: name,
    //   email: email,
    //   otp: otp,
    //   expireAt: new Date(Date.now() + 10000),
    // });
    temp_otp[email]={
        email: email,
        otp: otp,
        expirationTime:new Date(Date.now() + 15000),
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rakheebahmad1905@gmail.com",
        pass: process.env.gmail_passcode,
      },
    });

    const mailOptions = {
      from: "rakheebahmad1905@gmail.com",
      to: email,
      subject: "OTP for Account Verification",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
      }
    });
  } catch (err) {
    console.error("Error generating OTP:", err);
  }
  return
};


const verifyotp = async(req,res,email,otp,temp_otp)=>{
  try {
    // const check = await otpmodel.findOne({ otp: otp });
    const check = temp_otp[email].otp==otp
    if (!check) {
      return res.render('otp', { error: 'OTP is invalid' });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).send('Internal Server Error');
  }
}





module.exports = { generateAndSendOTP,verifyotp };



