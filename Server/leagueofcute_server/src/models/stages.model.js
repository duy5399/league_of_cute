const mongoose = require("mongoose");

const stagesSchema = new mongoose.Schema({
    stage: { type: String, required: true },
    itemClass: { type: String, required: true },
    name: { type: String, required: true },
    background: { type: String, required: true },
    price: { 
        crystal: { type: Number, default: 0 },
        gold: { type: Number, default: 0 } 
    },    
});

const Stages = mongoose.model("stages", stagesSchema);
module.exports = { Stages };