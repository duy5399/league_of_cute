const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    uid: {
        type : String,
        required : true
    },
    username: { 
        type: String, 
        required: true 
    },
    nickname: {
        type: String, 
        required: true,
        minlength: 3
    },
    profileImg: { 
        type: String, 
        default: 'Demacia_Crest_profileicon'
    },
    level: { 
        type: Number, 
        default: 1
    },
    rank: { 
        type: String, 
        default: 'Bronze'
    },
    points: { 
        type: Number, 
        default: 0
    },
    isOnline: { 
        type: Boolean, 
        default: false
    },
    bio: { 
        type: String, 
        default: 'I am the best'
    },
    friends: { 
        type: Array, 
        default: []
    },
    sentFriendRequests: { 
        type: Array, 
        default: []
    },
    friendRequests: { 
        type: Array, 
        default: []
    },
    socketID: { 
        type: String, 
        default: ''
    },
    lastOnline: { 
        type: String, 
        default: ''
    },
});

const Character = mongoose.model("Character", characterSchema);

module.exports = { Character };