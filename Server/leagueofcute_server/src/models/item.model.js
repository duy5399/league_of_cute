const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    itemId: { 
        type: String, 
        required: true 
    },
    itemName: { 
        type: String, 
        required: true 
    },
    itemIcon: { 
        type: String, 
        required: true 
    },
    itemType: { 
        type: String, 
        required: true 
    },
    itemStats: { 
        type: Object, 
        required: true 
    },
    descriptionStat: { 
        type: String, 
        required: true 
    }, 
    descriptionPassive: { 
        type: String, 
        required: true 
    },  
    slotRequired: { 
        type: Number, 
        default: 1 
    },  
    isUnique: { 
        type: Boolean, 
        default: false 
    }, 
    combination: { 
        type: Object, 
        required: true 
    }, 
    itemPassive: { 
        type: Array, 
        required: true 
    },    
});
const Item = mongoose.model("item", itemSchema);

module.exports = { Item };