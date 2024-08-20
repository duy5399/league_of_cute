const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillId: { 
        type: String, 
        required: true 
    },
    skillName: { 
        type: String, 
        required: true 
    },
    skillType : {
        type: String, 
        required: true 
    },
    isNormalAttack : {
        type: Boolean, 
        required: true 
    },
    description: {
        type: String, 
        required: true,
    },
    targetType: {
        type: String, 
        required: true,
    },
    range: {
        type: Number, 
        required: true,
    },
    canBeSilenced: {
        type: Boolean, 
        required: true,
    },
    canInterruptOnHeadTime: {
        type: Boolean, 
        required: true,
    },
    canInterrupt: {
        type: Boolean, 
        required: true,
    },
    canMoveWhenCast: {
        type: Boolean, 
        required: true,
    },
    animName: {
        type: String, 
        required: true,
    },
    castHeadTime: {
        type: Number, 
        required: true,
    },
    castingTime: {
        type: Number, 
        required: true,
    },
    castBackTime: {
        type: Number, 
        required: true,
    },
    scaleAnimSpeed: {
        type: Boolean, 
        required: true,
    },
    skillInfo: {
        type: Array, 
        required: true
    },

    targetFilter: {
        type: String, 
        required: true
    },
    canUseSelf: {
        type: String, 
        required: true
    },
    searchAmong: {
        type: String, 
        required: true
    },
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = { Skill };