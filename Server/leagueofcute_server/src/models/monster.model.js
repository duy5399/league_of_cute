const mongoose = require("mongoose");

const monsterSchema = new mongoose.Schema({
    unitId: { type: String, default: '' },
    unitName: { type: String, default: '' },
    tier: { type: Number, default: 0 },
    background:{ type: String, default: '' },
    attackDamage : { type: Array, default: [] },
    attackRange: { type: Number, default: 0 },
    aspd: { type: Number, default: 0 },
    arPen: { type: Number, default: 0 },
    arPenPer: { type: Number, default: 0 },
    abilityPower: { type: Number, default: 0 },
    mrPen: { type: Number, default: 0 },
    mrPenPer: { type: Number, default: 0 },
    critRate: { type: Number, default: 0 },
    critDamage: { type: Number, default: 0 },
    maxHP : { type: Array, default: [] },
    sp: { type: Number, default: 0 },
    maxSP: { type: Number, default: 0 },
    ar: { type: Number, default: 0 },
    mr: { type: Number, default: 0 },
    hpRegen: { type: Number, default: 0 },
    spRegen: { type: Number, default: 0 },
    physicalVamp: { type: Number, default: 0 },
    spellVamp: { type: Number, default: 0 },
    moveSpd: { type: Number, default: 0 },
    abilityName:{ type: String, default: '' },
    abilityIcon:{ type: String, default: '' },
    abilityDescription:{ type: String, default: '' },
});

const Monster = mongoose.model("monster", monsterSchema);
module.exports = { Monster };