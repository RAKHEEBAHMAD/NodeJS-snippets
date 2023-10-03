const express = require("express");
const authmodel = require("./models/auth");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const {validtoken,isauthenticated} = require('./services/service')
const path = require('path')
const {generateAndSendOTP} = require('./middleware/otpgeneration')
const dotenv = require("dotenv").config();


const registration_otp = {}
const forgotpassword_otp = {}


const app = express();
mongoose
  .connect('mongodb://127.0.0.1:27017/authentication')
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set("views", "./authentication/views");
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(express.json());


app.get("/",validtoken(),(req, res) => {
  res.render("home",{user:req.user});
});

app.get("/login",isauthenticated(), (req, res) => {
  res.render("login", { error: null });
});

app.get("/signup",isauthenticated(), (req, res) => {
  res.render("signup", { error: null });
});



app.post("/user/signup", async (req, res) => {
  const {username,email,password,OTP} = req.body
  const pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  if(registration_otp[email].otp!=OTP)
  {
    return res.status(500).render("signup", { error: "OTP is invalid!" });
  }
  if(!password.match(pattern))
  {
    return res.status(500).render("signup", { error: "Min 8 characters,least 1 uppercase letter and 1 lowercase letter and 1 number and 1 special character" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  try {
    const user = await authmodel.findOne({ email });
    if (user) {
      return res.status(500).render("signup", { error: "User already exists" });
    }
    const newuser = await authmodel.create({
      username,
      email,
      password: hashedpassword,
    });
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authmodel.findOne({ email });
    if (!user) {
      return res
        .status(500)
        .render("login", { error: "incorrect credentials" });
    }
    const checkpassword = await bcrypt.compare(password, user.password);
    if (!checkpassword) {
      return res.render("login", { error: "incorrect credentials" });
    }
    const accesstoken = await jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      "supersecret"
    ,{expiresIn:'1h'});
    // const refreshtoken = await jwt.sign(
    //   {
    //     username: user.username,
    //     email: user.email,
    //   },
    //   "supersecret"
    // ,{expiresIn:'15m'});
    res.cookie("sid", accesstoken);
    // res.cookie('token',refreshtoken,{
    //   maxAge: 60*60*24*7,
    //     // expires works the same as the maxAge
    //     // expires: new Date('01 12 2021'),
    //     secure: true,
    //     httpOnly: true,
    //     sameSite: 'lax'
    // })
    return res.redirect('/')
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(err);
  }
});

app.get("/logout", (req, res) => {
  const cookies = req.cookies;
  for (const cookieName in cookies) {
    res.clearCookie(cookieName);
  }
  // if (req.cookies.sid) {
  //   const pastDate = new Date(0); // Setting to a past date
  //   res.cookie("sid", "", {
  //     expires: pastDate,
  //     httpOnly: true,
  //     sameSite: 'lax',
  //   });
  // }
  res.redirect("/login");
})


app.post('/sendotp', async (req, res) => {
  const {email,type,otp } = req.body;
  if(type=='new')
  {
    const checkexist = await authmodel.findOne({email})
    if(checkexist)
    {
      return res.status(400).json({msg: "Email Already Exist"})
    }
    await generateAndSendOTP(req.body, registration_otp);
    
  }
  else if(type=="forgotpasswordnew")
  {
    const checkexist = await authmodel.findOne({email})
    if(!checkexist)
    {
      return res.status(400).json({msg: "Email Not Exist"})
    }
    await generateAndSendOTP(req.body, forgotpassword_otp);
  }
  else if(type=='forgotpasswordverify')
  {
    if(forgotpassword_otp[email]?.otp==otp)
    {
      return res.status(200).json({msg: "OTP is Verified!"})
    }
    else{
      return res.status(200).json({msg: "Incorrect OTP"})
    }
  }
  else{
      
    if(registration_otp[email]?.otp==otp)
    {
      return res.status(200).json({msg: "OTP is Verified!"})
    }
    else{
      return res.status(200).json({msg: "Incorrect OTP"})
    }
  }
});

app.get('/forgotpassword',(req,res)=>{
  res.render('forgot_password',{error:null});
})

app.post('/forgotpassword',async(req,res)=>{
  const {email,OTP,password} = req.body
  if(forgotpassword_otp[email]?.otp!=OTP)
  {
    return res.status(400).render('forgot_password',{error:"Incorrect OTP"})
  }
  const exist = await authmodel.findOne({email})
  if(!exist)
  {
    return res.status(400).render('forgot_password',{error:"Email Not Exist"})
  }
  console.log('i am here')
  const hashedpassword = await bcrypt.hash(password,10)
  await authmodel.updateOne({email},{$set:{password:hashedpassword}})
  console.log('password changed')
  return res.redirect('/')
})

app.get('/deleteaccount',validtoken(),async(req,res)=>{
  const {email} = req.user
  const x = await authmodel.deleteOne({email})
  return res.redirect('/logout')
})

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname+'/public','/404.html'));
});

app.listen(3000, () => {
  console.log("server listening");
});
