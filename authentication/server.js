const express = require("express");
const authmodel = require("./models/auth");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const bodyparser = require('body-parser')
const {validtoken,isauthenticated} = require('./services/service')
const path = require('path')


const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/authentication")
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
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
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
    const token = await jwt.sign(
      {
        username: newuser.username,
        email: newuser.email,
      },
      "supersecret",{expiresIn:'15m'}
    );
    res.cookie("sid", token,{
        maxAge: 60*60*24*7,
        // expires works the same as the maxAge
        // expires: new Date('01 12 2021'),
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    });
    req.user = user
    console.log(req.user)
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post("/user/login", async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
    const token = await jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      "supersecret"
    ,{expiresIn:'15m'});
    user.token = token;
    res.cookie("sid", token,{
        maxAge: 60*60*24*7,
        // expires works the same as the maxAge
        // expires: new Date('01 12 2021'),
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });
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

  if (req.cookies.sid) {
    const pastDate = new Date(0); // Setting to a past date
    res.cookie("sid", "", {
      expires: pastDate,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  res.redirect("/login");
});

app.get('/check',validtoken(),(req,res)=>{
    res.send('back')
})


app.listen(3000, () => {
  console.log("server listening");
});
