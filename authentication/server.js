const express = require('express')
const authmodel = require('./models/auth')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {verifytoken} = require('./services/authverify')
const cookieparser = require('cookie-parser')


const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/authentication')
    .then(()=>{
        console.log('db connected')
    }).catch((err)=>{
        console.log(err)
    })
    

app.set('view engine','ejs')
app.set('views','./authentication/views')
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',verifytoken,(req,res)=>{
    res.render('login',{error:null})
})

app.get('/signup',verifytoken,(req,res)=>{
    res.render('signup.ejs',{error:null})
})

app.post('/signup',verifytoken,async(req,res)=>{
    const username =req.body.username
    const email =req.body.email
    const password = req.body.password
    const hashedpassword =await bcrypt.hash(password,10)
    try{
        const user = await authmodel.findOne({email})
        if(user)
        {
            return res.status(500).render('signup',{error:"User already exists"})
        }
        const newuser = await authmodel.create(
            {
                username,email,password:hashedpassword
            }
        )
        const token = await jwt.sign({
            username: newuser.username,
            email: newuser.email
        },'supersecret')
        res.cookie('token',token)
        console.log(req.cookies)
        res.redirect('/')
    }catch(err)
    {
        console.log(err)
        res.send(err)
    }
})

app.post('/login',verifytoken,async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await authmodel.findOne({email})
        if(!user)
        {
            return res.status(500).render('login',{error:"incorrect credentials"})
        }
        const checkpassword= await bcrypt.compare(password,user.password)
        if(!checkpassword)
        {
            return res.render('login',{error:"incorrect credentials"})
        }
        const token = await jwt.sign({
            username: user.username,
            email: user.email
        },'supersecret')
        user.token = token
        console.log(token)
        res.cookie('token',token)
        console.log(req.cookies)
        return res.redirect('/')
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
})

app.get('/logout',(req,res)=>{
    const token = 'token'
    res.clearCookie(token)
    res.redirect('/login')
})


app.listen(3000,()=>{ console.log('server listening')})