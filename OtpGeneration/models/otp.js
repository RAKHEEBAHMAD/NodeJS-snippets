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
        expires: 1, // Expires documents after 5 seconds
    },
}, { timestamps: true });

module.exports = mongoose.model('otp', schema);
