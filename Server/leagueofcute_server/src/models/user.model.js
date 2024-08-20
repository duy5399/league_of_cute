const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: {
        type: String, 
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please add a valid email address.',],
        required: true,
        unique: true,
        lowercase: true,
        dropDups: true
    },
    create_time: { 
        type: String, 
        default: ''
    },
    banned: { 
        type: Number, 
        default: 0
    },
    haveCharacter: { 
        type: Boolean, 
        default: false
    },
    last_time_login: { 
        type: String, 
        default: ''
    },
    last_time_logout: { 
        type: String, 
        default: ''
    },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };