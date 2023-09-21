const express = require('express')
const otpmodel = require('./models/otp')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()

mongoose.connect('mongodb://127.0.0.1:27017/otp')
    .then(() => {
        console.log('db connected')
    })
    .catch((err) => {
        console.log(err);
    });

const app = express()

app.set('view engine','ejs')
app.set("views", "./OtpGeneration/views");
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('form')
});

app.post('/submit',async(req,res)=>{
    const {name,email} = req.body
    console.log(req.body)
    const min = 1000;
    const max = 9999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    const user = await otpmodel.create(
        {
            name:name,
            email:email,
            otp:otp,
            expireAt: new Date(Date.now() + 10000)
        }
    )
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "rakheebahmad1905@gmail.com", // Your Gmail email address
          pass: process.env.gmail_passcode, // Your Gmail password or an app-specific password
        },
      });
    
      // Define the email content
      const mailOptions = {
        from: "rakheebahmad1905@gmail.com",
        to: email, // Replace with the recipient's email address
        subject: "Otp of rakheeb.com",
        html: `here is your otp : ${otp}`,
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.render('form', { error: "Error sending email" });
        } else {
          console.log(info)
          return res.render('otp');
        }
      });
      
      
})


app.post('/verify',async(req,res)=>{
    const {otp}=req.body
    const check = await otpmodel.findOne({otp:otp})
    console.log(check)
    if(check)
    {
        return res.send("you are verified")
    }else{
        return res.render('form',{error:"otp is invalid"})
    }
})

app.listen(3000);
