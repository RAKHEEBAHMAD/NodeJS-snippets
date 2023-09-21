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
        otp: "10101010101010101010",
        expireAt: new Date(Date.now() + 10000) // Set expireAt to 5 seconds in the future
    });

    res.send('created');
});


app.get('/verify',async(req,res)=>{

    const check =await otpmodel.findOne({_id:'650c6e8fb9d95e6c46bb16d0'})
    if(check)
    {
        res.send("yes")
    }else{
        res.send('no')
    }
})

app.listen(3000);
