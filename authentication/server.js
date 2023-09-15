const express = require('express')
const authmodel = require('./models/auth')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


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

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.get('/login',(req,res)=>{
    res.render('login',{error:null})
})

app.get('/signup',(req,res)=>{
    res.render('signup.ejs')
})

app.post('/signup',async(req,res)=>{
    const username =req.body.username
    const email =req.body.email
    const password = req.body.password
    const hashedpassword =await bcrypt.hash(password,10)
    try{
        const user = await authmodel.findOne({email})
        if(user)
        {
            return res.status(500).send('user already exists')
        }
        await authmodel.create(
            {
                username,email,password:hashedpassword
            }
        )
        res.redirect('/login')
    }catch(err)
    {
        res.send(err)
    }
})

app.post('/login',async(req,res)=>{
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
        return res.redirect('/')
    }catch(error)
    {
        res.send(error)
    }
})



app.listen(3000,()=>{ console.log('server listening')})