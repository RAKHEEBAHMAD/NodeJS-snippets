const express = require('express')
const cookieparser = require('cookie-parser')

const app = express();

app.use(cookieparser());

app.get('/',(req,res)=>{
    res.send("hello asif bhai")
})

app.get('/setcookie', (req, res) => {
    res.cookie(`Cookie token name`,`encrypted cookie string Value`,{
        maxAge: 5000,
        // expires works the same as the maxAge
        expires: new Date('01 12 2021'),
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });
    res.send('Cookie have been saved successfully');
});

app.get('/displaycookies',(req,res)=>{
    res.send(req.cookies);
})

app.listen(4000,()=>{
    console.log("Server listening");
})