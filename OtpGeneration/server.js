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
        to: email,
        subject: "Otp of rakheeb.com",
        html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>OTP Email</title>
          <style>
            /* Styles for the email body */
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              margin: 0;
              padding: 0;
            }
        
            /* Styles for the container */
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
        
            /* Styles for the heading */
            h1 {
              color: #007bff;
            }
        
            /* Styles for the OTP box */
            .otp-box {
              background-color: #007bff;
              color: #fff;
              padding: 10px;
              text-align: center;
              font-size: 24px;
              border-radius: 5px;
            }
        
            /* Styles for the OTP text */
            .otp {
              font-size: 36px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>OTP Email</h1>
            <p>Here is your OTP:</p>
            <div class="otp-box">
              <span class="otp">${otp}</span>
            </div>
          </div>
        </body>
        </html>`,
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.render('signup', { error: "Error sending email" });
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
