const express = require('express');
const path = require('path');
const app = express();
const model = require('./models/model');
const mongoose = require('mongoose');
const methodOverride = require("method-override");


// ========================== (setting ejs files)

app.set('view engine','ejs')
app.set('views',('./database/views'))



// ========================= (Middlewares)
app.use(methodOverride("_method"));
app.use(express.static('./database/public'))
app.use(express.urlencoded({extended:false}));


// ========================= (connect database)
mongoose.connect('mongodb://127.0.0.1:27017/learningdatabase')
        .then(()=>{console.log('db connected')})
        .catch((err)=>{
            console.log(err);
        });


// ============================== (home page)
app.get('/',(req,res)=>{
    res.render('home')
})


// =========================== (form submission and inserting into database)
app.post('/submit',async(req,res)=>{
    const uname= req.body.uname;
    const email = req.body.email;
    const msg = req.body.msg;

    // await model.insertMany({username:uname,email,msg});

    try{
        await model.create({username:uname,email,msg});
        res.redirect('/');
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("error occured");
    }
})


// ========================= (finding and parsing into the ejs file)
app.get('/display',async(req,res)=>{ 
    try{
        const all = await model.find({});
        res.render('display',{all});  //dont forget to use {all} curly brackets to send into ejs file
    }
    catch(err)
    {
        console.log(err);
    }   
})

// ========================= deleting the document in database 

app.delete('/display/:id',async(req,res)=>{
    try{
        const deletingone = await model.findOne({_id:req.params.id});
        await model.findByIdAndDelete(req.params.id); // dont forget use method override in ejs also /route/:id?_method=DELETE
        res.redirect('/display')
    }catch(err)
    {
        console.log(err)
        res.status(404).send("error occured");
    }
})



// =================== (setting port)

app.listen(3000,()=>{ console.log("listening to port")})