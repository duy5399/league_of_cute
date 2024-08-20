const mongoose = require("mongoose");

const traitSchema = new mongoose.Schema({
    traitId: { type: String, required: true },
    traitType: { type: String, required: true },
    traitName: { type: String, required: true },
    traitIcon :{ type: String, required: true },
    description: { type: String, required: true },
    buffOn: { type: String, required: true },
    breakpoint: { type: Array, required: true },
    detailBreakpoint: { type: Array, required: true },
    activeAtTheStartOfCombat: { type: Boolean, required: true },
    composition: { type: Array, required: true },
});

const Trait = mongoose.model("trait", traitSchema);
module.exports = { Trait };