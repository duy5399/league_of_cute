const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    uid: { 
        type: String, 
        required: true 
    },
    gold: { 
        type: Number, 
        default: 0
    },
    crystal: { 
        type: Number, 
        default: 0
    },
    tacticianUnlocked: { 
        type: [String], 
        default: ['petavatar']
    },
    arenaSkinUnlocked: { 
        type: [String], 
        default: ['battlefield1']
    },
    boomUnlocked: { 
        type: [String], 
        default: ['boomArcadeBomb']
    }, 
    tacticianEquip: { 
        type: String, 
        default: 'petavatar'
    },  
    arenaSkinEquip: { 
        type: String, 
        default: 'battlefield1'
    },  
    boomEquip: { 
        type: String, 
        default: 'boomArcadeBomb'
    },    
});
const Inventory = mongoose.model("inventory", inventorySchema);

module.exports = { Inventory };