const express = require('express')
const otpmodel = require('./models/otp')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/otp')
    .then(() => {
        console.log('db connected')
    })
    .catch((err) => {
        console.log(err);
    });

const app = express()

app.get('/otp', async (req, res) => {
    // Create an OTP document
    await otpmodel.create({
        name: "rakheeb",
        email: "rakheeb",
        otp: "12344312435454545255543543",
        expireAt: new Date(Date.now() + 1000) // Set expireAt to 5 seconds in the future
    });

    res.send('created');
});

app.listen(3000);
