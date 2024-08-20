const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    itemClass: { type: String, required: true },
    name: { type: String, required: true },
    background: { type: String, required: true },
    price: { 
        crystal: { type: Number, default: 0 },
        gold: { type: Number, default: 0 } 
    },    
});

const Store = mongoose.model("store", storeSchema);
module.exports = { Store };