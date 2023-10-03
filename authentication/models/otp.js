const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    otp: {
        type: String,
    },
    expireAt: {
        type: Date,
        expires: 10, // Expires documents after 5 seconds
    },
}, { timestamps: true });

module.exports = mongoose.model('authotp', schema);