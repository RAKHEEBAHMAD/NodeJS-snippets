const mongoose = require('mongoose');


const myschema = new mongoose.Schema(
    {
        username:{
            type: String,
        },
        email:{
            type: String,
        },
        msg:{
            type: String,
        }
    }
)

const mymodel = mongoose.model('mymodel',myschema)
module.exports= mymodel